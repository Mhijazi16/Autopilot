import redis
import time
import os

def init():
    os.system("redis-server &")
    time.sleep(2)
    memory = redis.Redis(host='localhost',
                         port=6379,
                         decode_responses=True)
    return memory
