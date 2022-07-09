## GRPC NodeJS
### Como rodar ?
Entre na pasta nodeJS e rode os comandos abaixo

`Dependencias`
```shell script
npm i
```

`===SERVER====`
<br />
1 Run the Server 
```shell script
node src/server.js
```

`===CLIENT====`
<br />
2 Run the Client
```shell script
node src/client.js 
```


---

## PYTHON
### Como rodar ?
Entre na pasta python e rode os comandos abaixo

`Dependencias`
```shell script
pip install requirements.txt
```

`===SERVER====`
<br />

```shell script
python star_server.py
```

`===CLIENT====`
<br />
```shell script
python XPTO
```


`===Dica====`
<br >
### Se quiser alterar o objeto no arquivo .proto, basta seguir os passos abaixo
<br >
1 Alterar o arquivo .proto da forma que desejar, em protobufs > star.proto
<br >
2 Deletar os arquivos star_pb2_grpc.py e star_pb2.py
<br >
3 Entrar na pasta python > gprc pelo terminalrodar e rodar o código abaixo. Após isso os arquivos deletados acima serão recriadas

```shell script
python -m grpc_tools.protoc -I ../protobufs --python_out=. \
         --grpc_python_out=. ../protobufs/star.proto
```




---
## REFERENCIAS

`NodeJS`
<br >
Tutorial 
https://grpc.io/docs/languages/node/basics/#simple-rpc

PROTO
https://github.com/grpc/grpc/blob/v1.46.3/examples/protos/route_guide.proto


Server
https://github.com/grpc/grpc/blob/v1.46.3/examples/node/dynamic_codegen/route_guide/route_guide_server.js


Call from CLient
https://github.com/grpc/grpc/blob/v1.46.3/examples/node/dynamic_codegen/route_guide/route_guide_client.js

`Python`
<br >
Basico Grpc
https://grpc.io/docs/languages/python/basics/

Grpc no modelo microsservice
https://realpython.com/python-microservices-grpc/#why-microservices