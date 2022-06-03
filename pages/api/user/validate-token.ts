import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';
import { isValidToken } from '../../../utils/jwt';

type Data =
    | { message: string }
    | {
        token: string,
        user: {
            email: string,
            role: string,
            name: string
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return checkJWT(req, res);
        default:
            return res.status(400).json({ message: 'Method not allowed' });
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token = '' } = req.cookies;
    let userId = '';
    try {
        userId = await jwt.isValidToken(token);
    } catch (error) {
        return res.status(401).json({ message: 'JWT no es válido' });
    }
    if (!isValidToken(token)) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    await db.connect();
    const user = await User.findById(userId);
    await db.disconnect();
    if (!user) {
        return res.status(400).json({ message: 'User dont exist' });
    }
    const { _id, name, email, role } = user;
    return res.status(200).json(
        {
            token: jwt.signToken(_id, email),
            user: {
                email, role, name
            }
        }
    )
}
