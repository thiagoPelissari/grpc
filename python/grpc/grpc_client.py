import time
import user_pb2_grpc
import user_pb2
import grpc


def find_user():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    response = stub.Find(user_pb2.UserItem(id=1))
    print(response)

def list_users():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    response = stub.List(user_pb2.UserList())
    print(response)

def insert_user():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    response = stub.Insert(user_pb2.UserItem(id=5, name="User 5", userHash="123456789"))
    print(response)

def delete_user():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    response = stub.Delete(user_pb2.UserItem(id=5))
    print(response)

def list_users_stream_server():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    response = stub.ListStreamServer(user_pb2.UserList())
    for user in response:
        print(user)

def list_users_stream_client():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    def get_users():
        for i in range(1, 5):
            user = user_pb2.UserItem(id=i)
            print(f'processando {user}')
            yield user
            time.sleep(1)
    
    # Return the last user processed
    response = stub.ListStreamClient(iter(get_users()))
    print(response)

def list_users_stream_bidirectional():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)
    def get_users():
        for i in range(1, 5):
            user = user_pb2.UserItem(id=i)
            print(f'processando {user}')
            yield user
            time.sleep(1)
    
    # Return the last user processed
    response = stub.ListStreamBidirectional(iter(get_users()))
    for user in response:
        print(user)
   
        
        

def run():
    # find_user()
    # list_users()
    # insert_user()
    # delete_user()
    # list_users_stream_server()
    # list_users_stream_client()
    # list_users_stream_bidirectional()



if __name__ == '__main__':
    run()
    