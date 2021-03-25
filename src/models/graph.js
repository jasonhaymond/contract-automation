const { Client } = require('../data/graph');

const { EMAIL_SENDER } = process.env;

const Graph = {
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
            await Client.api(`/users/${EMAIL_SENDER}/sendMail`).post({ message });
        } catch (err) {
            console.error(err);
        }
    },
};

module.exports = {
    Graph,
};
