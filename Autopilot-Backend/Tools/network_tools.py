from pexpect import pxssh

PROMPT = []

def read_status(process):
    return process.before.decode()

def ssh(username: str, hostname: str, password, commands: list[str]):
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

