from grpc import server


from concurrent import futures
import random
import grpc

from star_pb2 import FavoriteUserResponse, FavoriteUsersResponse
import star_pb2_grpc

fakeData = [
    FavoriteUserResponse(id=1, userId=1234, productId="Produto1"),
    FavoriteUserResponse(id=2, userId=1234, productId="Produto2"),
    FavoriteUserResponse(id=3, userId=4321, productId="Produto3"),
    FavoriteUserResponse(id=4, userId=5555, productId="Produto4")
]

class StarService(star_pb2_grpc.StarServiceServicer):
    def Find(self, request, context):
        # return fakeData[request.UserId]
        result = [FavoriteUserResponse(id=favorite.id, userId=favorite.userId, productId=favorite.productId) for favorite in fakeData if favorite.userId == request.userId]
        return FavoriteUsersResponse(favorites=result) # the name favorite must be in star.proto > FavoriteUsersResponse > favorites = 1;

    def Insert(self, request, context):
        star = FavoriteUserResponse(id=len(fakeData) + 1, productId=request.productId, userId=request.userId)
        fakeData.append(star)
        return star


    def Delete(self, request, context):
        star = [x for x in fakeData if x.userId == request.userId and x.productId == request.productId]
        if len(star) > 0:
            fakeData.remove(star[0])
            return star[0]
        else:
            return FavoriteUserResponse(id=0, productId="", userId="")


def server_start():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    star_pb2_grpc.add_StarServiceServicer_to_server(StarService(), server)
    server.add_insecure_port('0.0.0.0:50051')
    server.start()
    server.wait_for_termination()


server_start()