from workflow import compile_workflow

workflow = compile_workflow()
print("[🤖] : please enter a prompt.")

while True: 
    prompt = input("[🧒🏻] : ")
    messages = workflow.invoke({"messages" : prompt})['messages']
    print(f"[🤖] : {messages[-1].content}")
