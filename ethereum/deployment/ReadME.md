These files enable basic deployment of the Ethereum architecture used in this implementation. 

To deploy the architecture, you need to perform the following steps: 

```console
docker-compose up -d
truffle migrate --network node1
truffle migrate --network node2
docker-compose down
```
