import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { GetServerSideProps } from 'next';
import { getAllProducts, getProductsByTerm } from '../../database/dbProducts';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={'Teslo-Shop'}
      pageDescription={'Encuantra los productos aqui!!'}
    >
      <Typography variant="h1" component="h1">
        Búsqueda
      </Typography>
      {foundProducts ? (
        <Typography
          variant="h2"
          sx={{ mb: 1 }}
          component="h1"
          textTransform="capitalize"
        >
          Término: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }} component="h1">
            No se encontraron productos...
          </Typography>
          <Typography
            variant="h2"
            sx={{ ml: 1 }}
            color="secondary"
            component="h1"
            textTransform="capitalize"
          >
            {query}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string };
  if (query === '') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  let products = await getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
      //TODO: traer resutltados segun sus busquedas desde las coookies
    products = await getAllProducts();
  }
  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
