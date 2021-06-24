const { createClient } = require("./client");

const {
    MICROSOFT_GRAPH_CLIENT_ID,
    MICROSOFT_GRAPH_TENANT_ID,
    MICROSOFT_GRAPH_SECRET,
} = process.env;

module.exports = {
    GraphClient: createClient(
        MICROSOFT_GRAPH_TENANT_ID,
        MICROSOFT_GRAPH_CLIENT_ID,
        MICROSOFT_GRAPH_SECRET
    ),
    createClient,
};
