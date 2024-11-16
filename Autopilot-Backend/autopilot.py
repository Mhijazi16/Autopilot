import asyncio
import json
from utils.monitor import get_specs
from fastapi import FastAPI, WebSocket


app = FastAPI() 


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
