from Tools.shell_tools import handle_sudo, read_status, pexpect
from pexpect import pxssh, EOF

def create_users(usernames: list[str], passwords: list[str]): 
    """
        This tool is used to create one or more
        user on the linux system 
        Args: 
            usernames: list of strings 
            passwords: list of strings
        usernames must be lower case and doesn't 
        contain spaces.
        passwords must be random charachters can 
        contain digits letters and symbols like 
        Go12j#@1
    """

    if len(usernames) == 0 or len(passwords) == 0: 
        return "⚠️ Error: usernames or passwords are empty" 
    elif len(usernames) != len(passwords): 
        return "⚠️ Error: usernames length doesn't equal passwords length"
    
    successful_users = []
    command = "sudo useradd -m "
    output = ""
    for username in usernames: 
        try: 
            username = username.strip().lower()
            cmd = command + username 
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"useradd: user '{username}' already exists"
                if issue in read_status(child): 
                    output += f"🚧 user by the name of {username} is already in the system.\n"
                else: 
                    successful_users.append(username)
                    output += f"✅ user by the name of {username} was created.\n"
        except: 
            output += f"🚨 faild creating {username} as a user.\n"

    return f"The result of the process:\n{output}"

def remove_users(usernames: list[str]): 
    """
        This tool is used to remove one or more
        user from the linux system 
        Args: 
            usernames: list of strings 
        Example: 
            usernaems = ["user1", "user2"]
    """

    if len(usernames) == 0: 
        return "⚠️ Error: no usernames were supplied!" 
    
    successful_removes = []
    command = "sudo userdel -r "
    output = ""

    for username in usernames: 
        try: 
            cmd = command + username 
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"userdel: user '{username}' does not exist"
                if  issue in read_status(child): 
                    output += f"🚧 user by the name of {username} doesn't exist.\n"
                else: 
                    successful_removes.append(username)
                    output += f"✅ user by the name of {username} was removed.\n"
        except: 
            output += f"🚨 faild removing {username}.\n"

    return f"The result of the process:\n{output}"

def add_groups(names: list[str]): 
    """
        This Tool used to create one 
        or more groups on the linux 
        system 
        Args: 
            names: list of strings
    """
    if len(names) == 0: 
        return "⚠️ Error: no group names were supplied!" 

    command = "sudo groupadd "
    output = ""
    for group in names: 
        try: 
            cmd = command + group 
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"groupadd: group '{group}' already exists"
                if  issue in read_status(child): 
                    output += f"🚧 group by the name of '{group}' already exist.\n"
                else: 
                    output += f"✅ group by the name of '{group}' was added.\n"
        except: 
            output += f"🚨 faild creating {group}.\n"

    return f"The result of the process:\n{output}"

def remove_groups(names: list[str]): 
    """
        This Tool used to remove one 
        or more groups on the linux 
        system 
        Args: 
            names: list of strings
    """
    if len(names) == 0: 
        return "⚠️ Error: no group names were supplied!" 

    command = "sudo groupdel "
    output = ""
    for group in names: 
        try: 
            cmd = command + group 
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"groupdel: group '{group}' does not exist"
                if  issue in read_status(child): 
                    output += f"🚧 group by the name of '{group}' doesn't exist.\n"
                else: 
                    output += f"✅ group by the name of '{group}' was removed.\n"
        except: 
            output += f"🚨 faild removing {group}.\n"

    return f"The result of the process:\n{output}"

def add_group_users(group: str, usernames: list[str]): 
    """
        this tool adds one or more users to 
        a group takes in group name and usernames
        Args: 
            group: str
            usernames: list of strings
    """

    names = ",".join(usernames)
    command = f"sudo gpasswd -M {names} {group}"
    print(command)
    child = pexpect.spawn(command)
    child, message = handle_sudo(child)

    return f"✅ {names} where added to group {group}"

def change_password(username: str, new_password: str): 
    """ 
        This tool is used to change 
        password of a user 
        Args: 
            username: str 
            new_password: str
    """
    try:
        command = f"sudo passwd {username}"
        child = pexpect.spawn(command)
        child, message = handle_sudo(child)

        if "granted" in message: 
            child.expect("New password: ")
            child.sendline(new_password)
            child.expect("Retype new password: ")
            child.sendline(new_password)
            child.expect(EOF)
            return "✅ " + read_status(child).strip()
        else: 
            return "🚧 Access Denied." 
    except:
        return "🚨 faild changing the password."

def get_tool_kit():
    return [create_users,
            remove_users,
            add_groups,
            remove_groups,
            add_group_users,
            change_password]

