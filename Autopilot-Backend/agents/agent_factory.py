from toolkits.github_toolkit import get_github_toolkit
from toolkits.package_toolkit import get_package_toolkit
from toolkits.network_toolkit import get_network_toolkit
from toolkits.navigation_toolkit import get_navigation_toolkit
from toolkits.process_toolkit import get_process_toolkit
from toolkits.users_toolkit import get_users_toolkit
from toolkits.shell_toolkit import get_shell_toolkit
from toolkits.filesystem_toolkit import get_filesystem_toolkit
from .shell_agent import ShellAgent
from .react import ReactAgent

def agent_factory(agent , config):
    toolkit = []
    if agent == "Packages": 
        toolkit = get_package_toolkit()
    elif agent == "Shell": 
        return ShellAgent()
    elif agent == "Network": 
        toolkit = get_network_toolkit()
    elif agent == "Github": 
        toolkit = get_github_toolkit()
    elif agent == "Navigation": 
        toolkit = get_navigation_toolkit()
    elif agent == "Users": 
        toolkit = get_users_toolkit()
    elif agent == "Filesystem": 
        toolkit = get_filesystem_toolkit()
    elif agent == "Process": 
        toolkit = get_process_toolkit()

    return ReactAgent("llama3.2", toolkit, config) 
