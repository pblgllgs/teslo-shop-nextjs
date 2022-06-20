import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data =
    | { message: string }
    | { product: IProduct }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res)
        default:
            return res.status(400).json({
                message: 'Error, contacte al administrador',
            })
    }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { slug } = req.query;
    try {
        await db.connect();
        const product = await Product.findOne({ slug })
            .select('slug title price images inStock -_id')
            .lean();
        await db.disconnect();
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`;
        });
        return res.status(200).json({ product });
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: 'Error al obtener el producto',
        })
    }
}