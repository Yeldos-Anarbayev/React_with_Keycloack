import {useState} from "react";
import Keycloak from 'keycloak-js';

import {Button, Card} from '../shared/component';
import { httpClient } from '../api/HttpClient';

const initOptions = {
    // url: 'https://keycloak.telecom.kz/realms/KT/protocol/openid-connect/token',
    // url: 'https://keycloak.telecom.kz/',
    url: 'http://10.189.131.22:8081/',
    // url: 'http://10.189.131.22:8081/realms/KT/protocol/openid-connect/token',
    realm: 'KT',
    clientId: 'invest-calc',
}

let keycloack = new Keycloak(initOptions);

keycloack.init({
    onLoad: 'login-required', //application is accessible only for authenticated user, otherwise user will be redirected to keycloack login page
    checkLoginIframe: true,
    pkceMethod: "S256"
}).then((authenticated) => {
    if (!authenticated) {
        window.location.reload();
    } else {
        /* Remove below logs if you are using this on production */
        console.info("Authenticated");
        console.log('auth', authenticated)
        console.log('Keycloak', keycloack)
        console.log('Access Token', keycloack.token)

        /* http client will use this header in every request it sends */
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloack.token}`;

        keycloack.onTokenExpired = () => {
            console.log('token expired')
        }
    }
}, () => {
    /* Notify the user if necessary */
    console.error("Authentication Failed");
});

function App() {
    const [infoMessage, setInfoMessage] = useState('');

    /* To demonstrate : http client adds the access token to the Authorization header */
    const callBackend = async () => {
        try {
            const response = await httpClient.get('/api/employee/check-roles'); // Replace with actual API endpoint
            setInfoMessage(JSON.stringify(response.data));
        } catch (error) {
            setInfoMessage('Error calling backend');
            console.error(error);
        }
    };


    return (
        <div className={'p-10 my-10 mx-[360px] border rounded-lg'}>
            <div className={'text-center text-success font-bold'}>
                <h1>React App with Keycloack</h1>
            </div>

            <div className={'flex gap-10 mt-10 justify-center'}>
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => {
                            setInfoMessage(keycloack.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE')
                        }}
                        className="bg-primary text-white"
                        btnText='Is Authenticated'
                    />

                    <Button
                        onClick={async () => {
                            try {
                                // const response = await fetch(
                                //     'https://keycloak.telecom.kz/realms/KT/protocol/openid-connect/token',
                                //     {
                                //         method: 'POST',
                                //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                //         body: new URLSearchParams({
                                //             client_id: 'invest-calc',
                                //             client_secret: 'YdYy4lzbf9fMjLSI9bKAgg8J4cUGGUSV',
                                //             grant_type: 'password',
                                //             username: 'Saduakhas.D',
                                //             password: 'QWer12!@',
                                //         }),
                                //     }
                                // );
                                const response = await fetch(
                                    'http://10.189.131.22:8081//realms/KT/protocol/openid-connect/token',
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                        body: new URLSearchParams({
                                            client_id: 'invest-calc',
                                            client_secret: 'TrgCxVUB1kfZjZdMYF4rY8I8QnU268S5',
                                            grant_type: 'password',
                                            username: 'yerman.b',
                                            password: '35ipihef',
                                        }),
                                    }
                                );

                                if (response.ok) {
                                    const data = await response.json();
                                    setInfoMessage(`Token: ${data.access_token}`);
                                    console.log('Access Token:', data.access_token);
                                    httpClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
                                } else {
                                    setInfoMessage('Login failed.');
                                    console.error('Failed to log in:', await response.text());
                                }
                            } catch (error) {
                                setInfoMessage('Error during login.');
                                console.error('Error:', error);
                            }
                        }}
                        className='bg-success text-white'
                        btnText='Login'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloack.token ? keycloack.token : 'There is no token')
                        }}
                        className="m-1 bg-success2 text-white"
                        btnText='Show Access Token'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloack.tokenParsed ? JSON.stringify(keycloack.tokenParsed) : 'No parsed token')
                        }}
                        className="m-1 bg-warning text-white"
                        btnText='Show Parsed Access token'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloack.token ? keycloack.isTokenExpired(5).toString() : 'There is no expired token')
                        }}
                        className="m-1 bg-darkWarning text-white"
                        btnText='Check Token expired'
                    />

                    <Button
                        onClick={() => {
                            keycloack.updateToken(10).then((refreshed) => {
                                setInfoMessage('Token Refreshed: ' + refreshed.toString())
                            }, (e) => {
                                setInfoMessage('Refresh Error')
                            })
                        }}
                        className="m-1 bg-danger text-white"
                        btnText='Update Token (if about to expire)'
                    /> {/** 10 seconds */}

                    <Button
                        onClick={callBackend}
                        className='m-1 bg-success text-white'
                        btnText='Send HTTP Request'
                    />

                    <Button
                        onClick={() => {
                            keycloack.logout({redirectUri: window.location.origin})
                        }}
                        className="m-1 bg-danger text-white"
                        btnText='Logout'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloack.hasRealmRole('admin').toString())
                        }}
                        className="m-1 bg-lightBlue text-white"
                        btnText='has realm role "Admin"'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloack.hasResourceRole('test').toString())
                        }}
                        className="m-1 bg-grayInputBackground"
                        btnText='has client role "test"'
                    />
                </div>

                <div>
                    <Card className={'p-10'}>
                        <span>{infoMessage}</span>
                    </Card>
                </div>
            </div>

        </div>
    );
}

export default App;
