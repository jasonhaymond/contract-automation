const { GraphClient, createClient } = require("../data/graph");

const { EMAIL_SENDER } = process.env;

function createRecipient(addr) {
    return {
        emailAddress: { address: addr.trim() },
    };
}

const transformTenant = ({ id: uid, displayName: name }) => ({ uid, name });

const transformUser = ({
    id: uid,
    userPrincipalName,
    displayName,
    givenName,
    surname,
}) => ({
    uid,
    userPrincipalName,
    displayName,
    givenName,
    surname,
});

const transformSku = ({ id: uid, skuId, skuPartNumber }) => ({
    uid,
    skuId,
    skuPartNumber,
});

function buildClientModel(tenantID) {
    const client = createClient(tenantID);

    return {
        async getTenant() {
            const response = await client.api("/organization").get();
            return transformTenant(response.value[0]);
        },

        async getUsers() {
            const response = await client
                .api("/users")
                .select(
                    "id,userPrincipalName,displayName,givenName,surname,assignedLicenses"
                )
                .get();

            return response.value.map(transformUser);
        },

        async getSkus() {
            const response = await client.api("/subscribedSkus").get();

            return response.value.map(transformSku);
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
        const wrappedContracts = rawContracts.map(
            ({ customerId: id, displayName }) => ({
                getClientModel: () => buildClientModel(id),
                id,
                displayName,
            })
        );

        return wrappedContracts;
    },
};

module.exports = {
    Graph,
};
