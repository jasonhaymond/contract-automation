const { createClient } = require("./client");

module.exports = {
    GraphClient: createClient(),
    createClient,
};
