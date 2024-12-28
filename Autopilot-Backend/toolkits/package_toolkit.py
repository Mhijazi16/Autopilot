from shell_toolkit import read_status, start_terminal, handle_sudo
import pexpect
# from os import environ

# def handle_sudo(process: spawn): 
#     password = environ.get("PASS")
#     process.expect('password')
#     process.sendline(str(password))
#     return process

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
    start_terminal(command)
    process = pexpect.spawn(command)
    process, message = handle_sudo(process)
    return read_status(process)

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
    start_terminal(command)
    process = pexpect.spawn(command)
    process, message = handle_sudo(process)
    return read_status(process)

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
    start_terminal(command)
    process = pexpect.spawn(command)
    return read_status(process)

def list_system_wide_dependencies():
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
    start_terminal(command)
    process = pexpect.spawn(command)
    return read_status(process)

def show_package_information(name: str): 
    """
        this tool shows package information 
        like name, size, owner, and the depandencies
        of that package, and the packages and conflict 
        with this packages
        Args: 
            name: str
    """
    command = f"pacman -Qi {name}"
    start_terminal(command)
    process = pexpect.spawn(command)
    return read_status(process)

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
    start_terminal(command)
    process = pexpect.spawn(command)
    process, message = handle_sudo(process)
    return read_status(process)

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
    start_terminal(command)
    process = pexpect.spawn(command)
    process, message = handle_sudo(process)
    return read_status(process)

def clean_package_cache():
    """
    this tool cleans the cache of packages on the system 
    by running 'sudo pacman --noconfirm -Sc' on the shell
    Args: 
        takes nothing
    Returns: 
        reutrns the result
    """
    command = f"sudo pacman --noconfirm -Sc"
    start_terminal(command)
    process = pexpect.spawn(command)
    process, message = handle_sudo(process)
    return read_status(process)

def search_packages(name: str): 
    """
    this tool searches for a package on the system 
    by running 'sudo pacman --noconfirm -Sc' on the shell
    Args: 
        name : string
    Returns: 
        returns the list of similar packages
    """
    command = f"pacman -Ss {name}"
    start_terminal(command)
    process = pexpect.spawn(command)
    return read_status(process)

def get_package_toolkit():
    return [search_packages,
            clean_package_cache,
            install_packages,
            update_packages,
            list_system_wide_dependencies,
            list_installed_packages,
            remove_packages,
            remove_full_packages,
            show_package_information]
