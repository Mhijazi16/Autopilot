from typing import Literal
from pydantic import BaseModel
import redis
import time
import os

memory = None

class ToolbarSchema(BaseModel):
    Navigation: Literal["On","Off"] = "Off"
    Coder: Literal["On","Off"] = "Off"
    Shell: Literal["On","Off"] = "Off"
    Github: Literal["On","Off"] = "Off"
    Users: Literal["On","Off"] = "Off"
    Monitor: Literal["On","Off"] = "Off"
    Packages: Literal["On","Off"] = "Off"
    Network: Literal["On","Off"] = "Off"
    Troubleshooter: Literal["On","Off"] = "Off"

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
