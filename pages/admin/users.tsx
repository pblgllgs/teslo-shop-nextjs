import { PeopleAltOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import { GridDataTable } from '../../components/layouts';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <div></div>;

  const onRolUpdated = async (userId: string, newRole: string) => {
    const previousUSers = users.map((user) => ({ ...user }));
    const updatedUSers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    setUsers(updatedUSers);
    try {
      await tesloApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      alert('no se pudo actializar el rol');
      console.log(error);
    }
  };

  const rows = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Correo',
      width: 250,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      width: 300,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: (row: GridValueGetterParams) => {
        return (
          <Select
            value={row.value}
            label="Rol"
            sx={{ width: '300px' }}
            onChange={({ target }) =>
              onRolUpdated(row.id.toString(), target.value)
            }
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="client">Cliente</MenuItem>
            <MenuItem value="super-user">Super User</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  return (
    <AdminLayout
      title="Usuarios"
      subTitle="Mantenimiento de usuarios"
      icon={<PeopleAltOutlined />}
    >
      <GridDataTable columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UsersPage;
