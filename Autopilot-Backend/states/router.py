from typing import Literal
from pydantic import BaseModel, Field


class TaskUnit(BaseModel): 
    """this represnt a unit of work of agent"""
    agent: Literal["Coding", "Shell", "Navigation","Users","Github"] = Field("name of agent to handle task")
    task: str = Field("this represnt the prompt or task that should be said to the agent")
