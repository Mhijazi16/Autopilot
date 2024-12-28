import socket

def send_to_terminal(message): 
    socket_path = "/tmp/terminal_socket"

    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client_socket:
        client_socket.connect(socket_path)
        client_socket.sendall(message.encode("utf-8"))
