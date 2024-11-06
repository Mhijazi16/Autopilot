from workflow import Autopilot
from SimpleAgent.simpleWorkflow import SimpleWorkflow

# print("[🤖] : please enter a prompt.")
flow = Autopilot(SimpleWorkflow()).build_workflow()
# while True: 
#     prompt = input("[🧒🏻] : ")
#     messages = flow.invoke({"messages" : prompt})['messages']
#     print(f"[🤖] : {messages[-1].content}")

# from ComplexAgent.complexWorkflow import init
# init()

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/autopilot/command")
async def command(prompt: str):
    return StreamingResponse(flow.invoke({"messages": prompt}))

