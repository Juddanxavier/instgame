// ** React Imports
import { FormEvent, MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useLogin } from '@/@core/hooks/auth/login/useLogin'
import { cookies } from '../../../utils/apiUtils'
import Head from 'next/head'
import Grid from '@mui/material/Grid'

interface State {
  password: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })
  const [error, setError] = useState('')

  const loginHook = useLogin()
  const router = useRouter()

  const authenticateUser = async (authData: { [k: string]: FormDataEntryValue }) => {
    const res = await loginHook.mutateAsync(authData)

    if (res?.status === 'success') {
      cookies.set(res.accessToken.name, res.accessToken.value, {
        maxAge: res.accessToken.expiresIn,
        path: '/'
      })
      cookies.set(res.refreshToken.name, res.refreshToken.value, {
        maxAge: res.refreshToken.expiresIn,
        path: '/'
      })
      router.push('/')
    }
    return res
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const formData = new FormData(target)
    const authData = Object.fromEntries(formData.entries())
    try {
      const res = await authenticateUser(authData)
    } catch (error: any) {
      if (error?.response?.data?.error?.message) {
        setError(error?.response?.data?.error?.message)
      }
    }
  }

  // ** Hook
  const theme = useTheme()

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Box className='content-center'>
      <Head>
        <title>Instagames | Signin</title>
      </Head>
      <Grid container xs={12}>
        <Grid
          item
          xs={0}
          sm={3}
          justifyContent='center'
          alignItems={'center'}
          sx={{
            visibility: {
              xs: 'hidden',
              md: 'visible'
            },
            display: {
              xs: 'none',
              md: 'flex'
            }
          }}
        >
          {/* <img height={'150px'} src='/images/logo.svg' /> */}
        </Grid>
        <Grid item xs={12} sm={6} justifyContent='center' alignItems={'center'} display='flex'>
          <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
              <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img height={100} alt='logo' src='/images/logo.png' />
                <Typography
                  variant='h6'
                  sx={{
                    ml: 3,
                    lineHeight: 1,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '1.5rem !important'
                  }}
                >
                  {/* {themeConfig.templateName} */}
                </Typography>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Welcome to {themeConfig.templateName}!
                </Typography>
                <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
              </Box>
              {error && (
                <Typography mb={4} variant='body2' color={theme.palette.error.main}>
                  {error}
                </Typography>
              )}
              <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                <TextField
                  autoFocus
                  fullWidth
                  id='phone'
                  name='phone'
                  label='Phone'
                  defaultValue=''
                  sx={{ marginBottom: 4 }}
                />
                <FormControl fullWidth>
                  <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
                  <OutlinedInput
                    defaultValue=''
                    label='Password'
                    name='password'
                    id='auth-login-password'
                    type={values.showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {/* <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link>
            </Box> */}
                <Button fullWidth size='large' type='submit' variant='contained' sx={{ my: 7 }}>
                  Login
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    New on our platform?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/pages/register'>
                      <LinkStyled>Create an account</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
                {/* <Divider sx={{ my: 5 }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Github
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                  />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box> */}
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={0}
          sm={3}
          sx={{
            visibility: {
              xs: 'hidden',
              md: 'visible'
            },
            display: {
              xs: 'none',
              md: 'flex'
            }
          }}
        ></Grid>
      </Grid>

      {/* <FooterIllustrationsV1 /> */}
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
