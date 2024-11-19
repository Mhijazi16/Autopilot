from utils.monitor import get_specs
from memory.database import init, ToolbarSchema
from fastapi import FastAPI, HTTPException, WebSocket
import asyncio
import json


memory = init()
app = FastAPI() 

@app.post("/toolbar")
async def set_toolbar(toolbar: ToolbarSchema): 
    try: 
        status = toolbar.model_dump()
        memory.hset("toolbar", mapping=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving feedback: {e}")

    return memory.hgetall("toolbar")

@app.post("/feedback")
async def set_feedback(feedback: str): 
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
            await asyncio.sleep(1)
    except Exception as e:
        print(f"Error: {e}")
