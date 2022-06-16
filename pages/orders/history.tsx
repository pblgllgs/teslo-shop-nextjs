import { Chip, Grid, Link, Typography } from '@mui/material';
import React from 'react';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { IOrder } from '../../interfaces';
import { getSession } from 'next-auth/react';
import { getOrdersByUSer } from '../../database/dbOrders';

interface Props {
  orders: IOrder[];
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    editable: false,
    align: 'center',
  },
  {
    field: 'fullname',
    headerName: 'Nombre Completo',
    width: 300,
    editable: false,
    align: 'center',
  },
  {
    field: 'paid',
    headerName: 'Pagado',
    description: 'Muestra información si la orden esta pagada o no',
    width: 200,
    editable: false,
    align: 'center',
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip
          color="success"
          label="Pagada"
          variant="outlined"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          color="error"
          label="No pagada"
          variant="outlined"
          icon={<CreditCardOffOutlined />}
        />
      );
    },
  },
  {
    field: 'orden',
    headerName: 'Orden',
    width: 100,
    sortable: false,
    editable: false,
    align: 'center',
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline="always">
            <Typography>Ver detalle</Typography>
          </Link>
        </NextLink>
      );
    },
  },
];

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => {
    return {
      id: index + 1,
      fullname:
        order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
      paid: order.isPaid,
      orderId: order._id,
    };
  });

  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes del cliente
      </Typography>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  const orders = await getOrdersByUSer(session.user._id);
  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
