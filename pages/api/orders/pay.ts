import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IPaypal } from '../../../interfaces'
import { Order } from '../../../models'
import { getSession } from 'next-auth/react';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return payOrder(req, res)
        default:
            return res.status(400).json({ message: 'Method not allowed' })
    }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');
    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return data.access_token;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            // const error = err as AxiosError;
            console.log(err.response?.data)
        } else {
            console.log(err)
        }
        return null;
    }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const orderIdValid = req.body.orderId;
    const orderValid = await Order.findById(orderIdValid);
    if (!orderValid) {
        return res.status(404).json({ message: 'Order not found' })
    }

    const paypalBearerToken = await getPaypalBearerToken();

    if(!paypalBearerToken) {
        return res.status(500).json({ message: 'Paypal Bearer Token not found' })
    }

    const { transactionId = '', orderId = '' } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,{
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    });

    if(data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Orden no reconocida, preceso no completado' })
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);
    if(!dbOrder) {
        await db.disconnect();
        return res.status(401).json({ message: 'Orden no existe en la base de datos' })
    }

    if(dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect();
        return res.status(401).json({ message: 'Los montos de paypal y la orden no son iguales' })
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();

    return res.status(200).json({ message: `Orden pagada` })
}