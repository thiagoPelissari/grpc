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