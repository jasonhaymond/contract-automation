const { Graph } = require("../../models/graph");
const { syncSkus } = require("./skus");
const { syncTenants } = require("./tenants");

async function syncMicrosoft(db) {
    const contracts = await Graph.getContracts();
    const clients = contracts.map((contract) => contract.getClientModel());

    await syncTenants(db, clients);
    await syncSkus(db, clients);
}

module.exports = {
    syncMicrosoft,
};
