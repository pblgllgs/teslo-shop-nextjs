import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React, { FC, useState } from 'react';

interface Props {
  initial: number;
}

export const ItemCounter: FC<Props> = ({ initial }) => {
  const [count, setCount] = useState(initial);

  const handlerAdd = () => {
    setCount(count + 1);
  };
  const handlerRemove = () => {
    setCount(count - 1);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handlerRemove} disabled={count === 0}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{count}</Typography>
      <IconButton onClick={handlerAdd}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
