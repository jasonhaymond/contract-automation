require("isomorphic-fetch");

class MyAuthenticationProvider {
    #tenantID;
    #clientID;
    #secret;

    constructor(tenantID, clientID, secret) {
        this.#tenantID = tenantID;
        this.#clientID = clientID;
        this.#secret = secret;
    }

    async getAccessToken() {
        const oauthURI = `https://login.microsoftonline.com/${
            this.#tenantID
        }/oauth2/v2.0/token`;
        const result = await fetch(oauthURI, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "client_credentials",
                scope: "https://graph.microsoft.com/.default",
                client_id: this.#clientID,
                client_secret: this.#secret,
            }),
        });
        return (await result.json()).access_token;
    }
}

module.exports = { MyAuthenticationProvider };
