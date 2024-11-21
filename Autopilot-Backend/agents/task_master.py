from langchain_core.messages import SystemMessage
from langchain_core.prompts.chat import HumanMessagePromptTemplate
from langchain_groq.chat_models import ChatGroq
from langchain.prompts import ChatPromptTemplate
from states.planner import Plan

class TaskMaster():
    __slots__ = ("llm", "template")

    def __init__(self, toolkit): 
        self.llm = ChatGroq(
            model="llama3-groq-70b-8192-tool-use-preview",
            temperature=0, 
            stop_sequences="1", 
        ).with_structured_output(Plan)

        sys_msg = f"""your my helpful assistant your name is TaskMaster you take in 
                     the prompt of the user and analyze it to create a Plan that should 
                     be executed to meet the users request the plan should only consist 
                     of steps that use one or more of the following tools: 
                     {toolkit}
                     """

        self.template = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content=sys_msg), 
                HumanMessagePromptTemplate.from_template("{input}")
            ]
        )
