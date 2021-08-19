const { Graph } = require("../../models/graph");

async function syncMicrosoft(db) {
    const contracts = await Graph.getContracts();
    const clients = contracts.map((contract) => contract.getClientModel());
    const tenants = await Promise.all(
        clients.map((client) => client.getTenant())
    );

    console.log(tenants);
}

module.exports = {
    syncMicrosoft,
};
