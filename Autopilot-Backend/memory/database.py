from pydantic import BaseModel
import redis
import time
import os

memory = None

class ToolbarSchema(BaseModel):
    Navigation: str = "Off"
    Coder: str = "Off"
    Shell: str = "Off"
    Github: str = "Off"
    Users: str = "Off"
    Monitor: str = "Off"
    Packages: str = "Off"
    Network: str = "Off"
    Troubleshooter: str = "Off"

def init():
    global memory
    os.system("redis-server &")
    time.sleep(2)
    memory = redis.Redis(
        host='localhost',
        port=6379,
        decode_responses=True
    )

    populate_memory()
    return memory

def populate_memory():
    global memory
    toolbar = ToolbarSchema()

    if memory:
        memory.set("feedback", "Off")
        memory.hset("toolbar", mapping=toolbar.model_dump())

    return memory

def get_memory():
    return memory
