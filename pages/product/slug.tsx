import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { initialData } from '../../database/products';
import { IProduct } from '../../interfaces';

const product = initialData.products[0];

interface Props {
  product: IProduct;
}

const ProductPage: FC<Props> = () => {
  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2" component="h1">
                Cantidad
              </Typography>
              <ItemCounter initial={1} />
              <SizeSelector
                selectedSize={product.sizes[0]}
                sizes={product.sizes}
              />
            </Box>
            <Button
              className="circular-btn"
              color="secondary"
              disabled={product.inStock === 0}
            >
              Agregar
            </Button>
            {product.inStock === 0 ? (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            ) : (
              <Chip
                label="Hay disponibles"
                color="success"
                variant="outlined"
              />
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" component="h1">
                Descripción
              </Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default ProductPage;