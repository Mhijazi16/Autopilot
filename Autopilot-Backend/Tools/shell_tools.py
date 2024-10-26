import os
import pexpect
from pexpect import pxssh, EOF

def read_status(process):
    return process.before.decode()

def handle_sudo(process: pexpect.spawn, password: str = ""):
    if password == "":
        password = str(os.getenv("PASS"))

    process.expect_exact("[sudo] password for ha1st: ")
    process.sendline(password)
    result = process.expect(["Sorry, try again.", pexpect.EOF,".*"])

    if  result == 0: 
        process.close()
        return process, "permission denied"
    else :
        return process, "access granted"

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
    if "sudo" in command: 
        child = pexpect.spawn(command)
        child, message = handle_sudo(child)
        if "denied" in message: 
            return f"process failed : {message}"
        return read_status(child) 

    return os.popen(command).read()
