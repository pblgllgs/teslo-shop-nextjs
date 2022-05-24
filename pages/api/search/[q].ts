
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data =
    | { message: string }
    | { products: IProduct[] }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res)

        default:
            return res.status(400).json({
                message: 'Error, contacte al administrador',
            })
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = '' } = req.query;
    if (q.length === 0) {
        return res.status(400).json({
            message: 'Debe de especificar un query de busqueda',
        })
    }
    q = q.toString().toLowerCase();
    try {
        await db.connect();
        const products = await Product.find({ $text: { $search: q } })
            .select('-_id price images inStock slug title')
            .lean();
        await db.disconnect();
        if (!products) {
            return res.status(404).json({
                message: 'Products not found',
            })
        }
        return res.status(200).json({ products });
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: 'Error al obtener los productos',
        })
    }

}