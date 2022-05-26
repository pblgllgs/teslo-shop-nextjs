import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { IProduct } from '../../interfaces';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { GetServerSideProps } from 'next';
import {
  getProductsBySlug,
  getAllProductsSlugs,
} from '../../database/dbProducts';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
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

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = '' } = params as { slug: string };
//   const product = await getProductsBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/404',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

export default ProductPage;
