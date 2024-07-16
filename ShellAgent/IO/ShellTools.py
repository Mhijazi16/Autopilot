from langchain.tools import tool

class ShellTools: 

    @tool("Execute Linux Command")
    def execute_linux_command(self, command:str): 
        """ This tool is used to execute simple linux commands on
            the shell to use this tool you should pass the command
            you want to execute as a string inside the arguments 
            you should pass only the command nothing more nothing less
            """
