const { GraphClient, createClient } = require("../data/graph");

const { EMAIL_SENDER } = process.env;

function createRecipient(addr) {
    return {
        emailAddress: { address: addr.trim() },
    };
}

const transformTenant = ({ id: uid, displayName: name }) => ({ uid, name });

const transformUser =
    (tenantUid) =>
    ({
        id: uid,
        userPrincipalName,
        displayName,
        givenName,
        surname,
        assignedLicenses,
        assignedPlans,
    }) => ({
        uid,
        tenantUid,
        userPrincipalName,
        displayName,
        givenName,
        surname,
        assignedLicenses,
        assignedPlans,
    });

const transformSku =
    (tenantUid) =>
    ({
        id: uid,
        skuId,
        skuPartNumber,
        prepaidUnits: { enabled: unitCount },
    }) => ({
        uid,
        tenantUid,
        skuId,
        skuPartNumber,
        unitCount,
    });

function buildClientModel(tenantUid) {
    const client = createClient(tenantUid);

    return {
        uid: tenantUid,

        async getTenant() {
            const response = await client.api("/organization").get();
            return transformTenant(response.value[0]);
        },

        async getUsers() {
            const response = await client
                .api("/users")
                .select(
                    "id,userPrincipalName,displayName,givenName,surname,assignedLicenses,assignedPlans"
                )
                .get();

            return response.value.map(transformUser(tenantUid));
        },

        async getSkus() {
            const response = await client.api("/subscribedSkus").get();

            return response.value.map(transformSku(tenantUid));
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
            ({ customerId: uid, displayName }) => ({
                getClientModel: () => buildClientModel(uid),
                uid,
                displayName,
            })
        );

        return wrappedContracts;
    },
};

module.exports = {
    Graph,
};
