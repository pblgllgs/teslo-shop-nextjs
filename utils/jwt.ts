import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('JWT_SECRET_SEED is not defined - set it in .env');
    }
    return jwt.sign({
        _id,
        email
    }, process.env.JWT_SECRET_SEED, { expiresIn: '30d', });
}

export const renewToken = (token: string) => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('JWT_SECRET_SEED is not defined - set it in .env');
    }
    return jwt.sign({
        _id: token
    }, process.env.JWT_SECRET_SEED, { expiresIn: '30d', });
}

export const isValidToken = (token: string): Promise<string> => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('JWT_SECRET is not defined');
    }
    if(token.length < 10) return Promise.reject('Token is not valid');
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) {
                    reject('JWT no es válido');
                }
                const { _id } = payload as { _id: string };
                resolve(_id);
            });
        } catch (error) {
            reject('JWT no es válido');
        }
    }
    );
}