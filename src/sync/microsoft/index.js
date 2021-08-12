const { Graph } = require("../../models/graph");

async function syncMicrosoft(db) {
    const contracts = await Graph.getContracts();
    const model = contracts[0].getClientModel();
    const users = await model.getUsers();
    console.log(users);
}

module.exports = {
    syncMicrosoft,
};
