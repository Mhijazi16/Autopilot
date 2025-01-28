from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langchain_ollama import ChatOllama
from langgraph.graph import START, MessagesState, StateGraph, END
from .agent_factory import agent_factory
from states.planner import Plan

class TaskState(MessagesState):
    plan: Plan
    output : list[str] 

class TaskMaster():
    __slots__ = ("llm", "template", "config", "summarizer", "toolkit", "outputs")

    def __init__(self, toolkit): 
        self.outputs:  str = ""
        self.toolkit = toolkit
        self.config = {"configurable": {"thread_id": "1"}}
        self.toolkit = toolkit
        self.summarizer = ChatOllama(
            model="deepseek-r1:7b",
            temperature=0
        )

        self.template = f"""For the given objective, come up with a simple step by step plan. \
                This plan should involve individual tasks and the agent that should execute that 
                task. Do not add any superfluous steps. \

                The task should be a long clear prompt about what 
                the agent should do 

                The Agents you can do that Job: 
                {toolkit}

                Please Only use the names of Agents provided don't 
                use anything extra
            """

        self.llm = ChatOllama(
            # model="llama3.1:8b-instruct-q4_K_S",
            model="llama3.1:8b-instruct-q5_0",
            temperature=0,
        ).with_structured_output(Plan)

        # self.llm = ChatGroq(
        #     model="llama3-groq-70b-8192-tool-use-preview",
        #     # model="llama-3.3-70b-versatile",
        #     temperature=0, 
        #     stop_sequences="1", 
        # ).with_structured_output(Plan)

    def Plan(self, state: TaskState) -> TaskState: 
        try:
            prompt = state['messages'][-1]
            self.template += f"the objective is : {prompt.content}"
            plan = self.llm.invoke(self.template)
            state['plan'] = plan
            print(f"[PLAN]: {plan}")
            return state
        except Exception as e:
            print(f"[ERROR] something went wrong when planning {e}")

    async def Execute(self, state: TaskState): 
        try:
            plan = state['plan'].steps
            for i,step in enumerate(plan): 
                print(f"[STEP] current step: {step}")
                output = f"""## {i+1}) {step.agent} Agent\n 
                The Task assigned to Agent is:\n {step.task}\n
                The Result from This Agent:\n
                {self.outputs}
                """

                agent = agent_factory(step.agent, self.config)
                output += str(await agent.Run(step.task))
                self.outputs += output + "\n"
        except Exception as e:
            print(f"[Error] issue in execute {e}")
        finally: 
            return {'messages': state['messages']}

    def Summarize(self, state: TaskState):
        try:
            sum_prompt = f"""
                I have multiple Agents that run commands 
                on my linux system your responsible for 
                taking the results of those agents and 
                after that summarize what they did on the 
                system please use markdown when you summarize

                Here is the Agents results:
                {self.outputs}
             """

            summary = self.summarizer.invoke(sum_prompt)
            return {'messages': state['messages'] + [summary]} 
        except Exception as e:
            print(f"[ERROR] issue in summarizer {e}")


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

    def compile_planner_graph(self): 
        graph = StateGraph(TaskState)
        graph.add_node("planner", self.Plan)
        graph.add_edge(START,"planner")
        graph.add_edge("planner", END)

        return graph.compile()
