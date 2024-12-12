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

class ReactAgent():
    def __init__(self, model, tools, config):
        self.memory = get_memory()
        self.tools = tools
        self.checkpointer = MemorySaver()
        self.config = config

        self.llm = ChatOllama(model=model,
                              temperature=0).bind_tools(tools)

        self.agent = create_react_agent(model=self.llm,
                              tools=tools,
                              interrupt_before=['tools'],
                              checkpointer=self.checkpointer,
                              state_schema=AgentState)

    def parse_for_tool(self, event):
        try:
            function = event['data']['output'].response_metadata['message']['tool_calls'][-1]
            return function['function']['name'], function['function']['arguments']
        except:
            return None

    def parse_for_message(self, event): 
        try:
            return event['data']['output']
        except Exception as e:
            raise e

    def get_stream(self, state): 
        return self.agent.astream_events(state, config=self.config, stream_mode="values", version='v2')

    async def Invoke(self, state):
        tool = ()
        stream = self.get_stream(state)
        async for event in stream: 
            if event["event"] == "on_chat_model_end":
                tool = self.parse_for_tool(event)
        return tool
