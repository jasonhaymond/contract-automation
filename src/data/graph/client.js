const { Client } = require('@microsoft/microsoft-graph-client');
const { MyAuthenticationProvider } = require('./MyAuthenticationProvider');

const {
    MICROSOFT_GRAPH_CLIENT_ID,
    MICROSOFT_GRAPH_TENANT_ID,
    MICROSOFT_GRAPH_SECRET,
} = process.env;

const newClient = () => Client.initWithMiddleware({
    authProvider: new MyAuthenticationProvider(
        MICROSOFT_GRAPH_TENANT_ID,
        MICROSOFT_GRAPH_CLIENT_ID,
        MICROSOFT_GRAPH_SECRET,
    ),
});


module.exports = {
    newClient,
};
