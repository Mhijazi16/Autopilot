from os import environ
from pexpect import spawn

def handle_sudo(process: spawn): 
    password = environ.get("PASS")
    process.expect('password')
    process.sendline(str(password))
    return process

def install_packages(names: list[str]): 
    """
        install_package this tool run the command 
        'sudo pacman -S name1 name2 ...nameN' on the shell 
        to install the given software package on the system 
        it takes in the names of packages you want to install 
        then returns the output of installation
        Args: 
            names : list of strings
        Returns: 
            returns what happened after execution
    """
    command = f"sudo pacman --noconfirm -S {" ".join(names)}"
    process = spawn(command)
    process = handle_sudo(process)
    return process.read().decode()

print(install_packages(["neofetch","fastfetch"]))
