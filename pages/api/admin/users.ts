import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../models'
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { isValidObjectId } from 'mongoose';

type Data =
    | { message: string }
    | IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res)

        case 'PUT':
            return updateUser(req, res)

        default:
            res.status(200).json({ message: 'Method is not allowed' })
            break;
    }
}

export const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();
    return res.status(200).json(users);
}

export const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {userId = '', role = ''} = req.body;
    if(!isValidObjectId(userId)) {
        return res.status(400).json({message: 'UserId is not valid'});
    }
    const validRoles = ['admin', 'super-user', 'SEO','client'];
    if(!validRoles.includes(role)) {
        return res.status(401).json({message: 'Role is not valid'});
    }
    await db.connect();
    const users = await User.findById(userId);
    if(!users) {
        await db.disconnect();
        return res.status(404).json({message: 'User not found'});
    }
    users.role = role;
    await users.save();
    await db.disconnect();
    return res.status(200).json({message: 'User updated'});
}
