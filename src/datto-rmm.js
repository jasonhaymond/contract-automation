const DattoRMMAPI = require('./data/datto-rmm');

const {
    DATTO_RMM_API_URL,
    DATTO_RMM_API_KEY,
    DATTO_RMM_API_SECRET_KEY,
} = process.env;

const getDeviceCountByType = (devices, type) => devices.filter(device => device.deviceType.category == type).length;

module.exports = async function() {
    const datto = await DattoRMMAPI.create(DATTO_RMM_API_URL, DATTO_RMM_API_KEY, DATTO_RMM_API_SECRET_KEY);
    const sites = (await datto.getSites()).sites.filter(site => !site.onDemand && site.name != 'Deleted Devices');
    const devices = (await datto.getDevices()).devices;
    const report = sites.map(site => {
        const siteDevices = devices.filter(device => device.siteUid == site.uid);

        return {
            name: site.name,
            deviceCounts: {
                desktops: getDeviceCountByType(siteDevices, 'Desktop'),
                laptops: getDeviceCountByType(siteDevices, 'Laptop'),
                servers: getDeviceCountByType(siteDevices, 'Server'),
                total: site.devicesStatus.numberOfDevices,
            }
        };
    });

    console.log(report);
}
