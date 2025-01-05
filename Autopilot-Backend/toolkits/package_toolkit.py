from .shell_toolkit import read_status, start_terminal, handle_sudo
import pexpect

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
    try:
        command = f"sudo pacman --noconfirm -S {' '.join(names)}"
        start_terminal(command)
        process = pexpect.spawn(command)
        process, message = handle_sudo(process)
        read_status(process)
        return f"✅ Successfully installed packages with names : {names}."
    except Exception as e:
        return f"⚠️ Failed to install packages: {e}"

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
    try:
        command = "sudo pacman --noconfirm -Syu"
        start_terminal(command)
        process = pexpect.spawn(command)
        process, message = handle_sudo(process)
        read_status(process)
        return "✅ Successfully updated packages."
    except Exception as e:
        return f"⚠️ Failed to update packages: {e}"

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
    try:
        command = "pacman -Qe"
        start_terminal(command)
        process = pexpect.spawn(command)
        read_status(process)
        return "✅ Successfully listed installed packages."
    except Exception as e:
        return f"⚠️ Failed to list installed packages: {e}"

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
    try:
        command = "pacman -Qd"
        start_terminal(command)
        process = pexpect.spawn(command)
        info = read_status(process)
        return f"✅ Successfully retrieve dependencies Result:\n {info}."
    except Exception as e:
        return f"⚠️ Failed to list system-wide dependencies: {e}"

def show_package_information(name: str): 
    """
        this tool shows package information 
        like name, size, owner, and the depandencies
        of that package, and the packages and conflict 
        with this packages
        Args: 
            name: str
    """
    try:
        command = f"pacman -Qi {name}"
        start_terminal(command)
        process = pexpect.spawn(command)
        info = read_status(process)
        return f"✅ Successfully retrieved information for package Result: '{info}'."
    except Exception as e:
        return f"⚠️ Failed to retrieve information for package '{name}': {e}"

def remove_packages(names: list[str]):
    """
    Remove a list of specified package by running
    'sudo pacman -R <names>' on the shell
    Args: 
        names: list of strings 
    Returns: 
        returns the output of the removal process.
    """
    try:
        command = f"sudo pacman --noconfirm -R {' '.join(names)}"
        start_terminal(command)
        process = pexpect.spawn(command)
        process, message = handle_sudo(process)
        read_status(process)
        return f"✅ Successfully removed the follwing packages: {names}."
    except Exception as e:
        return f"⚠️ Failed to remove packages: {e}"

def remove_full_packages(names: list[str]):
    """
    Remove a list of package and their Dpenedencies
    by running 'sudo pacman -Rns <names>' on the shell
    Args: 
        names: list of strings 
    Returns: 
        returns the output of the removal process.
    """
    try:
        command = f"sudo pacman --noconfirm -Rns {' '.join(names)}"
        start_terminal(command)
        process = pexpect.spawn(command)
        process, message = handle_sudo(process)
        read_status(process)
        return "✅ Successfully removed packages and their dependencies."
    except Exception as e:
        return f"⚠️ Failed to remove packages and their dependencies: {e}"

def clean_package_cache():
    """
    this tool cleans the cache of packages on the system 
    by running 'sudo pacman --noconfirm -Sc' on the shell
    Args: 
        takes nothing
    Returns: 
        reutrns the result
    """
    try:
        command = f"sudo pacman --noconfirm -Sc"
        start_terminal(command)
        process = pexpect.spawn(command)
        process, message = handle_sudo(process)
        read_status(process)
        return "✅ Successfully cleaned package cache."
    except Exception as e:
        return f"⚠️ Failed to clean package cache: {e}"

def search_packages(name: str): 
    """
    this tool searches for a package on the system 
    by running 'sudo pacman --noconfirm -Sc' on the shell
    Args: 
        name : string
    Returns: 
        returns the list of similar packages
    """
    try:
        command = f"pacman -Ss {name}"
        start_terminal(command)
        process = pexpect.spawn(command)
        result = read_status(process)
        return f"✅ Successfully searched for package '{name}\n Result:\n {result}'."
    except Exception as e:
        return f"⚠️ Failed to search for package '{name}': {e}"

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
