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
