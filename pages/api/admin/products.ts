import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
    | { message: string }
    | IProduct
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
        case 'POST':
            return createProduct(req, res)
        case 'PUT':
            return updateProduct(req, res)
        default:
            return res.status(400).json({ message: 'Method not allowed' });
    }
}

export const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const products = await Product.find().sort({ title: 'asc' }).lean();
    await db.disconnect();
    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`;
        });
        return product;
    });
    res.status(200).json(updatedProducts)
}

export const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;
    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Invalid product id' })
    }
    if (images.length < 2) {
        return res.status(400).json({ message: 'Se necesitan al menos 2 imagenes' })
    }
    //TODO: valodar que las imagenes sean validas
    try {
        await db.connect();
        const product = await Product.findById(_id);
        if (!product) {
            await db.disconnect();
            return res.status(404).json({ message: 'Product not found' });
        }

        product.images.forEach( async(image) => {
            if(!images.includes(image)){
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                await cloudinary.uploader.destroy(fileId);
            }
        })

        await product.update(req.body);
        await db.disconnect();
        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(400).json({ message: 'Ocurrio un error al actualizar el producto' })
    }
}

export const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;
    if (images.length < 2) {
        return res.status(400).json({ message: 'Se necesitan al menos 2 imagenes' })
    }
    //TODO: localhost evitar
    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug });
        if (productInDB) {
            await db.disconnect();
            return res.status(400).json({ message: 'El producto ya existe' });
        }
        const product = new Product(req.body);
        await product.save();
        await db.disconnect();
        return res.status(201).json(product);
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(400).json({ message: 'Ocurrio un error al crear el producto' })
    }
}

