import { Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

interface Props {
  order?: {
    numberOfItems: number,
    subTotal: number,
    tax : number,
    total : number
  };
}

export const OrderSummary:FC<Props> = ({order}) => {

  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  const orderValues = order ? order : {numberOfItems, subTotal, tax, total};

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {orderValues.numberOfItems}
          {orderValues.numberOfItems > 1 ? ' productos' : ' producto'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Sub Total</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(orderValues.subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(orderValues.tax)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1">Total a pagar</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{currency.format(orderValues.total)}</Typography>
      </Grid>
    </Grid>
  );
};
