import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { countries } from '../../utils/countries';

const SummaryPage = () => {
  const { numberOfItems, shippingAddress } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address');
    }
  }, [router]);

  if (!shippingAddress) {
    return <></>;
  }
  const {
    firstName,
    lastName,
    address,
    address2 = '',
    zip,
    city,
    country,
    phone,
  } = shippingAddress;

  return (
    <ShopLayout
      title="Resumen de compra"
      pageDescription="Resumen de los productos"
    >
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen: {numberOfItems}{' '}
                {numberOfItems > 1 ? 'productos' : 'producto'}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography variant="body1">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body1">{address}</Typography>
              <Typography variant="body1">{city}</Typography>
              <Typography variant="body1">
                {countries.find((c) => c.code === country)?.name}
              </Typography>
              <Typography variant="body1">{zip}</Typography>
              <Typography variant="body1">{phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar pedido
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
