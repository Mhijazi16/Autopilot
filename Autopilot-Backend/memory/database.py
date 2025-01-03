from redis.client import Redis
from typing import List, Literal
from pydantic import BaseModel
import redis
import os
import time

class Job(BaseModel):
    agent: str
    task: str

class Task(BaseModel):
    id: int
    name: str
    Jobs: List[Job]

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

def init() -> Redis:
    os.system("redis-server &")
    time.sleep(2)

    memory = get_memory() 
    populate_memory(memory)

    return memory

def populate_memory(memory):
    toolbar = ToolbarSchema()
    memory.set("feedback", "Off")
    memory.set("command", "not-set")
    memory.set("status", "not-set")
    memory.hset("toolbar", mapping=toolbar.model_dump())

def get_memory() -> Redis:
    return redis.Redis(
        host='localhost',
        port=6379,
        decode_responses=True
    )
