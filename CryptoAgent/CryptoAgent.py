from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool
from langchain_core.output_parsers import JsonOutputToolsParser
import os

@tool("hash_to")
def hash_to(input: str, algorithm:str): 
    """this tool takes two things 
        input which is string of what you want to hash and 
        algorithm which is string the type of hash 
        you can choose from these two types of hashes

        1) sha1sum 
        2) md5sum 
        3) sha224sum
        4) sha256sum
        5) sha384sum
        6) sha512sum

        the tool returns the result of hash"""

    print("The Agent is Converting the text to Hash.....")
    return os.popen(f"echo -n \'{input}\' | {algorithm}").read()

@tool("crack_hash")
def crack_hash(input: str, format: str): 
    """this tool takes two things
        input which is a string of the hash you want to crack 
        format which is a string of the format of the hash
        you can choose these types of formats: 

        1) raw-md5
        2) raw-sha1

        the tool returns a text of the cracked hash"""

    os.popen(f"echo -n {input} > hash.txt")
    return os.popen(f"~/builds/john/run/john --format={format} hash.txt").read()

def get_chain(): 
    tools = [hash_to, crack_hash]
    chat_bot = ChatOllama(model="llama3-groq-tool-use",
                          temperature=0,
                          keep_alive=-1).bind_tools(tools)
    parser = JsonOutputToolsParser(first_tool_only=True)
    prompt = ChatPromptTemplate.from_template(
        """
        you are a helpful cryptography and hashing AI agent 
        your job is to take user prompt and execute what the 
        user tells you using the tools I provided you with
        the user prompt is : {input}
        please don't forget to use the tools
        """
    )

    return prompt | chat_bot | parser 

def chat(prompt):
    chain = get_chain()
    call = chain.invoke({"input":prompt}) 
    print(crack_hash.invoke(call['args']))


chat("I want you to crack this hash : 0edc9b073397681dc9f2c479686ea0d9 that has md5 format")
