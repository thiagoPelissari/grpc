// create a nodeJS grpc client

const chalk = require('chalk');
var PROTO_PATH = __dirname + '/user.proto';
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
var userguide = protoDescriptor.userguide;
var client = new userguide.UserService('0.0.0.0:50051', grpc.credentials.createInsecure());


//Chamada Unary FIND
client.Find({ "id": 2 }, (err, response) => {
    if (err) {
        console.log(chalk.red('Error: ' + err.message));
    }
    else {
        console.log(chalk.blue("Testing grpc FindUser"));
        console.log(response);
    }
});


//Chamada Unary LIST
client.List({}, (err, response) => {
    if (err) {
        console.log(chalk.red('Error: ' + err.message));
    }else{
        console.log(chalk.blue("Testing grpc ListUser"));
        console.log(response.users);
    }
});

//Chamada Server Stream
var call = client.ListStreamServer({});
  call.on('data', function(feature) {
      console.log(chalk.green('Sever Stream: ' + feature.name));
  });
  call.on('end', function() {
    // The server has finished sending
    console.log(chalk.blue("Testing grpc ListUserServerStream END"));
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
    console.log(chalk.blue("Testing grpc ListUserClientStream END"));
})

call2.on('data', function(feature) {
    console.log(chalk.green(('Client Stream: ' + feature.name)));
});

call2.write({ id: 1 })
call2.write({ id: 2 })
call2.write({ id: 3 })
call2.end()



//Chamada Bidirectional Stream
let count = 0;
var call3 = client.ListStreamBidirectional({});
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
call3.on('data', async function(feature) {
  count++;
  console.log(chalk.green(('Bidirectional Stream: ' + feature.name)));
  await snooze(4000);
  if(count == 4){//4 baseado no numero de writes abaixo
    call3.end()//Se não fexar o stream, o servidor não termina a chamada e o terminal fica travado
}
});
call3.on('end', function() {
  // The server has finished sending
  console.log(chalk.blue("Testing grpc ListUserBidirectionalStream END"));
}
);
call3.on('error', function(e) {
  // An error has occurred and the stream has been closed.
}
);
call3.on('status', function(status) {
  // process status
}
);
call3.write({ id: 1 })
call3.write({ id: 2 })
call3.write({ id: 3 })
call3.write({ id: 3 })
