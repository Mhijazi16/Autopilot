from github import Github, Auth
import os

auth = Auth.Token(os.environ["GITHUB_TOKEN"])
github = Github(auth=auth)
