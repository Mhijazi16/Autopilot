from workflow import Workflow
from simpleWorkflow import SimpleWorkflow

class Autopilot: 
    def __init__(self, workflow: Workflow) -> None:
        self.workflow = workflow

    def build_workflow(self): 
        return self.workflow.compile_workflow()
                        

print("[🤖] : please enter a prompt.")
flow = Autopilot(SimpleWorkflow()).build_workflow()
while True: 
    prompt = input("[🧒🏻] : ")
    messages = flow.invoke({"messages" : prompt})['messages']
    print(f"[🤖] : {messages[-1].content}")
