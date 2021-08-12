const { GraphClient, createClient } = require("../data/graph");

const { EMAIL_SENDER } = process.env;

function createRecipient(addr) {
    return {
        emailAddress: { address: addr.trim() },
    };
}

function buildClientModel(tenantID) {
    const client = createClient(tenantID);

    return {
        async getUsers() {
            return (
                await client
                    .api("/users")
                    .select(
                        "id,userPrincipalName,displayName,givenName,surname,assignedLicenses"
                    )
                    .get()
            ).value;
        },

        async getSubscribedSkus() {
            return (await client.api("/subscribedSkus").get()).value;
        },
    };
}

const Graph = {
    async sendEmail(subject, to, body) {
        const message = {
            subject,
            toRecipients: to.map(createRecipient),
            body: {
                contentType: "html",
                content: body,
            },
        };

        await GraphClient.api(`/users/${EMAIL_SENDER}/sendMail`).post({
            message,
        });
    },

    async getContracts() {
        const rawContracts = (await GraphClient.api("/contracts").get()).value;
        const wrappedContracts = rawContracts.map((contract) => ({
            getClientModel: () => buildClientModel(contract.customerId),
            ...contract,
        }));

        return wrappedContracts;
    },
};

module.exports = {
    Graph,
};
