from shell_tools import handle_sudo, read_status, pexpect, EOF

def create_users(usernames: list[str], passwords: list[str]): 
    """
        This tool is used to create one or more
        user on the linux system 
        Args: 
            usernames: list of strings 
            passwords: list of strings
        Example: 
            usernaems = ["user1", "user2"]
            passwords = ["user1password", "user2password"]
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
            cmd = command + username 
            child = pexpect.spawn(cmd)
            child, message = handle_sudo(child)

            if "granted" in message: 
                issue = f"useradd: user '{username}' already exists"
                if issue in read_status(child): 
                    output += f"🚨 user by the name of {username} is already in the system.\n"
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
                    output += f"🚨 user by the name of {username} doesn't exist.\n"
                else: 
                    successful_removes.append(username)
                    output += f"✅ user by the name of {username} was removed.\n"
        except: 
            output += f"🚨 faild removing {username}.\n"

    return f"The result of the process:\n{output}"
