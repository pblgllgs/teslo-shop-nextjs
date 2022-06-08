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
import { FC, useContext } from 'react';
import { CartContext } from '../../context';

interface Props {}

const OrderPage: FC<Props> = () => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  return (
    <ShopLayout
      title="Resumen de la orden 123123123"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: {'ASD123'}
      </Typography>
      {/* <Chip
        sx={{ my: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}
      <Chip
        sx={{ my: 2 }}
        label="Orden ya Pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen: {numberOfItems}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  {'Dirección de entrega'}
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography variant="body1">{'Juan Perez'}</Typography>
              <Typography variant="body1">{'Av. Siempre Viva 123'}</Typography>
              <Typography variant="body1">{'Santiago'}</Typography>
              <Typography variant="body1">{'Chile'}</Typography>
              <Typography variant="body1">{'+56 9 12345678'}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="Orden ya Pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
