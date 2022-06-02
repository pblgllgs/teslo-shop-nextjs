import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';
import { IUser } from '../../../interfaces/user';

type Data =
    | { message: string }
    | { token: string, user: { email: string, role: string, name: string } }
    | { users: IUser[] }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return registerUser(req, res);
        default:
            return res.status(400).json({ message: 'Method not allowed' });
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (name.length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }
    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    });
    try {
        await newUser.save({ validateBeforeSave: true });
        await db.disconnect();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Revisar logs, internat server error' });
    }
    const { role, _id } = newUser;
    const token = jwt.signToken(_id, email);
    return res.status(200).json({
        token,
        user: {
            email,
            role,
            name
        }
    });
}