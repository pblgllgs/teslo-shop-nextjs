import { AdminLayout, GridDataTable } from '../../components/layouts';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IProduct } from '../../interfaces/products';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Box, Button, CardMedia, Link } from '@mui/material';
import NextLink from 'next/link';
import { AddOutlined } from '@mui/icons-material';

const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a
                    href={`/product/${row.slug}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <CardMedia
                        component="img"
                        alt={row.title}
                        className="fadeIn"
                        image={row.img}
                    ></CardMedia>
                </a>
            );
        },
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 350,
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline="always">{row.title}</Link>
                </NextLink>
            );
        },
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {
    const { data, error } = useSWR<IProduct[]>('/api/admin/products');
    if (!data && !error) return <div>Loading</div>;

    const rows = data!.map((product) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));

    return (
        <AdminLayout
            title={`Productos ${data?.length}`}
            subTitle="Mantenimiento de productos"
            icon={<Inventory2OutlinedIcon />}
        >
            <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
                <Button
                startIcon={<AddOutlined />} color='secondary' href="/admin/products/new">
                    Crear Producto
                </Button>
            </Box>
            <GridDataTable columns={columns} rows={rows} />
        </AdminLayout>
    );
};

export default ProductsPage;
