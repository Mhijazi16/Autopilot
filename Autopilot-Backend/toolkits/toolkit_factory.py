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
