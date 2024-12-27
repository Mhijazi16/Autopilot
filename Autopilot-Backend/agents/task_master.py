from langchain_core.messages import SystemMessage
from langchain_core.messages.ai import AIMessage
from langchain_core.messages.human import HumanMessage
from langchain_groq.chat_models import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langgraph.graph import START, MessagesState, StateGraph, END
from .agent_factory import agent_factory
from states.planner import Plan

class TaskState(MessagesState):
    plan: Plan

class TaskMaster():
    __slots__ = ("llm", "template", "config", "summarizer")

    def __init__(self, toolkit): 
        self.config = {"configurable": {"thread_id": "1"}}
        self.llm = ChatGroq(
            # model="llama3-groq-70b-8192-tool-use-preview",
            model="llama-3.3-70b-versatile",
            temperature=0, 
            stop_sequences="1", 
        ).with_structured_output(Plan)

        self.summarizer = ChatOllama(
            model="llama3.2",
            temperature=0
        )

        sys_msg = f"""your my helpful assistant your name is TaskMaster you take in 
                     the prompt of the user and analyze it to create a Plan that should 
                     be executed to meet the users request the plan should only consist 
                     of steps each step consist of name of agent and the task should be 
                     executed by that agent. the following is the available agents and thier 
                     tools: 
                     {toolkit}

                     Important Note: the task should be a prompt to the next agent about 
                     what to do or what should that agent execute Example: 
                     if the user wants to open http server inside the Videos folder 
                     you should create a Step with 
                     """

        self.template = ChatPromptTemplate(
            [
                ('system',sys_msg), 
                ('human','{input}'), 
            ]
        )


    def Plan(self, state: TaskState) -> TaskState: 
        try:
            prompt = state['messages'][-1]
            chain = self.template | self.llm 
            plan = chain.invoke({'input': str(prompt)})
            state['plan'] = plan
            return state
        except Exception as e:
            raise e

    async def Execute(self, state: TaskState): 
        try:
            plan = state['plan'].steps
            output = ""
            for step in plan: 
                print(f"[STEP] current step: {step}")
                output += f"Result from Agent {step.agent}"
                agent = agent_factory(step.agent, self.config)
                output += await agent.Run(step.task)
            state['messages'] += [AIMessage(output)]
            return state
        except Exception as e:
            print(f"[Error] issue in execute {e}")

    def Summarize(self, state: TaskState):
        sum_prompt = """
        I need you you sum all the previous results use 
        beautiful markdown when writing the output """
        messages = state['messages'] + [HumanMessage(sum_prompt)]

        summary = self.summarizer.invoke(messages)
        return {'messages': state['messages'] + [summary]} 

    def compile_graph(self):
        graph = StateGraph(TaskState)
        graph.add_node("planner", self.Plan)
        graph.add_node("execute", self.Execute)
        graph.add_node("summarizer", self.Summarize)

        graph.add_edge(START,"planner")
        graph.add_edge("planner", "execute")
        graph.add_edge("execute", "summarizer")
        graph.add_edge("summarizer", END)

        return graph.compile()

# def print_messages(data): 
#     data['messages'][-1].pretty_print()
# toolkit = description_factory({"Network": "On", "Navigation": "On"})
# master = TaskMaster(toolkit).compile_graph()
# for part in master.stream({'messages': 'I need you to search for batman images then list all the network interfaces and finally tell me the weather in hebron'}, stream_mode="values"): 
#     print_messages(part)

