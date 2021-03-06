import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data =
    | { message: string }
    |  IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
        default:
            res.status(404).json({ message: 'Bad request' })
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const productsIds = orderItems.map(p => p._id);
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });
    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;
            if (!currentPrice) {
                throw new Error('Error en los datos del carrito');
            }

            return (currentPrice * current.quantity) + prev
        }, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (1 + taxRate);
        if (total  !== backendTotal) {
            throw new Error('el total no cuandra con el monto');
        }
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round(newOrder.total * 100) / 100;
        await newOrder.save();
        return res.status(201).json(newOrder);

        // return res.status(201).json({ message: Math.round(total * 10) / 10 + ' ' + backendTotal });
    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: error.message || 'Revise los logs del servidor' });
    }

}
