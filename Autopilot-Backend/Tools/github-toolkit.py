from github import Github, Auth
import os

auth = Auth.Token(os.environ["GITHUB_TOKEN"])
github = Github(auth=auth)
user = github.get_user()

def create_repository(name, description="", private=False):
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
    try: 
        repo = user.get_repo(name)
        repo.delete()
        return f"Repository '{repo.name}' was deleted."
    except Exception as e: 
        return f"error {e}"

def modify_repository(name, description=""): 
    try: 
        repo = user.get_repo(name)
        if description != "": 
            repo.edit(description=description)
        return f"Repository '{repo.name}' was modified."
    except Exception as e: 
        return f"error {e}"

def read_repository_file(repo_name, file_name):
    try: 
        repo = user.get_repo(repo_name)
        content = repo.get_contents(file_name)
        return content.decoded_content.decode("utf-8")
    except Exception as e: 
        return f"error {e}"

def create_repository_file(repo_name, path, commit, content):
    """ path shouldn't start with / """
    try: 
        repo = user.get_repo(repo_name)
        repo.create_file(path=path, message=commit, content=content)
        return f"created {path} on {repo_name}"
    except Exception as e: 
        return f"error {e}"

