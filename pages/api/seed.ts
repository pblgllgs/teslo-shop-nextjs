// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../database'
import { initialData } from '../../database/products'
import { Product } from '../../models'

type Data = {
    message: string,
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({
            message: 'No tiene acceso a producción',
        })
    }
    await db.connect();
    await Product.deleteMany({});
    await Product.insertMany(initialData.products);
    await db.disconnect();
    res.status(200).json(
        {
            message: 'BD restablesida',
        }
    );
}

export default handler;