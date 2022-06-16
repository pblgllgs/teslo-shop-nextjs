import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { FC } from 'react'

interface Props {
    rows:any,
    columns:any,
}

export const GridDataTable: FC<Props> = ({ rows, columns }) => {
  return (
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
  );
};
