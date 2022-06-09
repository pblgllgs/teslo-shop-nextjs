import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress, numberOfItems, tax, total, subTotal } = order;
  const { address, city, country, firstName, lastName, phone, zip, address2 } =
    shippingAddress;

  const orderSummary = {
    numberOfItems,
    tax,
    total,
    subTotal,
  };
  return (
    <ShopLayout
      title="Resumen de la orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: {order._id}
      </Typography>
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden ya Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}
      <Grid container className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen: {order.numberOfItems}{' '}
                {order.numberOfItems > 1 ? 'productos' : 'productos'}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  dirección de entrega
                </Typography>
              </Box>
              <Typography variant="body1">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body1">{address}</Typography>
              <Typography variant="body1">{city}</Typography>
              <Typography variant="body1">{country}</Typography>
              <Typography variant="body1">{zip}</Typography>
              <Typography variant="body1">{phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary order={orderSummary} />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <h1>Pagar</h1>
                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label="Orden ya Pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <Chip
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query as { id: string };
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
