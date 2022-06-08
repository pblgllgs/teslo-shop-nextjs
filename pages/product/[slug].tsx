import { useState, useContext } from 'react';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  getProductsBySlug,
  getAllProductsSlugs,
} from '../../database/dbProducts';
import { CartContext } from '../../context';
import { useRouter } from 'next/router';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductsToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity,
    }));
  };

  const addToCart = () => {
    if (!tempCartProduct.size === undefined) {
      return;
    }
    addProductsToCart(tempCartProduct);
    // router.push('/cart');
  };

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
              <Typography variant="h6">
                Stock: {product.inStock}
                {product.inStock === 0 ? ' productos' : ''}
              </Typography>
              {product.inStock === 0 ? (
                <Typography>No hay productos...</Typography>
              ) : (
                <ItemCounter
                  currentValue={tempCartProduct.quantity}
                  updateQuantity={(count) => onUpdateQuantity(count)}
                  maxValue={product.inStock}
                />
              )}
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={(size) => selectedSize(size)}
              />
            </Box>
            <Button
              className="circular-btn"
              color="secondary"
              disabled={
                product.inStock === 0 || tempCartProduct.size === undefined
              }
              onClick={addToCart}
            >
              {tempCartProduct.size
                ? 'Agregar al carrito'
                : 'Seleccione un talla'}
            </Button>
            {product.inStock > 0 ? (
              <Chip
                label={`En stock ${
                  product.inStock < 10 ? ', pocas unidades' : ''
                } `}
                color={`${product.inStock >= 10 ? 'success' : 'warning'}`}
                variant="outlined"
              />
            ) : (
              <Chip
                label="No hay disponibles"
                color="error"
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

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await getAllProductsSlugs();
  const slugNames: string[] = slugs.map((slug) => slug.slug);

  return {
    paths: slugNames.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };
  const product = await getProductsBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default ProductPage;