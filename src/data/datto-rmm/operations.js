module.exports = {
    async getAccount() {
        return await this.req('/v2/account');
    },

    async getSites(max = 250) {
        return await this.req(`/v2/account/sites?max=${max}`);
    },

    async getDevices(max = 250) {
        return await this.req(`/v2/account/devices?max=${max}`);
    }
}
