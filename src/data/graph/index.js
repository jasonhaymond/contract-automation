const { Client, newClient } = require('./client');

module.exports = {
    Client: newClient(),
    newClient,
};
