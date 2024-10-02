from langchain_core.messages import AIMessage,HumanMessage
from langchain_core.messages.system import SystemMessage
from langchain_ollama.chat_models import ChatOllama
from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode, tools_condition 
import os

def execute(command): 
    """ 
    execute is a tool that takes in a 
    command and executes it on the linux 
    shell then returns the result 
    Args: 
        command
    Returns 
        the output of the command
    """
    try: 
        print(f"[🪵] Executing {command}")
        output = os.popen(command).read()
        print(f"[🪵] Command Executed")
        print(f"[🪵] Result: {output}")
        return output 
    except Exception as ex: 
        print(f"[🪵] An Error Occured {ex}")
        return f"Error occured {ex}"

class AgentState(MessagesState): 
    command: tuple[str,str]

llm = ChatOllama(model="llama3.2",temperature=0)
tools = [execute]
shell_agent = llm.bind_tools(tools)

def planner(state: AgentState): 
    print("planning....")
    return {"messages": [shell_agent.invoke(state["messages"])]}

builder = StateGraph(AgentState)
builder.add_node("planner",planner)
builder.add_node("tools",ToolNode(tools))

builder.add_edge(START,"planner")
builder.add_conditional_edges("planner",tools_condition)
builder.add_edge("tools","planner")
builder.add_edge("planner",END)

workflow = builder.compile()
