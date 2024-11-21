from langchain_core.messages import SystemMessage
from langchain_core.prompts.chat import HumanMessagePromptTemplate
from langchain_groq.chat_models import ChatGroq
from langchain.prompts import ChatPromptTemplate
from states.planner import Plan

class TaskMaster():
    __slots__ = ("llm", "template")
