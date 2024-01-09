export const getJwtPayload = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedToken = JSON.parse(window.atob(base64));
    return decodedToken;
}

export const ifJwtExpired = (token) => {
    const decodedToken = getJwtPayload(token);
    const expirationTime = decodedToken.exp;
    const currentTime = Date.now() / 1000;
    console.log('expirationTime:', expirationTime);
    console.log('currentTime:', currentTime);
    return expirationTime < currentTime;
};