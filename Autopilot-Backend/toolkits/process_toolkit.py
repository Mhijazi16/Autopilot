from .shell_toolkit import handle_sudo, send_to_terminal, start_terminal
import pexpect
import os

def status_system_service(name: str):
    """
    Get the status of a service on the Linux machine using:
    `sudo systemctl status <service_name>`

    Args:
        name (str): Name of the service (e.g., 'sshd' for SSH service).

    Returns:
        str: Success or failure message.
    """
    output = ""
    try:
        command = f"systemctl status {name} | head"
        start_terminal(command)
        output = os.popen(command).read()
    except Exception:
        output = f"🚨 Failed to Retrieve Status of {name} Service.\n"
    finally:
        send_to_terminal(output)
        return output

def start_system_service(name: str): 
    """
        this tool is used to start an 
        a service on the linux machine 
        the command used is : 
        `sudo systemctl start <service_name>`
        takes in the name of the server
        Args: 
            name: str 
        for example if you want to start 
        ssh service you should 
        provide the name sshd
    """

    try:
        command = f"sudo systemctl start {name}"
        output = ""
        start_terminal(command)
        process = pexpect.spawn(command)
        process = handle_sudo(process)
        output = f"✅ {name} Service Successfull Started .\n"
        status_system_service(name)
    except: 
        output = f"🚨 faild Starting {name} service.\n"
    finally: 
        send_to_terminal(output)
        return output
