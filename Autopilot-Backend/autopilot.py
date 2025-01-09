from typing import Literal
from GPUtil.GPUtil import random
from fastapi.responses import JSONResponse
from agents.agent_factory import agent_factory
from agents.task_master import TaskMaster
from states.planner import Plan
from utils.monitor import get_specs
from memory.database import init, ToolbarSchema, Task
from fastapi import Body, FastAPI, HTTPException, WebSocket, WebSocketDisconnect 
from fastapi.middleware.cors import CORSMiddleware
from agents.react import active_sockets
from toolkits.toolkit_factory import description_factory
from pydantic import BaseModel
import asyncio
import json

stored_tasks = 0
memory = init()
app = FastAPI() 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def init_task_id():
    global stored_tasks
    largest_id = -1
    cursor = '0'

    while cursor != 0:
        cursor, keys = memory.scan(cursor=cursor, match='task:*', count=100)
        for key in keys:
            try:
                task_id = int(key.split(':')[1])
                largest_id = max(largest_id, task_id)
            except (IndexError, ValueError):
                continue

    stored_tasks = largest_id

init_task_id()

def get_task_id(): 
    global stored_tasks
    stored_tasks += 1
    return stored_tasks

@app.get("/toolbar")
def get_toolbar():
    try:
        return memory.hgetall("toolbar")
    except Exception as e:
        raise e

@app.get("/feedback")
def get_feedback():
    try:
        return {"feedback": memory.get("feedback")}
    except Exception as e:
        raise e

@app.post("/toolbar")
async def set_toolbar(toolbar: ToolbarSchema = Body(...)): 
    try: 
        status = toolbar.model_dump()
        memory.hset("toolbar", mapping=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving feedback: {e}")

    return memory.hgetall("toolbar")

@app.post("/feedback")
async def set_feedback(feedback: Literal["On", "Off"] = Body(...)): 
    try:
        memory.set("feedback", feedback)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving feedback: {e}")

    return {"feedback": memory.get("feedback")}

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate-task")
async def generate_task(request: PromptRequest): 
    global stored_tasks
    try: 
        prompt = request.prompt
        print("[INFO] Generate Task Started.")
        active = ToolbarSchema(
            Navigation="On",
            Coder="On",
            Shell="On",
            Github="On",
            Users="On",
            Monitor="On",
            Packages="On",
            Network="On",
            Troubleshooter="On"

        )

        toolkit = description_factory(active.dict())
        autopilot = TaskMaster(toolkit)
        planner = autopilot.compile_planner_graph()
        plan: Plan = (await planner.ainvoke({'messages': prompt}))['plan']

        id = get_task_id()
        task = {
            "id": id,
            "name": f"Generated Task {id}",
            "commands": [step.dict() if hasattr(step, 'dict') else step.__dict__ for step in plan.steps]
        }

        memory.set(f"task:{id}", json.dumps(task))
        return task
    except Exception as e:
        print(f"[ERROR] Failedd Genreating Task. {e}")

    return memory.hgetall("toolbar")

@app.websocket("/monitor")
async def monitor_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            specs = get_specs()
            await websocket.send_text(json.dumps(specs)) 
            await asyncio.sleep(0.3)
    except Exception as e:
        print(f"[Error]: Monitoring Socket Exited {e}")

@app.post("/accept")
async def accept(): 
    try:
        memory.set("status", "accepted")
        return JSONResponse(content={"message": "Status set to accepted"}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": "Error occurred"}, status_code=500)

@app.post("/reject")
async def reject(): 
    try:
        memory.set("status", "rejected")
        return JSONResponse(content={"message": "Status set to rejected"}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": "Error occurred"}, status_code=500)

@app.post("/chat")
async def chat(prompt: str): 
    try:
        toolbar = memory.hgetall("toolbar")
        toolkit = description_factory(toolbar)
        autopilot = TaskMaster(toolkit).compile_graph()

        # agent = ReactAgent("groq",
        #                    toolkit,
        #                    {"configurable": {"thread_id": "1"}})
        # agent = ReactAgent("llama3.2",
        #                    toolkit,
        #                    {"configurable": {"thread_id": "1"}})
        # res = await agent.Run(prompt)

        output = await autopilot.ainvoke({'messages': prompt})
        message = output['messages'][-1].content
        return {"message": message}
    except Exception as e:
        print(f"Error in chat endpoint: {e}")

@app.post("/tasks")
async def create_task(task: Task): 
    key = f"task:{task.id}"
    existing_task = memory.get(key)

    if existing_task:
        memory.set(key, json.dumps(task.dict()))
        return {"message": "Task updated successfully"}
    else:
        task.id = get_task_id()
        memory.set(f"task:{task.id}", json.dumps(task.dict()))
        return {"message": "Task created successfully"}

@app.post("/tasks/{id}/start")
async def start_task(id: int): 
    try:
        data = memory.get(f"task:{id}")
        jobs = json.loads(data)
        socket = active_sockets['notification']
        memory.set("halt", "no")

        for job in jobs['commands']:
            halt = memory.get("halt")
            if halt == "yes":
                print("[INFO] Job was interrupted")
                memory.set("halt", "no")
                break
            
            await socket.send_json({"status": "running"})

            agent = job['agent']
            task = job['task']
            print(f"[INFO] current agent: {agent}")
            runner = agent_factory(agent, {"configurable": {"thread_id": 1}})
            response = await runner.Run(task)

            await socket.send_json({"status": "finished"})
    except Exception as e:
        print(f"[ERROR] Issue in Starting Task {e}")

@app.post("/tasks/stop")
async def stop_task(): 
    try:
        memory.set("halt", "yes")
    except Exception as e:
        print(f"[ERROR] Issue while stopping tasks {e}")

@app.get("/tasks")
async def get_all_tasks():
    tasks = []
    for key in memory.scan_iter(match="task:*"):
        task = memory.get(key)
        tasks.append(json.loads(task))
    return tasks

@app.get("/tasks/{id}")
async def get_task(id: int):
    task = memory.get(f"task:{id}")
    return json.loads(task)

@app.delete("/tasks/{id}")
async def delete_task(id: int):
    try:
        removed = memory.delete(f"task:{id}")
        if removed:  
            tasks = []
            for key in memory.scan_iter(match="task:*"):
                task = memory.get(key)
                tasks.append(json.loads(task))
            return tasks
    except Exception as e:
        print("[ERROR] failed deleting task")

@app.websocket("/notification")
async def notification_socket(websocket: WebSocket): 
    try:
        await websocket.accept()
        print("[INFO] Notification websocket Recieved Connection")
        active_sockets['notification'] = websocket
        while True: 
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("[WARNING] Notification WebSocket disconnected.")
    except Exception as e:
        print(f"[ERROR] Notification WebSocket Failed : {e}")

@app.websocket("/tools")
async def feedback_socket(websocket: WebSocket):
    await websocket.accept()
    active_sockets['tools'] = websocket
    try:
        while True:
            await asyncio.sleep(1)
            # await websocket.send_text(".")
    except WebSocketDisconnect:
        print("[ERROR] WebSocket disconnected.")
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
    finally:
        active_sockets.pop('tools', None)

