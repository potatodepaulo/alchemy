(function() {
    const ACCOUNT_ID = 'peter.alchemy'; /* TODO: fill this in! */
    const DEFAULT_ENV = 'development';
    const APP_NAME = "Alchemy";

    function getConfig(env) {
        switch (env) {
            case 'production':
            case 'development':
                return {
                    nodeUrl: 'https://studio.nearprotocol.com/devnet',
                    helperUrl: 'https://studio.nearprotocol.com/contract-api',
                    contractName: ACCOUNT_ID,
                    appName: APP_NAME
                };
            case 'local':
            case 'test':
                return {
                    nodeUrl: 'http://localhost:3030',
                    contractName: ACCOUNT_ID,
                    appName: APP_NAME
                };
            default:
                throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
        }
    }

    const cookieConfig = typeof Cookies != 'undefined' && Cookies.getJSON('fiddleConfig');
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = getConfig;
    } else {
        window.nearConfig =  cookieConfig && cookieConfig.nearPages ? cookieConfig : getConfig(DEFAULT_ENV);
    }
})();
