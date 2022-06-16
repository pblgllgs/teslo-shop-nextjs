import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
  const [refreshIn, setRefreshIn] = useState(30);
  const { data, error } = useSWR<DashboardSummaryResponse>(
    'api/admin/dashboard',
    {
      refreshInterval: 30 * 1000,
    }
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => refreshIn > 0 ? refreshIn - 1 : 30);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la info</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={numberOfOrders}
          subTitle="Ordenes totales"
        />

        <SummaryTile
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
          title={paidOrders}
          subTitle="Ordenes Pagadas"
        />
        <SummaryTile
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
          title={notPaidOrders}
          subTitle="Ordenes pendientes"
        />
        <SummaryTile
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          title={numberOfClients}
          subTitle="Clientes"
        />
        <SummaryTile
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
          title={numberOfProducts}
          subTitle="Productos"
        />
        <SummaryTile
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
          title={productsWithNoInventory}
          subTitle="Productos sin existencias"
        />
        <SummaryTile
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
          title={lowInventory}
          subTitle="Bajo inventario"
        />
        <SummaryTile
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={refreshIn}
          subTitle="Actualización en: "
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
