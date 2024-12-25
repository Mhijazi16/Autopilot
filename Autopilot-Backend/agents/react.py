from memory.database import get_memory
from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq
from langgraph.graph import MessagesState
from langgraph.managed import IsLastStep
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import asyncio

active_sockets = {}
async def notify_client(name: str, data): 
    try:
        socket = active_sockets[name]
        await socket.send_json(str(data))
    except Exception as e:
        print(f"[Error] : notify client failed {e}")
class AgentState(MessagesState): 
    is_last_step: IsLastStep
    tool: tuple

class ReactAgent():
    def __init__(self, model, tools, config):
        self.memory = get_memory()
        self.tools = tools
        self.checkpointer = MemorySaver()
        self.config = config

        if model == "groq": 
            self.llm = ChatGroq(model="llama3-groq-70b-8192-tool-use-preview",
                                temperature=0).bind_tools(tools)
        else: 
            self.llm = ChatOllama(model=model,
                                  temperature=0).bind_tools(tools)

        self.agent = create_react_agent(model=self.llm,
                              tools=tools,
                              interrupt_before=['tools'],
                              checkpointer=self.checkpointer,
                              state_schema=AgentState)

    def parse_for_tool(self, event):
        try:
            call = event['data']['output'].tool_calls[-1]
            tool = (call['name'], call['args'])
            print(f"[INFO] 🔨 Tool Was Called : {tool}")
            return tool
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
        print("[INFO] 🤖 Agent Was Invoked")
        tool = ()
        stream = self.get_stream(state)
        async for event in stream: 
            if event["event"] == "on_chat_model_end":
                tool = self.parse_for_tool(event)
        return tool

    async def Halt(self): 
        print("[INFO] 🤖 Agent Waiting For Feedback")
        i = 0
        while True: 
            await asyncio.sleep(1)
            status = self.memory.get("status")
            if status == "accepted": 
                break; 
            elif status == "rejected": 
                return False
            if i == 60:
                return False
            i += 1
        return True 

    async def Resume(self):
        print("[INFO] 🤖 Agent Resuming Task")
        stream = self.get_stream(None)
        output = ""
        async for event in stream: 
            if event["event"] == "on_chat_model_end":
                message = self.parse_for_message(event)
                output += message.content
        return output

    async def Run(self, prompt: str) -> str: 
        self.memory.set("status", "not-set")
        tool = await self.Invoke({'messages': [prompt]})
        feedback = self.memory.get("feedback")
        resume = True
        if feedback == "On" and tool: 
            await notify_client('tools', tool)
            resume = await self.Halt()
            self.memory.set("status", "not-set")
        if resume: 
            text = await self.Resume()
            return text
        return "nothing was executed"
