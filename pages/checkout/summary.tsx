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
import { useContext } from 'react';
import { CartContext } from '../../context';

const SummaryPage = () => {
  const {numberOfItems,subTotal,tax,total} = useContext(CartContext);
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
