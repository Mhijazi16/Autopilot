from workflow import Autopilot
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from SimpleAgent.simpleWorkflow import SimpleWorkflow

graph = Autopilot(SimpleWorkflow()).build_workflow(False)

app = FastAPI()

def get_token(chunk):
    return chunk['data']['chunk'].content

async def run_task(prompt: str):
    task = {'messages': prompt}
    async for chunk in graph.astream_events(task, version="v2"):
        if chunk["event"] == "on_chat_model_stream":
            token = get_token(chunk) 
            yield token 
            print(token,flush=True,end="")

@app.get("/command")
async def command(prompt: str):
    return StreamingResponse(run_task(prompt))

