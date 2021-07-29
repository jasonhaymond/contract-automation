const { Graph } = require("../../models/graph");

async function syncMicrosoft(db) {
    const contracts = await Graph.getContracts();
    console.log(contracts);
}

module.exports = {
    syncMicrosoft,
};
