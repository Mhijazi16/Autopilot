import redis
import time
import os

def init():
    os.system("redis-server &")
    time.sleep(2)
    memory = redis.Redis(host='localhost',
                         port=6379,
                         decode_responses=True)

    return populate_memory(memory)

def populate_memory(memory):
    toolbar = {
        "Navigation": False, 
        "Coder": False,
        "Shell": False,
        "Github": False,
        "Users": False,
        "Monitor": False,
        "Packages": False,
        "Network": False,
        "Troubleshooter": False,
    }

    memory.set("feedback", True)
    memory.hset("toolbar", mapping=toolbar)
    return memory
