from workflow import Autopilot
from SimpleAgent.simpleWorkflow import SimpleWorkflow

print("[🤖] : please enter a prompt.")
flow = Autopilot(SimpleWorkflow()).build_workflow()
while True: 
    prompt = input("[🧒🏻] : ")
    messages = flow.invoke({"messages" : prompt})['messages']
    print(f"[🤖] : {messages[-1].content}")
