var PROTO_PATH = __dirname + '/star.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var starguide = protoDescriptor.starguide;
const server = new grpc.Server();



const fakeData = [
    {id: 1, userHash: '1234', name: 'Sun'},
    {id: 2, userHash: '4321', name: 'Moon'},
    {id: 3, userHash: '5678', name: 'Earth'}
]

function changeData(id, userHash, name) {
    const data = fakeData.find(item => item.id === id);
    if (data) {
        data.userHash = userHash;
        data.name = name;
    }
    return data;
}

function getStar(call, callback){
            const data = fakeData.find(item => item.id === call.request.id);
            if (data) {
                callback(null, data);
            } else {
                callback(new Error('Not found'));
            }
        }


function listStar(_, callback) { 
            callback(null, {"stars" : fakeData}); //This stars came from star.proto Starlist > StarItem
}

function insertStar(call, callback){
            const data = {id: fakeData.length + 1, userHash: call.request.userHash, name:call.request.name};
            if (data) fakeData.push(data);
            callback(null, data);
        }

function updateStar(call, callback){
            const data = changeData(call.request.id, call.request.userHash, call.request.name);
            if (data) {
                callback(null, data);
            } else {
                callback(new Error('Not found'));
            }
        }
        

function getServer() {
    var server = new grpc.Server();
    server.addService(starguide.StarService.service, {
      Find: getStar,
      List: listStar,
      Insert: insertStar,
    });
    return server;
}

var routeServer = getServer()
routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
    console.log('Server running at: ', routeServer.address);
});
