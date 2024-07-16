from langchain.tools import tool

class ShellTools: 

    @tool("Execute Linux Command")
    def execute_linux_command(self, command:str): 
