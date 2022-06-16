import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { AdminLayout, GridDataTable } from '../../components/layouts';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { IOrder, IUser } from '../../interfaces';
import useSWR from 'swr';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Nombre Completo', width: 300 },
  { field: 'total', headerName: 'Monto Total', width: 100 },
  {
    field: 'isPaid',
    headerName: 'Pagado',
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
    width: 120,
  },
  { field: 'noProducts', headerName: 'N° Productos', align: 'center' },
  {
    field: 'check',
    headerName: 'VerOrden',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver Orden
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Creada en:', align: 'center', width: 220 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
  if (!data && !error) return <div>Loading</div>;

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  console.log(rows);

  return (
    <AdminLayout
      title="Ordenes"
      subTitle="Mantenimiento de ordenes"
      icon={<ConfirmationNumberOutlined />}
    >
      <GridDataTable columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default OrdersPage;
