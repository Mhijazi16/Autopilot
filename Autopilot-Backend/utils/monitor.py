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
        # if gpu.name == "NVIDIA GeForce RTX 3060 Laptop GPU": 
        return gpu.load * 100
    return 0

def get_gpu_memory():
    gpus = GPUtil.getGPUs()
    for gpu in gpus:
        # if gpu.name == "NVIDIA GeForce RTX 3060 Laptop GPU": 
        return gpu.memoryUsed / gpu.memoryTotal * 100
    return 0

def get_specs():
        return {
            "cpu-usage": get_cpu_usage(), 
            "ram-usage": get_ram_usage(), 
            "gpu-usage": get_gpu_usage(), 
            "gpu-mem-usage": get_gpu_memory(), 
        }
