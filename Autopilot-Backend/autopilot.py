from typing import Literal
from fastapi.responses import JSONResponse
from agents.agent_factory import agent_factory
from agents.task_master import TaskMaster
from utils.monitor import get_specs
from memory.database import init, ToolbarSchema
from fastapi import Body, FastAPI, HTTPException, WebSocket, WebSocketDisconnect, responses 
from fastapi.middleware.cors import CORSMiddleware
from agents.react import ReactAgent, active_sockets
from toolkits.toolkit_factory import description_factory
import asyncio
import json

memory = init()
app = FastAPI() 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

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

@app.post("/manual")
async def set_toolbar(tasks = Body(...)): 
    try: 
        print("[INFO] Starting Manual Routing.")
        for unit in tasks: 
            agent = unit['agent']
            task = unit['task']
            print(f"[INFO] current agent: {agent}")
            runner = agent_factory(agent,{"configurable": {"thread_id": 1}})
            response = await runner.Run(task) 
            print(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving feedback: {e}")

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

