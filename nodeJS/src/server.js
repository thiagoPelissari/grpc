var PROTO_PATH = __dirname + '/user.proto';
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
var userguide = protoDescriptor.userguide;
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

function getUser(call, callback){
    console.log("Unary Request")
    const data = fakeData.find(item => item.id === call.request.id);
    if (data) {
        callback(null, data);
    } else {
        callback(new Error('Not found'));
    }
}


//ao invés de dois parâmetros de uma chamada unária, uma stream server somente leva um único parâmetro, que vamos chamar de cal
//O objeto call é uma implementação de uma stream de escrita juntamente com o registro da chamada, portanto, se tivéssemos algum tipo de parâmetro para ser enviado, 
//poderíamos obte-los através de call.request.parametro
async function listUserStreamServer(call) { 
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (const fake of fakeData) {
        await snooze(1000);
        call.write(fake)
    }
    call.end()//é importante, pois instrui o cliente a fechar a conexão, se isso não for feito, o mesmo cliente não poderá fazer outra chamada para o mesmo serviço 
}


//Client Grcp must return callback function
function listUserStreamClient(call, callback){
    const result = [];
    console.log("Client Stream Request")

    call.on('data',function(user){
        dataSearched = fakeData.find(item => item.id === user.id);
        if (dataSearched != null) {
            result.push(dataSearched);
        }
        //else
    });
    call.on('end',function(){
        callback(null,{"users" : result}); //This users came from user.proto Userlist > UserItem);
    })
}

//Bidirectional or duplex stream, must return call.write and call.end
async function listUserStreamDuplex(call) { 
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    let result = [];
    call.on('data', async function(user){
        await snooze(3000);
        dataSearched = fakeData.find(item => item.id === user.id);
        if (dataSearched != null) {
            result = dataSearched;
        }
        //else
        call.write(result)
    });
    call.on('end', function(){
        call.end();
    })
}

function listUser(_, callback) { 
    callback(null, {"users" : fakeData}); //This users came from user.proto Userlist > UserItem
}


function insertUser(call, callback){
    const data = {id: fakeData.length + 1, userHash: call.request.userHash, name:call.request.name};
    if (data) fakeData.push(data);
    callback(null, data);
}

function updateUser(call, callback){
    const data = changeData(call.request.id, call.request.userHash, call.request.name);
    if (data) {
        callback(null, data);
    } else {
        callback(new Error('Not found'));
    }
}
        

function getServer() {
    var server = new grpc.Server();
    server.addService(userguide.UserService.service, {
      Find: getUser,
      List: listUser,
      Insert: insertUser,
      ListStreamServer: listUserStreamServer, 
      ListStreamClient: listUserStreamClient,
      ListStreamBidirectional: listUserStreamDuplex,
    });
    return server;
}

var routeServer = getServer()
routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
    console.log('Server running at: ', routeServer.address);
});
