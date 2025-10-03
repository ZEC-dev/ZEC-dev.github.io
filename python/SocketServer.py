import socket
def Sclient(ip,port):
    Client_s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    try:
        Client_s.connect((ip,port))
        Req="Hello"
        Client_s.send(Req.encode('utf-8'))
        Res=Client_s.recv(1024).decode('utf-8')
        print(f"Get {Res}")
    finally:
        Client_s.close()
if __name__ == '__main__':
    Sclient('127.0.0.1',8081)
