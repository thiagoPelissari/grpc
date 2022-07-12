// create a nodeJS grpc client

const chalk = require('chalk');
var PROTO_PATH = __dirname + '/star.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var starguide = protoDescriptor.starguide;
var client = new starguide.StarService('0.0.0.0:50051', grpc.credentials.createInsecure());


client.Find({ "id": 2 }, (err, response) => {
    if (err) {
        console.log(chalk.red('Error: ' + err.message));
    }
    else {
        console.log(chalk.blue("Testing grpc FindStar"));
        console.log(response);
    }
});



client.List({}, (err, response) => {
    if (err) {
        console.log(chalk.red('Error: ' + err.message));
    }else{
        console.log(chalk.blue("Testing grpc ListStar"));
        console.log(response.stars);
    }
});

//Chamada Server Stream
var call = client.ListStreamServer({});
  call.on('data', function(feature) {
      console.log('Sever Stream: ' + feature.name);
  });
  call.on('end', function() {
    // The server has finished sending
    console.log(chalk.blue("Testing grpc ListStarServerStream END"));
  });
  call.on('error', function(e) {
    // An error has occurred and the stream has been closed.
  });
  call.on('status', function(status) {
    // process status
  });


//Chamada Client Stream
const call2 = client.ListStreamClient((err, response) => {
    if (err) throw err
    console.log(response)
    console.log(chalk.blue("Testing grpc ListStarClientStream END"));
})
call2.write({ id: 1 })
call2.write({ id: 2 })
call2.write({ id: 3 })
call2.end()



//Chamada Bidirectional Stream
//Cliente fecha a conexão ai vai para o server.js e la no call.on('end') ele também fecha.
var call3 = client.ListStreamBidirectional({});
let count = 0;
  call3.on('data', function(feature) {
    count += 1;
    console.log('Bidirectional: ' + feature.name);

    if(count == 6){//6 baseado no numero de writes abaixo
        call3.end()
    }
  });
  call3.on('end', function() {
    // The server has finished sending
    console.log(chalk.blue("Testing grpc ListStarBidirectionalStream END"));
  });
  call3.on('error', function(e) {
    // An error has occurred and the stream has been closed.
  });
  call3.on('status', function(status) {
    // process status
  });

call3.write({ id: 1 })
call3.write({ id: 2 })
call3.write({ id: 3 })
call3.write({ id: 2 })
call3.write({ id: 1 })
call3.write({ id: 2 })
