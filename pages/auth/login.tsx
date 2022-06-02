import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { AuthLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { useState } from 'react';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    try {
      const { data } = await tesloApi.post('/user/login',{ email, password });
      const { token, user } = data;
      console.log({token, user});
    } catch (error) {
      console.log('error en credenciales');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }

    //TODO: mavegar a la pantalla que corresponda
  };

  return (
    <AuthLayout title={'Login'}>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              <Chip
                label="Credensiales incorrectas"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{display: showError ? 'flex' : 'none'}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
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
                Iniciar Sesión
              </Button>
            </Grid>
            <Grid item xs={12} alignContent="center" textAlign="center">
              <NextLink href="/auth/register" passHref>
                <Link underline="always">
                  No tienes una cuenta, crea una aquí...
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
