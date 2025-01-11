from .shell_toolkit import handle_sudo, read_status, send_to_terminal, start_terminal
import pexpect
import os

def command_factory(name, action): 
    command = ""
    status = f"sudo systemctl status {name} | head -30"
    try:
        if "start" in action:
            command = f"sudo systemctl start {name}"
        elif "stop" in action:
            command = f"sudo systemctl stop {name}"
        elif "restart" in action:
            command = f"sudo systemctl restart {name}"
        elif "reload" in action:
            command = f"sudo systemctl reload {name}"
        elif "status" in action:
            command = status
        elif "enable" in action:
            command = f"sudo systemctl enable {name}"
        elif "disable" in action:
            command = f"sudo systemctl disable {name}"
        else:
            raise ValueError(f"Unsupported action: {action}")
    except Exception as e:
        print(f"[ERROR] no suitable action! {e}")
    finally:
        return command

