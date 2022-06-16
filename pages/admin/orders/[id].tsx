import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { IOrder } from '../../../interfaces';
import { useState } from 'react';
import { AdminLayout } from '../../../components/layouts';
import { CartList, OrderSummary } from '../../../components/cart';
import { dbOrders } from '../../../database';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress, numberOfItems, tax, total, subTotal } = order;
  const { address, city, country, firstName, lastName, phone, zip, address2 } =
    shippingAddress;

  const [isPaying, setIsPaying] = useState(false);

  const orderSummary = {
    numberOfItems,
    tax,
    total,
    subTotal,
  };

  return (
    <AdminLayout
      title="Resumen de la orden"
      subTitle={`Detalles de la orden: ${order._id}`}
      icon={<LocalMallOutlinedIcon/>}
    >
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
      <Grid container className="fadeIn">
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
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  className="fadeIn"
                  justifyContent="center"
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>
                <Box
                  flexDirection="column"
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                >
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
                      label="Orden no Pagada"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query as { id: string };
  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
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
