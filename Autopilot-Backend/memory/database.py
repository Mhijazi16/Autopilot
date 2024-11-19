import redis
import time
import os


memory = None
def init():
    global memory
    os.system("redis-server &")
    time.sleep(2)
    memory = redis.Redis(host='localhost',
                         port=6379,
                         decode_responses=True)

    populate_memory()
    return memory

def populate_memory():
    global memory
    toolbar = {
        "Navigation": "False", 
        "Coder": "False",
        "Shell": "False",
        "Github": "False",
        "Users": "False",
        "Monitor": "False",
        "Packages": "False",
        "Network": "False",
        "Troubleshooter": "False",
    }

    if memory:
        memory.set("feedback", "False")
        memory.hset("toolbar", mapping=toolbar)

    return memory

def get_memory():
    return memory
