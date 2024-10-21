import pexpect
from pexpect import pxssh
from shell_tools import handle_sudo, read_status
import os


def ssh(username: str, hostname: str, password, commands: list[str]):
    """
        ssh is a tool that connectes and executes 
        commands to remote host or server.
        it takes in a list of commands
        Args: 
            username: str 
            hostname: str
            password: str 
            commands: list of str
        Returns: 
            the output of executing commands on remote 
            server
    """
    session = pxssh.pxssh()
    try:
        session.login(hostname,username,password)
    except Exception as e:
        return f"something went wrong {e}"

    output = ""
    for command in commands: 
        session.sendline(command)
        session.prompt()
        output += f"[{username}@{hostname}]$ " + read_status(session)
    session.logout()
    return output

def start_http_server(directory: str):
    """
        This tools starts an http server inside 
        the directory you supply in parameters
        Args: 
            directory: str
        Returns: 
            the output of trying to run the server
    """

    return os.popen(f"cd {directory} && python -m http.server")

def kill_http_server(): 
    """
        This Tool is used to kill the http srever 
        that you already started
    """
    getProcess = "ps -aux | grep 'python -m http.server' | head -1 | tr -s ' ' | cut -d ' ' -f 2"
    pid = os.popen(getProcess).read()
    killProcess = f"kill {pid}"
    return os.popen(killProcess).read()

def list_network_hosts(password: str): 
    """ 
        this tool used to list the ips of 
        the devices on this network
        takes in the root password
        Args: 
            password: str
        returns: 
            list of ips and mac addreses
    """
    process = "sudo evillimiter --flush"
    child = pexpect.spawn(process)
    child.expect("password")
    child.sendline(password)
    child.expect(">>>")
    child.sendline("scan")
    child.expect(">>>")
    child.sendline("hosts")
    child.expect(">>>")
    child.sendline("exit")
    return read_status(child)

def list_interfaces(): 
    """
        This tool is used to list 
        the available network interfaces 
        on the device 
    """
    return os.popen("ip a").read()

def disable_interface(name: str):
    """
        This tool disables a network interface 
        Args: 
            name: str
    """
    command = f"sudo ip link set {name} down"
    child = pexpect.spawn(command) 
    handle_sudo(child,"GOTnoCap")
    return read_status(child)

def enable_interface(name: str):
    """
        This tool enables a network interface 
        Args: 
            name: str
    """
    command = f"sudo ip link set {name} up"
    child = pexpect.spawn(command) 
    handle_sudo(child,"GOTnoCap")
    return read_status(child)

print(disable_interface("wlp45s0"))
