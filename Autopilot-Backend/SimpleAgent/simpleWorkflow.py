from typing import override
from langchain_core.messages.human import HumanMessage
from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langchain_ollama import ChatOllama
from shelltool import execute
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

    def retry(self, state: AgentState): 
        last_message = state['messages'][-1]
        command = self.parse_command(last_message)
        prompt = f"""
         I don't want to use this command: {command},
         can you think of any other commands?
        """
        msg = HumanMessage(prompt)
        return {"messages": msg}

    def should_execute(self, state: AgentState): 
        print("-- inside should execute")

        last_message = state['messages'][-1]
        isToolCall = "tool_calls" in str(last_message)
        isCommand = "command" in str(last_message)

        if isToolCall and isCommand: 
            command = self.parse_command(last_message)
            choice = input(f"THE Agent wants to execute {command} accept: ")
            if choice == 'y': 
                return "tools"
            return "retry"
        return END

    @override
    def compile_workflow(self):

        builder = StateGraph(AgentState)
        builder.add_node("planner",self.planner)
        builder.add_node("tools",ToolNode(tools))
        builder.add_node("retry",self.retry)

        builder.add_edge(START,"planner")
        builder.add_conditional_edges("planner",self.should_execute)
        builder.add_edge("tools","planner")
        builder.add_edge("retry","planner")

        graph = builder.compile()
        return graph

