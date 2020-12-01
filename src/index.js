require('dotenv').config();
const DattoRMMAPI = require('./data/datto-rmm');

const {
    DATTO_RMM_API_URL,
    DATTO_RMM_API_KEY,
    DATTO_RMM_API_SECRET_KEY,
} = process.env;

DattoRMMAPI.create(DATTO_RMM_API_URL, DATTO_RMM_API_KEY, DATTO_RMM_API_SECRET_KEY).then(api => {
    api.getAccount().then(acc => console.log(acc));
});
