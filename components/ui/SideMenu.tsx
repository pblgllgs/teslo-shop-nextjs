import { useContext, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from '@mui/icons-material';
import { AuthContext, UiContext } from '../../context';
import { useRouter } from 'next/router';
import { PersonalPanel,AdminPanel } from './';

export const SideMenu = () => {
  const { isLoggedIn, user, logoutUser } = useContext(AuthContext);
  const router = useRouter();

  const { isMenuOpen, toogleSideMenu } = useContext(UiContext);

  const [searchTerm, setSearchTerm] = useState('');

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) {
      return;
    }
    navigateTo(`/search/${searchTerm}`);
  };

  const navigateTo = (url: string) => {
    toogleSideMenu();
    router.push(url);
  };

  const onLogout = () => {
    toogleSideMenu();
    logoutUser();
    router.replace('/');
    navigateTo('/');
  };

  return (
    <Drawer
      open={isMenuOpen}
      onClose={toogleSideMenu}
      anchor="right"
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => (e.key === 'Enter' ? onSearchTerm() : null)}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {isLoggedIn && <PersonalPanel />}

          <ListItem
            onClick={() => navigateTo('/category/men')}
            button
            sx={{ display: { xs: '', sm: 'none' } }}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItem>

          <ListItem
            onClick={() => navigateTo('/category/women')}
            button
            sx={{ display: { xs: '', sm: 'none' } }}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItem>

          <ListItem
            onClick={() => navigateTo('/category/kid')}
            button
            sx={{ display: { xs: '', sm: 'none' } }}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItem>

          {isLoggedIn ? (
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={'Salir'} />
            </ListItem>
          ) : (
            <ListItem button onClick={() => navigateTo(`/auth/login?destination=${router.asPath}`)}>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={'Ingresar'} />
            </ListItem>
          )}

          {user?.role === 'admin' && <AdminPanel />}
        </List>
      </Box>
    </Drawer>
  );
};
