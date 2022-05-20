import { Grid, Typography } from "@mui/material"

export const OrderSummary = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>3 items</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Sub Total</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{`${105}`}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{`${57}`}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1">Total a pagar</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{`${1255}`}</Typography>
      </Grid>
    </Grid>
  );
}
