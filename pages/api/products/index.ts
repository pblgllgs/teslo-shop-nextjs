import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import Product from '../../../models/Product';
type Data =
    | { message: string }
    | { products: IProduct[] }
    | { product: IProduct }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getproducts(req, res)
        default:
            return res.status(400).json({
                message: 'Error, contacte al administrador',
            })
    }
}

const getproducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { gender = 'all' } = req.query;
    let condition = {};
    if (gender !== 'all' && SHOP_CONTANTS.validGenders.includes(`${gender}`)) {
        condition = { gender }
    }
    try {
        await db.connect();
        const products = await Product.find(condition)
            .select('slug title price images inStock -_id')
            .lean();
        await db.disconnect();
        res.status(200).json({ products });
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: 'Error al eliminar entrada',
        })
    }
}