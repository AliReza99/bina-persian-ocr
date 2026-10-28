"""Process and GPU metrics, sampled only while the admin page polls, kept in memory for its charts."""
import collections, os, subprocess, threading, time

INTERVAL = 5  # min seconds between samples, however many tabs poll
STALE = 30  # a longer gap means nobody watched; start the history over
samples = collections.deque(maxlen=120)  # 10 minutes at INTERVAL
started = time.time()
_lock = threading.Lock()
_last = None  # (cpu seconds, monotonic) of the previous sample


def _nvidia():
    """GPU load % and temperature C. shortcut: first GPU only, query per GPU when running multi-GPU."""
    try:
        out = subprocess.run(['nvidia-smi', '--query-gpu=utilization.gpu,temperature.gpu', '--format=csv,noheader,nounits'],
                             capture_output=True, text=True, timeout=3).stdout
        load, temp = out.splitlines()[0].split(',')
        return int(load), int(temp)
    except Exception:
        return None, None


def _rss_mb():
    """Resident memory in MB. shortcut: Linux only (None elsewhere, the card shows '-'), use psutil if ported."""
    try:
        with open('/proc/self/statm') as f:
            return round(int(f.read().split()[1]) * os.sysconf('SC_PAGE_SIZE') / 2**20)
    except (OSError, AttributeError):
        return None


def poll(gpu_mem=None):
    """Take a sample if due and return the history. gpu_mem: callable returning (used_mb, total_mb), or None on CPU."""
    global _last
    with _lock:
        cpu, t = sum(os.times()[:2]), time.monotonic()
        if _last and t - _last[1] < INTERVAL:
            return list(samples)
        if not _last or t - _last[1] > STALE:
            samples.clear()
        load, temp = _nvidia() if gpu_mem else (None, None)
        mem = gpu_mem() if gpu_mem else None
        # cpu % needs a previous sample within the window; the first after a gap has none
        cpu_pct = round((cpu - _last[0]) / (t - _last[1]) * 100, 1) if samples and _last else None
        samples.append({'t': time.time(), 'cpu': cpu_pct, 'rss_mb': _rss_mb(),
                        'gpu_load': load, 'gpu_temp': temp,
                        'gpu_used_mb': mem and mem[0], 'gpu_total_mb': mem and mem[1]})
        _last = cpu, t
        return list(samples)
