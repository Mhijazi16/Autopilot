from pydantic import BaseModel, Field
from typing import List

class Step(BaseModel): 
    """ Step is the name of Tool and parameters that should be sent to that tool"""
    tool: str = Field("the name of tool should be executed in this step")
    params: str = Field("parameters that should be sent to this tool")
