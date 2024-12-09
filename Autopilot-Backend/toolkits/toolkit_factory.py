from memory.database import ToolbarSchema
from github_toolkit import get_github_toolkit
from package_toolkit import get_package_toolkit
from network_toolkit import get_network_toolkit
from navigation_toolkit import get_navigation_toolkit
from users_toolkit import get_users_toolkit
from shell_toolkit import get_shell_toolkit

tools = [get_github_toolkit,
         get_package_toolkit,
         get_network_toolkit,
         get_navigation_toolkit,
         get_shell_toolkit]

def toolkit_factory(toolbar: ToolbarSchema):
    toolkit = []
    for tool in toolbar: 
        if tool[1] == "Off": 
            continue
        if tool[0] == "Packages": 
            toolkit.extend(get_package_toolkit())
        elif tool[0] == "Shell": 
            toolkit.extend(get_shell_toolkit())
        elif tool[0] == "Network": 
            toolkit.extend(get_network_toolkit())
        elif tool[0] == "Github": 
            toolkit.extend(get_github_toolkit())
        elif tool[0] == "Navigation": 
            toolkit.extend(get_navigation_toolkit())
        elif tool[0] == "Users": 
            toolkit.extend(get_users_toolkit())
    return toolkit

def get_description(tools): 
    description = ""
    for tool in tools: 
        description += tool.__name__ + '\n'
        description += tool.__doc__ + '\n'
    return description

def description_factory(toolbar: ToolbarSchema):
    description = ""
    for tool in toolbar: 
        if tool[1] == "Off": 
            continue
        if tool[0] == "Packages": 
            description += "\nPackage Management Agent Tools:\n"
            description += get_description(get_package_toolkit())
        elif tool[0] == "Shell": 
            description += "\nLinux Shell Agent Tools:\n"
            description += get_description(get_shell_toolkit())
        elif tool[0] == "Network": 
            description += "\nNetwork Agent Tools:\n"
            description += get_description(get_network_toolkit())
        elif tool[0] == "Github": 
            description += "\nGithub Agent Tools:\n"
            description += get_description(get_github_toolkit())
        elif tool[0] == "Navigation": 
            description += "\nNavigation Agent Tools:\n"
            description += get_description(get_navigation_toolkit())
        elif tool[0] == "Users": 
            description += "\nUsers & Groups Agent Tools:\n"
            description += get_description(get_users_toolkit())
    return description
