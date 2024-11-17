from langchain_core.prompts import ChatPromptTemplate

def get_planner_prompt(options: str): 
    prompt = f"""
        your a helpful agent that helps me pick the order
        of the tools needed to be executed in order to achive
        the users objective. 
        this is the list of tools available: 
        {options}
        """ 

    planner_prompt = ChatPromptTemplate.from_messages([
        ("system", prompt),
        ("placeholder", "{messages}"), 
    ])

    return planner_prompt
