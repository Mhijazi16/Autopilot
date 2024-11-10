from typing import override
from langchain_core.messages.human import HumanMessage
from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode,  tools_condition
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from Tools.shell_tools import execute
from workflow import Workflow

tools = [execute]
llm = ChatOllama(model="llama3.1",temperature=0).bind_tools(tools)

class AgentState(MessagesState): 
    command: str 

class SimpleWorkflow(Workflow): 
    def planner(self, state: AgentState): 
        return {"messages": [llm.invoke(state["messages"])]}

    @override
    def compile_workflow(self, feedbackOn = False):

        builder = StateGraph(AgentState)
        builder.add_node("planner",self.planner)
        builder.add_node("tools",ToolNode(tools))

        builder.add_edge(START,"planner")
        builder.add_conditional_edges("planner",tools_condition)

        memory = MemorySaver()

        if feedbackOn: 
            graph = builder.compile(memory, interrupt_before=['feedback'])
        else: 
            graph = builder.compile(memory)

        return graph

