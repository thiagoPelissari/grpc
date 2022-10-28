from asyncio.log import logger
import time
from grpc import server

from concurrent import futures
import grpc

from user_pb2 import UserList, UserItem
import user_pb2_grpc

fakeData = [
    UserItem(id=1, userHash="032f75b3ca02a393196a818", name="User 1"),
    UserItem(id=2, userHash="31d6cfe0d16ae931b73c59d", name="User 2"),
    UserItem(id=3, userHash="9c1185a5c5e9fc546128081", name="User 3"),
    UserItem(id=4, userHash="22d65d5661536cdc75c1fdf", name="User 4")
]

class GrpcService(user_pb2_grpc.UserServiceServicer):
    def Find(self, request, context):
        user = [x for x in fakeData if x.id == request.id]
        return user[0]
        

    def Insert(self, request, context):
        user = UserItem(id=len(fakeData) + 1, name=request.name, userHash=request.userHash)
        fakeData.append(user)
        return user


    def Delete(self, request, context):
        user = [x for x in fakeData if x.id == request.id]
        if len(user) > 0:
            fakeData.remove(user[0])
            return user[0]
        else:
            return user

    def List(self, request, context):
        return UserList(users=fakeData)

    def ListStreamServer(self, request, context):
        for user in fakeData:
            time.sleep(2)
            yield user
    
    def ListStreamClient(self, request, context):
        for user in request:
            print(user)
        return UserList(users=fakeData)

    def ListStreamBidirectional(self, request, context):
        for user in request:
            time.sleep(5)
            user = [x for x in fakeData if x.id == user.id]
            print(user[0])
            yield user[0]
        


def server_start():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserServiceServicer_to_server(GrpcService(), server)
    server.add_insecure_port('0.0.0.0:50051')
    server.start()
    server.wait_for_termination()


server_start()