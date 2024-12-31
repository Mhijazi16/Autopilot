from pexpect.exceptions import EOF
from .shell_toolkit import handle_sudo, read_status, send_to_terminal, start_terminal
import pexpect
from pexpect import pxssh
import os

def ssh_to_host(username: str, hostname: str, password, commands: list[str]):
    """
        ssh_to_host is a tool that connectes and executes 
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
    output = ""
    try:
        session = pxssh.pxssh()
        session.login(hostname,username,password)
        start_terminal(f"ssh root@{hostname}")

        for command in commands: 
            session.sendline(command)
            session.prompt()
            template = f"[{username}@{hostname}]$ {command}"
            send_to_terminal(template)
            tmp = str(session.before.decode()).split('\n')[1] 
            send_to_terminal(tmp)
            output += template + "\n" + tmp
        session.logout()
    except Exception as e:
        output += f"something went wrong {e}"
    finally: 
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

def start_http_server(directory: str):
    """
        This tools starts an http server inside 
        the directory you supply in parameters
        Args: 
            directory: str
        Returns: 
            the output of trying to run the server
    """

    try:
        start_terminal(f"python -m http.server 2525 {directory}")
        os.popen(f"cd {directory} && python -m http.server 2525 &")
        send_to_terminal(f"✅ http server started in {directory} go to http://localhost:2525")
    except Exception as e:
        send_to_terminal("🚨 Failed Starting the Http server")

def kill_http_server(): 
    """
        This Tool is used to kill the http srever 
        that you already started
    """
    try:
        for i in range(2): 
            getProcess = "ps -aux | grep 'python -m http.server' | head -1 | tr -s ' ' | cut -d ' ' -f 2"
            start_terminal(getProcess)
            pid = os.popen(getProcess).read()
            send_to_terminal(pid)
            killProcess = f"kill {pid}"
            start_terminal(killProcess)
            os.popen(killProcess).read()
            send_to_terminal("✅ Http Server was killed")
        return "✅ Http Server was killed"
    except Exception as e:
        return "🚨 Failed Killing the server"

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

    command = "ip a"
    start_terminal(command)
    output = os.popen(command).read()
    send_to_terminal(output)
    return output

def disable_interface(name: str):
    """
        This tool disables a network interface 
        Args: 
            name: str
    """
    command = f"sudo ip link set {name} down"
    child = pexpect.spawn(command) 
    handle_sudo(child)
    return read_status(child)

def enable_interface(name: str):
    """
        This tool enables a network interface 
        Args: 
            name: str
    """
    command = f"sudo ip link set {name} up"
    child = pexpect.spawn(command) 
    handle_sudo(child)
    return read_status(child)

def list_wifi_networks(): 
    """ 
        This tool is used to list all SSIDs
        near this device
    """
    
    command = "nmcli dev wifi list | cat | tr -s ' ' | cut -d ' ' -f 3"
    start_terminal(command)
    ssid = os.popen(command).read()
    send_to_terminal(ssid)
    return ssid

def get_network_toolkit():
    return [list_wifi_networks,
            list_interfaces,
            list_network_hosts,
            enable_interface,
            disable_interface,
            start_http_server,
            kill_http_server,
            start_system_service,
            status_system_service,
            ssh_to_host]
