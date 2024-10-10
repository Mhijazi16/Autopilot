from abc import ABC, abstractmethod
from langgraph.graph.state import CompiledStateGraph

class Workflow(ABC): 

    @abstractmethod
    def compile_workflow(self) -> CompiledStateGraph:
        pass

class Autopilot: 
    def __init__(self, workflow: Workflow) -> None:
        self.workflow = workflow

    def build_workflow(self): 
        return self.workflow.compile_workflow()
