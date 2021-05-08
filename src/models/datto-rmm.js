const transformDevice = ({
    uid,
    deviceType,
    hostname,
    description,
    intIpAddress,
    extIpAddress,
    siteUid,
}) => {
    const type = deviceType ? deviceType.category.toLowerCase() : "unknown";

    return {
        uid,
        type,
        hostname,
        description,
        intIpAddress,
        extIpAddress,
        siteUid,
    };
};

const transformSite = ({ uid, name }) => ({ uid, name });

module.exports = {
    async getSites(datto) {
        const sites = (await datto.getSites()).sites
            .filter(
                ({ onDemand, name }) => !onDemand && name !== "Deleted Devices"
            )
            .map(transformSite);

        return sites;
    },

    async getDevices(datto) {
        return (await datto.getDevices()).devices.map(transformDevice);
    },
};
