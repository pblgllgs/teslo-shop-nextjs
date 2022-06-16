import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number,
    paidOrders: number,
    notPaidOrders: number,
    numberOfClients: number,
    numberOfProducts: number,
    productsWithNoInventory: number,
    lowInventory: number,
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            getData(req, res);
            return
    }

}

export async function getData(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    //1 forma
    // const orders = await Order.find({});
    // const numberOfOrders = orders.length;
    // const paidOrders = (orders.filter(order => order.isPaid)).length;
    // const notPaidOrders = (orders.filter(order => !order.isPaid)).length;
    // const users = await User.find({});
    // const numberOfClients = users.filter(user => user.role === 'client').length;
    // const numberOfProducts = await Product.find({}).countDocuments();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).countDocuments();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).countDocuments();

    //2 forma
    // const numberOfOrders = await Order.countDocuments();
    // const paidOrders = await Order.countDocuments({ isPaid: true });
    // const notPaidOrders = await Order.countDocuments({ isPaid: false });
    // const numberOfClients = await User.countDocuments({ role: 'client' });
    // const numberOfProducts = await Product.countDocuments();
    // const productsWithNoInventory = await Product.countDocuments({ inStock: 0 });
    // const lowInventory = await Product.countDocuments({ inStock: { $lte: 10 } });

    const [numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.find().count(),
        Order.countDocuments({ isPaid: true }),
        Order.countDocuments({ isPaid: false }),
        User.countDocuments({ role: 'client' }),
        Product.countDocuments(),
        Product.countDocuments({ inStock: 0 }),
        Product.countDocuments({ inStock: { $lte: 10 } }),
    ])

    await db.disconnect();
    return res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    });
}

