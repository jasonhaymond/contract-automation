const { GraphClient } = require("../data/graph");

const { EMAIL_SENDER } = process.env;

const createRecipient = (addr) => ({
    emailAddress: { address: addr.trim() },
});

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
};

module.exports = {
    Graph,
};
