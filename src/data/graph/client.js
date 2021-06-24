const { Client } = require("@microsoft/microsoft-graph-client");
const { MyAuthenticationProvider } = require("./MyAuthenticationProvider");

const createClient = (tenantID, clientID, secret) =>
    Client.initWithMiddleware({
        authProvider: new MyAuthenticationProvider(tenantID, clientID, secret),
    });

module.exports = {
    createClient,
};
