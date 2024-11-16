import psutil
import GPUtil 
import time

def get_cpu_usage():
    return psutil.cpu_percent(interval=1)
