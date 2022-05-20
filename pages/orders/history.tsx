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

interface Props {}

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
    width: 100,
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
        <NextLink href={`/orders/${params.row.orden}`} passHref>
          <Link underline="always">
            <Typography>Ver detalle</Typography>
          </Link>
        </NextLink>
      );
    },
  },
];

const rows: GridRowsProp = [
  { id: 1, paid: false, fullname: 'Pablo', orden: '1' },
  { id: 2, paid: true, fullname: 'Pablo 2', orden: '2' },
  { id: 3, paid: false, fullname: 'Pablo 3', orden: '3' },
  { id: 4, paid: true, fullname: 'Pablo 4', orden: '4' },
  { id: 5, paid: true, fullname: 'Pablo 5', orden: '5' },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes del cliente
      </Typography>
      <Grid container>
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

export default HistoryPage;
