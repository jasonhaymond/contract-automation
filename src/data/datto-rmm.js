const fetch = require('node-fetch');

// username: public-client
// password: public
const BASIC_AUTH_HEADER = 'Basic cHVibGljLWNsaWVudDpwdWJsaWM=';

const formatFormData = data => Object.entries(data).reduce(
    (bodyStr, [key, value]) => `${bodyStr}&${key}=${encodeURIComponent(value)}`,
    ''
).slice(1);

class DattoRMMAPI {
    constructor(baseURL, token) {
        this.req = async (url, { method = 'GET', headers = {} } = {}) => {
            const res = await fetch(baseURL + url, {
                method,
                headers: { ...headers, Authorization: `Bearer ${token}` },
            });
            if (res.ok) return await res.json();
        };
    }

    async getAccount() {
        return await this.req('/v2/account');
    }

    static async create(url, key, secretKey) {
        const baseURL = url.endsWith('/') ? url.slice(0, -1) : url;
        const body = formatFormData({
            grant_type: 'password',
            username: key,
            password: secretKey,
        });

        const res = await fetch(`${baseURL}/auth/oauth/token`, {
            method: 'POST',
            headers: {
                Authorization: BASIC_AUTH_HEADER,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        });

        const json = await res.json();

        if (res.ok) {
            return new DattoRMMAPI(`${baseURL}/api`, json.access_token);
        }
        console.error(json);
    }
}

module.exports = DattoRMMAPI;
