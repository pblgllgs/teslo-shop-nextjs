import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';
import NextLink from 'next/link';
import { UiContext } from '../../context';
import { useContext } from 'react';

export const AdminNavbar = () => {
  const { toogleSideMenu } = useContext(UiContext);
  const handleSideMenu = () => {
    toogleSideMenu();
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6"> Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />

        <Button onClick={handleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
