import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  alpha,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import { useLogin } from '@/hooks/menu/useMenu';

import Logo from '@/components/LogoSign';

import { themeColors } from '@/theme/schemes/DarkSpacesTheme';
import { cookies } from '@/utils/apiUtils';

function Forms() {
  const loginHook = useLogin();
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const authenticateUser = async (authData) => {
    const res = await loginHook.mutateAsync(authData);
    return res;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const authData = Object.fromEntries(formData.entries());
    try {
      const res = await authenticateUser({ ...authData, role: 'staff' });
      if (res.status === 'success' && res.user.role === 'staff') {
        router.push('/');

        cookies.set(res.accessToken.name, res.accessToken.value, {
          maxAge: res.accessToken.expiresIn,
          path: '/',
        });
        cookies.set(res.refreshToken.name, res.refreshToken.value, {
          maxAge: res.refreshToken.expiresIn,
          path: '/',
        });
      }
    } catch (error: any) {
      if (error?.response?.data?.error?.message) {
        setError(error?.response?.data?.error?.message);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Container maxWidth='md'>
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={0.5}
        >
          <Box mt={3} sx={{ m: 3 }}>
            <Box mx={2}>
              <Logo />
            </Box>
          </Box>
          <Grid xs={12}>
            <Card sx={{ minWidth: 550, p: 2 }}>
              <CardHeader
                title={
                  <>
                    <Typography variant='h2' sx={{ my: 0.5 }}>
                      Sign in
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: 16,
                        color: alpha(themeColors.black, 0.55),
                      }}
                      variant='subtitle2'
                    >
                      Fill in the fields below to sign into your account.
                    </Typography>
                  </>
                }
              />
              <CardContent>
                {error && (
                  <Typography
                    style={{
                      fontWeight: 400,
                      fontSize: 16,
                      color: themeColors.error,
                    }}
                    variant='subtitle2'
                  >
                    {error}
                  </Typography>
                )}
                <Box
                  component='form'
                  onSubmit={handleSubmit}
                  noValidate
                  autoComplete='off'
                >
                  <div>
                    <TextField
                      fullWidth
                      required
                      name='phone'
                      margin='normal'
                      label='Phone Number'
                      id='margin-normal'
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      required
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      margin='normal'
                      id='outlined-required'
                      label='Password'
                      InputProps={{
                        // <-- This is where the toggle button is added.
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  {/* <Typography
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    <Link>Lost password?</Link>
                  </Typography> */}
                  <Button
                    type='submit'
                    fullWidth
                    sx={{ my: 2.6, p: 1.4 }}
                    variant='contained'
                    color='primary'
                  >
                    Sign in
                  </Button>
                </Box>
                {/* <Typography
                  sx={{ my: 1 }}
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  Don’t have an account, yet?
                  <NextLink href='/auth/signup' passHref>
                    <Link> Sign up here </Link>
                  </NextLink>
                </Typography> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Forms;
