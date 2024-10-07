from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.messages.human import HumanMessage
from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langchain_ollama import ChatOllama
from shelltool import execute
 
tools = [execute]
llm = ChatOllama(model="llama3.1",temperature=0).bind_tools(tools)

class AgentState(MessagesState): 
    command: str 

def planner(state: AgentState): 
    print("-- inside planner")
    return {"messages": [llm.invoke(state["messages"])]}

def parse_command(call): 
    return call.tool_calls[-1]['args']['command']

def retry(state: AgentState): 
    print("-- inside retry")
    last_message = state['messages'][-1]
    command = parse_command(last_message)
    msg = HumanMessage(f"I don't want to use this command: {command}, can you think of any other commands?")
    return {"messages": msg}

def should_execute(state: AgentState): 
    print("-- inside should execute")

    last_message = state['messages'][-1]
    isToolCall = "tool_calls" in str(last_message)
    isCommand = "command" in str(last_message)

    if isToolCall and isCommand: 
        command = parse_command(last_message)
        choice = input(f"THE Agent wants to execute {command} accept: ")
        if choice == 'y': 
            return "tools"
        return "retry"
    return END

def compile_workflow():

    builder = StateGraph(AgentState)
    builder.add_node("planner",planner)
    builder.add_node("tools",ToolNode(tools))
    builder.add_node("retry",retry)

    builder.add_edge(START,"planner")
    builder.add_conditional_edges("planner",should_execute)
    builder.add_edge("tools","planner")
    builder.add_edge("retry","planner")

    graph = builder.compile()
    return graph

