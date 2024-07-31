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
