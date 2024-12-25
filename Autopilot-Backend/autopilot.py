from typing import Literal
from fastapi.responses import JSONResponse
from utils.monitor import get_specs
from memory.database import init, ToolbarSchema
from fastapi import Body, FastAPI, HTTPException, WebSocket, WebSocketDisconnect 
from fastapi.middleware.cors import CORSMiddleware
from agents.react import ReactAgent, active_sockets
from toolkits.toolkit_factory import toolkit_factory
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

@app.websocket("/monitor")
async def monitor_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            specs = get_specs()
            await websocket.send_text(json.dumps(specs)) 
            await asyncio.sleep(0.3)
    except Exception as e:
        print(f"Error: {e}")

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
        toolkit = toolkit_factory(toolbar)
        # agent = ReactAgent("groq",
        #                    toolkit,
        #                    {"configurable": {"thread_id": "1"}})

        agent = ReactAgent("llama3.2",
                           toolkit,
                           {"configurable": {"thread_id": "1"}})

        res = await agent.Run(prompt)
        return {"message": res}
    except Exception as e:
        print(f"errror : {e}")

@app.websocket("/tools")
async def feedback_socket(websocket: WebSocket):
    await websocket.accept()
    active_sockets['tools'] = websocket
    try:
        while True:
            await asyncio.sleep(1)
            await websocket.send_text(".")
    except WebSocketDisconnect:
        print("WebSocket disconnected.")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        active_sockets.pop('tools', None)

