module.exports = {
    async getAccount() {
        return await this.req('/v2/account');
    }
}
