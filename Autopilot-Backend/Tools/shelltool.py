import os
import pexpect

log_process = False
def execute(command): 
    """ 
    execute is a tool that takes in a 
    command and executes it on the linux 
    shell then returns the result 
    Args: 
        command
    Returns 
        the output of the command
    """
    try: 
        if log_process:
            print("================================ Tool Node =================================")
            print(f"[⚒️] Executing {command}")
        output = os.popen(command).read()
        if log_process:
            print(f"[⚒️] Command Executed")
            print(f"[⚒️] Result: {output}")
        return output 
    except Exception as ex: 
        print(f"[⚒️] An Error Occured {ex}")
        return f"Error occured {ex}"

def handle_sudo(process: pexpect.spawn, password: str):
    process.expect("passowrd")
    process.sendline(password)
    return process

