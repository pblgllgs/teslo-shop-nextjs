import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  ClearOutlined,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { UiContext } from '../../context';
import { useContext, useState } from 'react';
import { CartContext } from '../../context/cart/CartContext';

export const Navbar = () => {
  const { numberOfItems } = useContext(CartContext);

  const { asPath, push } = useRouter();

  const { toogleSideMenu } = useContext(UiContext);

  const [searchTerm, setSearchTerm] = useState('');

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSideMenu = () => {
    toogleSideMenu();
  };

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) {
      return;
    }
    push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link color="black" display="flex" alignItems="center">
            <Typography variant="h6"> Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />
        <Box
          sx={{
            display: isSearchVisible
              ? 'none'
              : {
                  xs: 'none',
                  sm: 'block',
                },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={asPath === '/category/men' ? 'primary' : 'info'}>
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button color={asPath === '/category/women' ? 'primary' : 'info'}>
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref>
            <Link>
              <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} />

        {isSearchVisible ? (
          <Input
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
            }}
            value={searchTerm}
            className="fadeIn"
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => (e.key === 'Enter' ? onSearchTerm() : null)}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            onClick={() => setIsSearchVisible(true)}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
          >
            <SearchOutlined />
          </IconButton>
        )}

        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toogleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 10 ? '10+' : numberOfItems}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={handleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
