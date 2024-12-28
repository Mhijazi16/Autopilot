import os
import socket
from time import sleep 
import pexpect

def start_terminal():
    os.system("python /home/ha1st/github/Autopilot/Autopilot-Backend/utils/terminal.py &")

def send_to_terminal(data):
    try:
        terminal_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        terminal_socket.connect("/tmp/terminal_socket")
        terminal_socket.sendall(data.encode("utf-8"))
    except Exception as e:
        print(f"Error sending data to socket: {e}")
    finally:
        terminal_socket.close()

def read_status(process):
    data = process.before.decode()
    try:
        send_to_terminal(data)
    except: 
        print("[ERROR] no data was sent to terminal")
    finally: 
        return data

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
    print(f"[INFO] current command about to execute {command}")
    start_terminal()
    sleep(2)
    send_to_terminal(f"$ {command}")
    child = pexpect.spawn(command)
    if "sudo" in command: 
        child, message = handle_sudo(child)
        if "denied" in message: 
            return f"process failed : {message}"
    child.expect(pexpect.EOF)
    output = f"the output of the command is {read_status(child)}"
    return output

def get_shell_toolkit():
    return [execute]
