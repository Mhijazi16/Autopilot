from pexpect import pxssh
import os

def read_status(process):
    return process.before.decode()

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

