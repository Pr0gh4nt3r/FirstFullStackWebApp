export const getAccessTokenSecret = (): string => {
    // Überprüfen, ob ACCESS_TOKEN_SECRET gesetzt ist
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
    return accessTokenSecret;
}

export const getRefreshTokenSecret = (): string => {
    // Überprüfen, ob ACCESS_TOKEN_SECRET gesetzt ist
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
    return refreshTokenSecret;
}