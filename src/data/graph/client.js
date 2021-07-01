const { Client } = require("@microsoft/microsoft-graph-client");
const { MyAuthenticationProvider } = require("./MyAuthenticationProvider");

const {
    MICROSOFT_GRAPH_CLIENT_ID,
    MICROSOFT_GRAPH_TENANT_ID,
    MICROSOFT_GRAPH_SECRET,
} = process.env;

const createClient = (
    tenantID = MICROSOFT_GRAPH_TENANT_ID,
    clientID = MICROSOFT_GRAPH_CLIENT_ID,
    secret = MICROSOFT_GRAPH_SECRET
) =>
    Client.initWithMiddleware({
        authProvider: new MyAuthenticationProvider(tenantID, clientID, secret),
    });

module.exports = {
    createClient,
};
