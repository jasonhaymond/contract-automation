require('isomorphic-fetch');
const { Client } = require('@microsoft/microsoft-graph-client');

const {
    MICROSOFT_GRAPH_CLIENT_ID,
    MICROSOFT_GRAPH_TENANT_ID,
    MICROSOFT_GRAPH_SECRET,
    EMAIL_SENDER,
} = process.env;

class MyAuthenticationProvider {
    #tenantID
    #clientID
    #secret

    constructor(tenantID, clientID, secret) {
        this.#tenantID = tenantID;
        this.#clientID = clientID;
        this.#secret = secret;
    }

    async getAccessToken() {
        const oauthURI = `https://login.microsoftonline.com/${this.#tenantID}/oauth2/v2.0/token`;
        const result = await fetch(oauthURI, {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                scope: 'https://graph.microsoft.com/.default',
                client_id: this.#clientID,
                client_secret: this.#secret,
            }),
        });
        return (await result.json()).access_token;
    }
}

class GraphClient {
    #client;

    constructor() {
        this.#client = Client.initWithMiddleware({
            authProvider: new MyAuthenticationProvider(
                MICROSOFT_GRAPH_TENANT_ID,
                MICROSOFT_GRAPH_CLIENT_ID,
                MICROSOFT_GRAPH_SECRET,
            ),
        });
    }

    async sendEmail(subject, to, body) {
        const message = {
            subject,
            toRecipients: [ { emailAddress: { address: to } } ],
            body: {
                contentType: 'html',
                content: body,
            },
        };
        try {
            await this.#client.api(`/users/${EMAIL_SENDER}/sendMail`).post({ message });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = { GraphClient };
