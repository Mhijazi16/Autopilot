import subprocess
import os

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

def open_file(file_path: str):
    """
        this tool is used to open up 
        a file of any type to the end user 
        weather its coding or general document
        Args: 
            file_path: str
    """

    programming_extensions = {".txt", ".py", ".cpp", ".c", ".java", ".js", ".ts", ".cs", ".go", ".rb", ".rs"}
    document_extensions = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"}
    video_extensions = {".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv"}
    image_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".svg"}

    if not os.path.isfile(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return "The file doesn't exist"

    _, extension = os.path.splitext(file_path)
    extension = extension.lower()

    try:
        if extension in programming_extensions:
            run_command(f"neovide {file_path}")
        elif extension in document_extensions:
            run_command(f"evince {file_path}")
        elif extension in video_extensions: 
            run_command(f"totem {file_path}")
        elif extension in image_extensions: 
            run_command(f"swappy -f {file_path}")
        else:
            return "I don't know how to open that type of file"
    except Exception as e:
        print(f"Error occurred : {e}")

    return f"file was successfully opened to the users"
