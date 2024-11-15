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
