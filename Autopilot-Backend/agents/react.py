import time
from memory.database import get_memory
from langchain_ollama import ChatOllama
from langgraph.graph import MessagesState
from langgraph.managed import IsLastStep
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from toolkits.package_toolkit import get_package_toolkit
import asyncio

class AgentState(MessagesState): 
    is_last_step: IsLastStep
    tool: tuple
