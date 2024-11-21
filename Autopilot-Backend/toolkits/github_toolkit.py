from github import Github, Auth
import os

auth = Auth.Token(os.environ["GITHUB_TOKEN"])
github = Github(auth=auth)
user = github.get_user()

def show_repo_content(repo_name: str):
    """ this tool is used to show the 
        content of repository 
        Args: 
            repo_name: str"""
    repo = user.get_repo(repo_name)
    content = repo.get_contents("")
    output = "repository description: \n" + repo.description
    for file in content: 
        output += '\n' + file.path
    return output

def create_repository(name, description="", private=False):
    """ this tool is used to create a repository 
        Args: 
            name: str 
            description: str 
            private: bool 
    """
    try: 
        repo = user.create_repo(
            name,
            description,
            private=private
        )
        return f"Repository '{repo.name}' created successfully url: {repo.url}"
    except Exception as e: 
        return f"error {e}"

def delete_repository(name): 
    """ this tool is used to delete a repository 
        Args: 
            name: str 
    """
    try: 
        repo = user.get_repo(name)
        repo.delete()
        return f"Repository '{repo.name}' was deleted."
    except Exception as e: 
        return f"error {e}"

def modify_repository(name, description=""): 
    """ this tool is used to modify a repository description
        takes in repo name and new descriptoin
        Args: 
            name: str 
            description: str
    """
    try: 
        repo = user.get_repo(name)
        if description != "": 
            repo.edit(description=description)
        return f"Repository '{repo.name}' was modified."
    except Exception as e: 
        return f"error {e}"

def read_repository_file(repo_name, file_name):
    """ this tool is used to read content of a file 
        in a repository takes in repo_name and file_name
        Args: 
            repo_name: str
            file_name: str
    """
    try: 
        repo = user.get_repo(repo_name)
        content = repo.get_contents(file_name)
        return content.decoded_content.decode("utf-8")
    except Exception as e: 
        return f"error {e}"

def add_repository_file(repo_name, path, commit_msg, content):
    """ this tool is used to create a file in a 
        repository takes in repo_name and path
        and commit messages and content inside file
        Args: 
            repo_name: str
            path: str 
            commit_msg: str
            content: str
        path shouldn't start with / and 
        should include the name of file
    """
    try: 
        repo = user.get_repo(repo_name)
        repo.create_file(path=path, message=commit_msg, content=content)
        return f"created {path} on {repo_name}"
    except Exception as e: 
        return f"error {e}"

def update_repository_file(repo_name, file_name, commit_msg, updates):
    """ this tool is used to update a file in a 
        repository takes in repo_name and file_name 
        and commit messages and updates inside file
        Args: 
            repo_name: str
            file_name: str 
            commit_msg: str
            updates: str
    """
    try: 
        repo = user.get_repo(repo_name)
        file = repo.get_contents(file_name)
        repo.update_file(path=file.path, content=updates, sha=file.sha, message=commit_msg)
        return f"updated {file_name} in repo: {repo_name}."
    except Exception as e: 
        return f"error {e}"

def remove_repository_file(repo_name, file_name, commit_msg):
    """ this tool is used to remove a file in a 
        repository takes in repo_name and file_name 
        and commit messages 
        Args: 
            repo_name: str
            file_name: str 
            commit_msg: str
    """
    try: 
        repo = user.get_repo(repo_name)
        file = repo.get_contents(file_name)
        repo.delete_file(path=file.path, sha=file.sha, message=commit_msg)
        return f"removed {file_name} from repo {repo_name}."
    except Exception as e: 
        return f"error {e}"

def get_github_toolkit():
    return [create_repository,
            delete_repository,
            modify_repository,
            remove_repository_file,
            add_repository_file,
            update_repository_file,
            read_repository_file,
            show_repo_content]

def get_toolkit_description(): 
    tools = get_github_toolkit()
    description = "The following are the tools you can use:\n"
    for tool in tools: 
        description += tool.__name__ + '\n'
        description += tool.__doc__ + '\n'
    return description


