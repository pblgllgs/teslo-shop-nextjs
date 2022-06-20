import { FC, useContext } from 'react';
import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext);

  const handleRemoveProduct = (product: ICartProduct) => {
    removeCartProduct(product);
  };

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  const productsToShow = products ? products : cart;

  return (
    <>
      {productsToShow.length > 0 ? (
        productsToShow.map((product) => (
          <Grid
            container
            key={product.slug + product.size}
            spacing={2}
            sx={{ mb: 1 }}
          >
            <Grid item xs={3}>
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={product.image}
                      component="img"
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={7}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body1">{product.title}</Typography>
                <Typography variant="body1">Talla: {product.size}</Typography>
                {editable ? (
                  <ItemCounter
                    currentValue={product.quantity}
                    maxValue={10}
                    updateQuantity={(value) =>
                      onNewCartQuantityValue(product as ICartProduct, value)
                    }
                  />
                ) : (
                  <Typography variant="h5">
                    {product.quantity}
                    {product.quantity > 1 ? ' productos' : ' producto'}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="subtitle1">${product.price}</Typography>
              {editable && (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => handleRemoveProduct(product as ICartProduct)}
                >
                  Remover
                </Button>
              )}
            </Grid>
          </Grid>
        ))
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 200px)"
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <ShoppingCartOutlinedIcon fontSize="large" />

          <Typography marginLeft={2}>
            No hay productos en el carrito...
          </Typography>
        </Box>
      )}
    </>
  );
};
