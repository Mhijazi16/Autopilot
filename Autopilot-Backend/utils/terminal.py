import tkinter as tk
import socket
import threading
import re
from GPUtil.GPUtil import os

class Terminal:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Autopilot Terminal")

        self.root.geometry("800x500")
        self.root.configure(bg="#0c0c0c")

        self.frame = tk.Frame(self.root, bg="#0c0c0c")
        self.frame.pack(expand=True, fill="both", padx=10, pady=10)

        self.text_widget = tk.Text(
            self.frame,
            wrap="word",
            bg="#0c0c0c",
            fg="#0078fd",
            insertbackground="white",
            font=("Fira Code", 18),
            padx=10,
            pady=10,
            borderwidth=0,
            highlightthickness=0
        )
        self.text_widget.pack(expand=True, fill="both")
        self.text_widget.config(state="disabled")

    def append_text(self, text):
        ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
        plain_text = ansi_escape.sub('', text)

        self.text_widget.config(state="normal")

        for line in plain_text.splitlines():
            line_end_index = self.text_widget.index("end-1c")
            self.text_widget.insert("end", "\n" + line )
            
            if "$" in line:
                self.text_widget.tag_add("blue", line_end_index, self.text_widget.index("end-1c"))
            elif "✅" in line: 
                self.text_widget.tag_add("green", line_end_index, self.text_widget.index("end-1c"))
            elif "🚨" in line: 
                self.text_widget.tag_add("red", line_end_index, self.text_widget.index("end-1c"))
            else:
                self.text_widget.tag_add("white", line_end_index, self.text_widget.index("end-1c"))

        self.text_widget.tag_config("blue", foreground="#0078fd")
        self.text_widget.tag_config("green", foreground="#198754")
        self.text_widget.tag_config("red", foreground="#DC3545")
        self.text_widget.tag_config("white", foreground="white")

        self.text_widget.see("end")
        self.text_widget.config(state="disabled")

    def start_socket_server(self):
        socket_path = "/tmp/terminal_socket"
        try:
            import os
            os.unlink(socket_path)
        except FileNotFoundError:
            pass

        self.server_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.server_socket.bind(socket_path)
        self.server_socket.listen(1)
        print("Server listening on /tmp/terminal_socket")

        while True:
            conn, _ = self.server_socket.accept()
            with conn:
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    text = data.decode("utf-8")
                    self.root.after(0, self.append_text, text)

    def start(self):
        threading.Thread(target=self.start_socket_server, daemon=True).start()
        self.root.mainloop()

terminal = Terminal()
terminal.start()
os.system("rm /tmp/terminal_socket")
