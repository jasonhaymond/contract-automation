const fetch = require('node-fetch');
const operations = require('./operations');

// username: public-client
// password: public
const BASIC_AUTH_HEADER = 'Basic cHVibGljLWNsaWVudDpwdWJsaWM=';

const formatFormData = data => Object.entries(data).reduce(
    (bodyStr, [key, value]) => `${bodyStr}&${key}=${encodeURIComponent(value)}`,
    ''
).slice(1);

module.exports = {
    async create(url, key, secretKey) {
        const rootURL = url.endsWith('/') ? url.slice(0, -1) : url;
        const body = formatFormData({
            grant_type: 'password',
            username: key,
            password: secretKey,
        });

        const res = await fetch(`${rootURL}/auth/oauth/token`, {
            method: 'POST',
            headers: {
                Authorization: BASIC_AUTH_HEADER,
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        });

        const resJson = await res.json();

        if (!res.ok) {
            console.error(resJson);
            throw new Error(`Datto RMM authentication failed: ${resJson}`);
        }

        const baseURL = `${rootURL}/api`,
            token = resJson.access_token;

        async function req(url, { method = 'GET', headers = {} } = {}) {
            const res = await fetch(baseURL + url, {
                method,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    ...headers,
                }
            });

            if (res.ok) return await res.json();
        }

        return { ...operations, req };
    }
};
