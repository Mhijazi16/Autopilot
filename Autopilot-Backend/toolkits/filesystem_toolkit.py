import subprocess

def run_command(command):
    output = subprocess.check_output(command, shell=True, text=True, stderr=subprocess.DEVNULL)
    return output.strip()

def open_folder(path: str): 
    """
    this tool is used to open a folder 
    in the linux file system 
    Args: 
        path: str
    Example: 
        if user wants to open Videos folder
        you should provide the following path 
        /home/ha1st/Videos
        and if we need to open Music
        then: 
        /home/ha1st/Music
        else just provide the specific path 
        of the folder you want to open
    """

    run_command(f"nautilus {path} > /dev/null 2>&1 &")
    output = "The folder was opened and this is what the user sees:\n"
    output += run_command(f"ls {path}")
    return output

def find_file(name: str): 
    """
    this tool is used to find where 
    a file exists or what is the full 
    path of the file if the same file 
    exists in different locaitons multiple 
    files will be returned
    """

    paths = run_command(f"locate {name}").split()
    output = "the file exists in the following locations :\n"
    for i, path in enumerate(paths): 
        output += f"{i+1}) {path}\n" 

    return output
