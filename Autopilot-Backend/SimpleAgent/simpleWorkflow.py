from typing import override
from langchain_core.messages.human import HumanMessage
from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode
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

    def parse_command(self, call): 
        return call.tool_calls[-1]['args']['command']

    def feedback(self, state: AgentState): 
        pass

    def should_execute(self, state: AgentState): 
        print("-- inside should execute")

        last_message = state['messages'][-1]
        isToolCall = "tool_calls" in str(last_message)
        isCommand = "command" in str(last_message)

        if isToolCall and isCommand: 
            command = self.parse_command(last_message)
            choice = input(f"THE Agent wants to execute {command} accept: ")
            if choice in ['y','Y','Yes','yes']: 
                return "tools"
            return "feedback"
        return END

    @override
    def compile_workflow(self, feedbackOn = False):

        builder = StateGraph(AgentState)
        builder.add_node("planner",self.planner)
        builder.add_node("tools",ToolNode(tools))
        builder.add_node("feedback",self.feedback)

        builder.add_edge(START,"planner")
        builder.add_conditional_edges("planner",self.should_execute)
        builder.add_edge("tools","planner")
        builder.add_edge("feedback","planner")

        memory = MemorySaver()

        if feedbackOn: 
            graph = builder.compile(memory, interrupt_before=['feedback'])
        else: 
            graph = builder.compile(memory)

        return graph

