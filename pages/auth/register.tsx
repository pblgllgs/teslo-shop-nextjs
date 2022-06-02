import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { AuthLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { tesloApi } from '../../api';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
  email: string;
  password: string;
  name: string;
};

const RegisterPage = () => {
  const [showError, setShowError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onRegisterForm = async ({ email, password, name }: FormData) => {
    setShowError(false);
    try {
      const { data } = await tesloApi.post('/user/register', {
        email,
        password,
        name,
      });
      const { token, user } = data;
      console.log({ token, user });
    } catch (error) {
      console.log('Usuario ya existe');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }

    //TODO: mavegar a la pantalla que corresponda
  };

  return (
    <AuthLayout title={'Sign up'}>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              <Chip
                label="Error al crear cuenta, intente nuevamente"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                })}
                label="Nombre"
                variant="filled"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  validate: validations.isEmail,
                })}
                label="Correo"
                variant="filled"
                fullWidth
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                {...register('password', {
                  required: 'El password es requerido',
                  minLength: {
                    value: 6,
                    message: 'El email debe tener al menos 6 caracteres',
                  },
                })}
                label="Password"
                variant="filled"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Registro
              </Button>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <NextLink href="/auth/login" passHref>
                <Link underline="always">
                  ¿Ya tienes una cuenta?,Inicia sesión aquí...
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
