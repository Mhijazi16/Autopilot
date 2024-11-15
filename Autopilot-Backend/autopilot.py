from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from langchain_ollama.chat_models import ChatOllama
from langgraph.prebuilt.chat_agent_executor import SystemMessage
from Tools.navigation_tools import get_navigation_toolkit
from langgraph.prebuilt import ToolNode, create_react_agent

tools = get_navigation_toolkit()
llm = ChatOllama(model="llama3.1",temperature=1).bind_tools(tools)
agent = create_react_agent(llm, ToolNode(tools))

sys_msg = SystemMessage("""
        your a helpful AI assistant your job is to 
        answer to users questions if he wants to execute 
        a tool then do it and then describe what the 
        user saw after executing the tool
    """)

app = FastAPI()

async def run_task(prompt):
    messages = [
        sys_msg, 
        HumanMessage(prompt)
    ]

    async for chunk in agent.astream({'messages': messages}): 
        print(chunk,flush=True, end="")
        yield "response"

@app.get("/prompt")
async def prompt(prompt: str):
    return StreamingResponse(run_task(prompt))


