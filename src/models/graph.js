const { GraphClient } = require("../data/graph");

const { EMAIL_SENDER } = process.env;

const Graph = {
    async sendEmail(subject, to, body) {
        const message = {
            subject,
            toRecipients: [{ emailAddress: { address: to } }],
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
