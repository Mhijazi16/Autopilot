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

    return os.popen(f"echo -n \'{input}\' | {algorithm}").read()

tools = [hash_to]
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

chain = prompt | chat_bot | parser 
call = chain.invoke({"input":"convert hello to sha hash that has 224 bytes"}) 

if not call : 
    print("not working")
else: 
    print(hash_to(call['args']))
