import { yupResolver } from '@hookform/resolvers/yup';
import {
  alpha,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import Head from 'next/head';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useCreateUser } from '@/hooks/user/useUser';

import Logo from '@/components/LogoSign';

import { userAtom } from '@/store/user';

import BaseLayout from '@/layouts/BaseLayout';
import { colors } from '@/theme/schemes/DarkSpacesTheme';
import { themeColors } from '@/theme/schemes/DarkSpacesTheme';

function Forms() {
  const createUserHook = useCreateUser();
  const [newCreatedUser, setNewCreatedUser] = useAtom(userAtom);

  const addUser = Yup.object().shape({
    // role: Yup.string().required('Required').nullable(),
    name: Yup.string().matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    ),
    // email: Yup.string().email('Invalid').required('Required'),
    password: Yup.string().matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm
    ),

    // referenceUid: Yup.string()
    //   .required('Required')
    //   .length(7)
    //   .matches(/^(SO|SA|BO|AG|SAG|CU)[a-zA-Z0-9]{5}/, 'Invalid'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUser),
  });

  const createUser = async (data) => {
    const res: any = await createUserHook.mutateAsync(data);
    if (res?.data?.id) {
      setNewCreatedUser(res);
    }
  };

  const onSubmit = (data) => createUser(data);

  console.log(errors);

  return (
    <>
      <Head>
        <title>Sign up</title>
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
                      Create account
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: 16,
                        color: alpha(themeColors.black, 0.55),
                      }}
                      variant='subtitle2'
                    >
                      Fill in the fields below to sign up for an account.
                    </Typography>
                  </>
                }
              />

              <CardContent>
                <Box component='form' noValidate autoComplete='off'>
                  <div>
                    <TextField
                      {...register('name')}
                      error={Boolean(errors.name)}
                      fullWidth
                      required
                      margin='normal'
                      label='Name'
                      helperText={
                        errors.name ? `Name is ${errors.name?.message}` : null
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      {...register('phone')}
                      // disabled={createUserHook.isLoading}
                      error={Boolean(errors.phone)}
                      name='phone'
                      margin='normal'
                      label='Phone'
                      helperText={
                        errors.phone ? (errors.phone?.message as string) : null
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      {...register('password')}
                      error={Boolean(errors.password)}
                      fullWidth
                      required
                      type='password'
                      margin='normal'
                      label='Password'
                      helperText={
                        errors.password
                          ? (errors?.password?.message as string)?.includes(
                              'must match the following'
                            )
                            ? 'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.'
                            : `Password is ${errors.password?.message}`
                          : null
                      }
                    />
                  </div>
                </Box>
                <FormControlLabel
                  control={<Checkbox {...register('tnc')} defaultChecked />}
                  label={
                    <Typography>
                      I accept the <Link>terms and conditions.</Link>
                    </Typography>
                  }
                />
                {errors.tnc && (
                  <Typography
                    style={{ fontSize: 12 }}
                    variant='subtitle2'
                    color={colors.error.main}
                  >
                    <> {errors.tnc?.message}</>
                  </Typography>
                )}

                <Button
                  fullWidth
                  sx={{ my: 2.6, p: 1.4 }}
                  variant='contained'
                  color='primary'
                  type='submit'
                  onClick={handleSubmit(onSubmit)}
                >
                  Create your account
                </Button>
                <Typography
                  sx={{ my: 1 }}
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  Already have an account?
                  <NextLink href='/auth/signin' passHref>
                    <Link> Sign in here</Link>
                  </NextLink>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

Forms.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default Forms;
