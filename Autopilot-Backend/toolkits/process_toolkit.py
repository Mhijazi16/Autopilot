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
