import os
from toolkits.shell_toolkit import handle_sudo, read_status, pexpect, send_to_terminal, start_terminal
from pexpect import EOF

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
    for username, password in zip(usernames, passwords): 
        try: 
            tmp = ""
            username = username.strip().lower()
            cmd = command + username 
            start_terminal(cmd)
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"useradd: user '{username}' already exists"
                if issue in read_status(child): 
                    tmp = f"🚧 user by the name of {username} is already in the system.\n"
                else: 
                    successful_users.append(username)
                    change_password(username,password)
                    tmp = f"✅ user by the name of {username} was created.\n"

        except: 
            tmp = f"🚨 faild creating {username} as a user.\n"
        finally: 
            send_to_terminal(tmp)
            output += tmp

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
            tmp = ""
            cmd = command + username 
            start_terminal(cmd)
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"userdel: user '{username}' does not exist"
                if  issue in read_status(child): 
                    tmp = f"🚧 user by the name of {username} doesn't exist.\n"
                else: 
                    remove_groups([username])
                    successful_removes.append(username)
                    tmp =  f"✅ user by the name of {username} was removed.\n"
        except: 
            tmp = f"🚨 faild removing {username}.\n"
        finally: 
            send_to_terminal(tmp)
            output += tmp

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
            tmp = ""
            cmd = command + group 
            start_terminal(cmd)
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"groupadd: group '{group}' already exists"
                if  issue in read_status(child): 
                    tmp = f"🚧 group by the name of '{group}' already exist.\n"
                else: 
                    tmp = f"✅ group by the name of '{group}' was added.\n"
        except: 
            tmp = f"🚨 faild creating {group}.\n"
        finally: 
            send_to_terminal(tmp)
            output += tmp

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
            tmp = ""
            cmd = command + group 
            start_terminal(cmd)
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"groupdel: group '{group}' does not exist"
                if  issue in read_status(child): 
                    tmp = f"🚧 group by the name of '{group}' doesn't exist.\n"
                else: 
                    tmp = f"✅ group by the name of '{group}' was removed.\n"
        except: 
            tmp = f"🚨 faild removing {group}.\n"
        finally: 
            send_to_terminal(tmp)
            output += tmp

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
    start_terminal(command)
    output = ""

    try:
        child = pexpect.spawn(command)
        child, message = handle_sudo(child)
        output = f"✅ {names} where added to group {group}"
    except Exception as e:
        output = f"🚨 faild adding {names} to group : {group}.\n"
    finally: 
        send_to_terminal(output)

    return output

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
        start_terminal(command)
        child = pexpect.spawn(command)
        password = str(os.getenv("PASS"))

        child.expect_exact("[sudo] password for ha1st: ")
        child.sendline(password)

        child.expect_exact("New password: ")
        child.sendline(new_password)
        child.expect_exact("Retype new password: ")
        child.sendline(new_password)
        child.expect(EOF)
        output = f"✅ Password successfully chagned to {new_password}" 
    except:
        output = "🚨 faild changing the password."
    finally: 
        send_to_terminal(output)
        return output

def list_system_users():
    """
    this tool is used to list system users
    """
    command = "awk -F: '$6 ~ /^\\/home\\// {print $1}' /etc/passwd"
    start_terminal(command)
    output = os.popen(command).read()
    send_to_terminal(output)
    return "The following are the users on the system: \n {output}"

def get_users_toolkit():
    return [list_system_users,
            create_users,
            remove_users,
            add_groups,
            remove_groups,
            add_group_users,
            change_password]
