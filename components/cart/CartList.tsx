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
import { ICartProduct } from '../../interfaces';



interface Props {
  editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {

  const { cart,removeCartProduct } = useContext(CartContext);

  const handleRemoveProduct = (product: ICartProduct) => {
    removeCartProduct(product);
  };

  return (
    <>
      {cart.map((product) => (
        <Grid container key={product.slug} spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.image}`}
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
              <Typography variant="body1">Cantidad: {product.quantity}</Typography>
              {/* {editable ? (
                <>
                </>
              ) : (
                <Typography variant="h5">{cart.length} productos</Typography>
              )} */}
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
            <Button
              variant="text"
              color="secondary"
              disabled={!editable}
              onClick={() => handleRemoveProduct(product)}
            >
              Remover
            </Button>
          </Grid>
        </Grid>
      ))}
    </>
  );
};
