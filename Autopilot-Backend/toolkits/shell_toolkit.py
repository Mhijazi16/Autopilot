from pexpect.exceptions import EOF
from time import sleep 
import os
import socket
import pexpect

def start_terminal(command):
    if not os.path.exists("/tmp/terminal_socket"): 
        os.system("python /home/ha1st/github/Autopilot/Autopilot-Backend/utils/terminal.py &")
        sleep(2)
    send_to_terminal(f"$ {command}")

def send_to_terminal(data):
    try:
        terminal_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        terminal_socket.connect("/tmp/terminal_socket")
        terminal_socket.sendall(data.encode("utf-8"))
        terminal_socket.close()
    except Exception as e:
        print(f"Error sending data to socket: {e}")

def read_status(process):
    try:
        process.expect(EOF)
        data = process.before.decode()
        send_to_terminal(data)
        return data
    except Exception as e: 
        print(f"[ERROR] no data was sent to terminal: {e}")

def handle_sudo(process: pexpect.spawn, password: str = ""):
    if password == "":
        password = str(os.getenv("PASS"))

    process.expect_exact("[sudo] password for ha1st: ")
    process.sendline(password)
    result = process.expect(["Sorry, try again.", pexpect.EOF,".*"])
    read_status(process)

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
    start_terminal(command)
    child = pexpect.spawn(command)
    if "sudo" in command: 
        child, message = handle_sudo(child)
        if "denied" in message: 
            return f"process failed : {message}"
    data = read_status(child)
    output = f"the output of the command is {data}"
    return output

def get_shell_toolkit():
    return [execute]
