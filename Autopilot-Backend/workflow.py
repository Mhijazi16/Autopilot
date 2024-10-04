from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode, tools_condition 
from langchain_ollama import ChatOllama
from shelltool import execute, log_process

tools = [execute]
llm = ChatOllama(model="llama3.2",temperature=0).bind_tools(tools)

class AgentState(MessagesState): 
    command: tuple[str,str]

def planner(state: AgentState): 
    if log_process :
        print("================================ Planner Node =================================")
        print(f"[🧠] Recieved prompt: {state['messages'][-1].content}")
        print(f"[🧠] Planning")
    return {"messages": [llm.invoke(state["messages"])]}

def compile_workflow():

    builder = StateGraph(AgentState)
    builder.add_node("planner",planner)
    builder.add_node("tools",ToolNode(tools))

    builder.add_edge(START,"planner")
    builder.add_conditional_edges("planner",tools_condition)
    builder.add_edge("tools","planner")
    builder.add_edge("planner",END)

    graph = builder.compile()
    return graph

