import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://10.189.131.22:8081',
    realm: 'KT',
    clientId: 'invest-calc',
});

export {keycloak};