from memory.database import ToolbarSchema
from .github_toolkit import get_github_toolkit
from .package_toolkit import get_package_toolkit
from .network_toolkit import get_network_toolkit
from .navigation_toolkit import get_navigation_toolkit
from .users_toolkit import get_users_toolkit
from .shell_toolkit import get_shell_toolkit

tools = [get_github_toolkit,
         get_package_toolkit,
         get_network_toolkit,
         get_navigation_toolkit,
         get_shell_toolkit]

def toolkit_factory(toolbar: ToolbarSchema):
    toolkit = []
    for key, value in toolbar.items(): 
        if value == "Off": 
            continue
        if key == "Packages": 
            toolkit.extend(get_package_toolkit())
        elif key == "Shell": 
            toolkit.extend(get_shell_toolkit())
        elif key == "Network": 
            toolkit.extend(get_network_toolkit())
        elif key == "Github": 
            toolkit.extend(get_github_toolkit())
        elif key == "Navigation": 
            toolkit.extend(get_navigation_toolkit())
        elif key == "Users": 
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
    for key, value in toolbar.items(): 
        if value == "Off": 
            continue
        if key == "Packages": 
            description += "\nPackage Management Agent Tools:\n"
            description += get_description(get_package_toolkit())
        elif key == "Shell": 
            description += "\nLinux Shell Agent Tools:\n"
            description += get_description(get_shell_toolkit())
        elif key == "Network": 
            description += "\nNetwork Agent Tools:\n"
            description += get_description(get_network_toolkit())
        elif key == "Github": 
            description += "\nGithub Agent Tools:\n"
            description += get_description(get_github_toolkit())
        elif key == "Navigation": 
            description += "\nNavigation Agent Tools:\n"
            description += get_description(get_navigation_toolkit())
        elif key == "Users": 
            description += "\nUsers & Groups Agent Tools:\n"
            description += get_description(get_users_toolkit())
    return description
