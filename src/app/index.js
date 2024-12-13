import {useState} from "react";

import {Button, Card} from '../shared/component';
import { httpClient } from '../api/HttpClient';
import {keycloak} from "../shared/lib";

keycloak.init({
    onLoad: 'login-required', //application is accessible only for authenticated user, otherwise user will be redirected to keycloak login page
    checkLoginIframe: false,
    pkceMethod: "S256"
}).then((authenticated) => {
    if (authenticated) {
        console.info("Authenticated");
        // setToken(keycloak.token);
        // setUsername(keycloak.tokenParsed.preferred_username);
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;

        // Настройка обновления токена
        const refreshToken = () => {
            keycloak.updateToken(30).then(refreshed => {
                if (refreshed) {
                    console.log('Token refreshed');
                    // setToken(keycloak.token);
                }
            }).catch(() => {
                console.error('Failed to refresh token');
                // setInfoMessage('Session expired, please login again');
                keycloak.logout({ redirectUri: window.location.origin });
            });
        };

        // Обновляем токен каждые 30 секунд
        const tokenRefreshInterval = setInterval(refreshToken, 30000);

        return () => clearInterval(tokenRefreshInterval);
    } else {
        console.error("Authentication Failed");
    }
}).catch((err) => {
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
                            setInfoMessage(keycloak.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE')
                        }}
                        className="bg-primary text-white"
                        btnText='Is Authenticated'
                    />

                    <Button
                        onClick={async () => {
                            if (keycloak.authenticated) {
                                const token = keycloak.token; // Use the token from Keycloak
                                httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                                setInfoMessage(`Token: ${token}`);
                                console.log('Access Token:', token);

                                // Make an API call after token is set
                                try {
                                    const response = await httpClient.get('/api/employee/check-roles');
                                    setInfoMessage(JSON.stringify(response.data));
                                } catch (error) {
                                    setInfoMessage('Error calling backend');
                                    console.error(error);
                                }
                            } else {
                                setInfoMessage('User is not authenticated.');
                            }
                        }}
                        className='bg-success text-white'
                        btnText='Login'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloak.token ? keycloak.token : 'There is no token')
                        }}
                        className="m-1 bg-success2 text-white"
                        btnText='Show Access Token'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloak.tokenParsed ? JSON.stringify(keycloak.tokenParsed) : 'No parsed token')
                        }}
                        className="m-1 bg-warning text-white"
                        btnText='Show Parsed Access token'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloak.token ? keycloak.isTokenExpired(5).toString() : 'There is no expired token')
                        }}
                        className="m-1 bg-darkWarning text-white"
                        btnText='Check Token expired'
                    />

                    <Button
                        onClick={() => {
                            keycloak.updateToken(10).then((refreshed) => {
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
                            keycloak.logout({redirectUri: window.location.origin})
                        }}
                        className="m-1 bg-danger text-white"
                        btnText='Logout'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloak.hasRealmRole('admin').toString())
                        }}
                        className="m-1 bg-lightBlue text-white"
                        btnText='has realm role "Admin"'
                    />

                    <Button
                        onClick={() => {
                            setInfoMessage(keycloak.hasResourceRole('test').toString())
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