from abc import ABC, abstractmethod
from langgraph.graph.state import CompiledStateGraph

class Workflow(ABC): 

    @abstractmethod
    def compile_workflow(self) -> CompiledStateGraph:
        pass
