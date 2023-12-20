module.exports = {
  networks: {
    node1: {
      host: "node1",
      port: 8545,
      network_id: "*",
      gas: 6000000,
    },
    node2: {
      host: "node2",
      port: 8546,
      network_id: "*",
      gas: 6000000,
    },
  },
};
