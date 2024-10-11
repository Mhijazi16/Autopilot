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

def update_packages(): 
    """
        update_packages this tool run the command 
        'sudo pacman -Syu' on the shell to update the
        system and its packages then returns the output 
        of update  
        Args: 
            takes no arguments
        Returns: 
            returns what happened after execution
    """
    command = "sudo pacman --noconfirm -Syu"
    process = spawn(command)
    process = handle_sudo(process)
    return process.read().decode()

def list_installed_packages():
    """
        list_installed_packages this tool run the command 
        'pacman -Qe' on the shell to list the installed
        packages
    Args: 
        takes no arguments
    
    Returns: 
        returns list of installed packages.
    """
    command = "pacman -Qe"
    process = spawn(command)
    return process.read().decode()

def list_dependencies():
    """
        this tool is used  to list all the package 
        depandencies on the system by running 
        'pacman -Qd' on the shell
    Args: 
        takes no arguments
    Returns: 
        returns list of package depandencies.
    """
    command = "pacman -Qd"
    process = spawn(command)
    return process.read().decode()

def remove_packages(names: list[str]):
    """
    Remove a list of specified package by running
    'sudo pacman -R <names>' on the shell
    Args: 
        names: list of strings 
    Returns: 
        returns the output of the removal process.
    """
    command = f"sudo pacman --noconfirm -R {" ".join(names)}"
    process = spawn(command)
    process = handle_sudo(process)
    return process.read().decode()

def remove_full_packages(names: list[str]):
    """
    Remove a list of package and their Dpenedencies
    by running 'sudo pacman -Rns <names>' on the shell
    Args: 
        names: list of strings 
    Returns: 
        returns the output of the removal process.
    """
    command = f"sudo pacman --noconfirm -Rns {" ".join(names)}"
    process = spawn(command)
    process = handle_sudo(process)
    return process.read().decode()
