import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import Product from '../../../models/Product';
type Data =
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
        default:
            return res.status(400).json({
                message: 'Error, contacte al administrador',
            })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
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
        const updatedProducts = products.map(product => {
            product.images = product.images.map(image => {
                return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`;
            });
            return product;
        });
        res.status(200).json(updatedProducts);
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: 'Error al eliminar entrada',
        })
    }
}