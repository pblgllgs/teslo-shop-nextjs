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
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

type FormData = {
  email: string;
  password: string;
  name: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onRegisterForm = async ({ email, password, name }: FormData) => {
    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);
    console.log(hasError, message);
    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);
    await signIn('credentials', {
      email,
      password,
    });
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
            {/* <Grid item xs={12} textAlign="center">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p}`
                    : '/auth/login'
                }
                passHref
              >
                <Link underline="always">
                  ¿Ya tienes una cuenta?,Inicia sesión aquí...
                </Link>
              </NextLink>
            </Grid> */}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req } = ctx as { req: any };
  const session = await getSession({ req });
  // const { p } = query;
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
