import psutil
import GPUtil 
import time

def get_cpu_usage():
    return psutil.cpu_percent(interval=1)

def get_ram_usage():
    ram = psutil.virtual_memory()
    return ram.percent

def get_gpu_usage():
    gpus = GPUtil.getGPUs()
    for gpu in gpus:
        if gpu.name == "NVIDIA GeForce RTX 3060 Laptop GPU": 
            return gpu.load * 100
    return 0
