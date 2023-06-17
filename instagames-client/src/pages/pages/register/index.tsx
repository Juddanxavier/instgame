// ** React Imports
import { useState, MouseEvent, ReactNode, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { keyframes, styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import * as Yup from 'yup'
import { useAtom } from 'jotai'
import { userAtom } from '@/@core/store/user'
import { RegisterParams } from '@/@core/hooks/auth/register/useRegister.types'
import { useRouter } from 'next/router'
import { useWindowSize } from '@/@core/hooks/displaySize'
import { ThumbUp } from '@mui/icons-material'
import { useRegister } from '@/@core/hooks/auth/register/useRegister'
import { useUpdateUserBank } from '@/@core/hooks/user/useUser'
import Head from 'next/head'
import Avatar from '@mui/material/Avatar'

interface State {
  password: string
  showPassword: boolean
}

interface CardSlider extends CardProps {
  width: number
  active: boolean
  position: string
}

interface CardStatus {
  status: boolean
  position: string
}

interface CardList {
  register: CardStatus
  address: CardStatus
  success: CardStatus
}

const slidInRL = (width: number) => keyframes`
0% {
  transform: translateX(${width}px);
  opacity: 0;
}
100% {
  transform: translateX(0);
  opacity: 1;
}
`
const slidOutRL = (width: number) => keyframes`
0% {
  transform: translateX(0);
  opacity: 1;
}
100% {
  transform: translateX(-${width}px);
  opacity: 0;
}
`

const slidInLR = (width: number) => keyframes`
0% {
  transform: translateX(-${width}px);
  opacity: 0;
}
100% {
  transform: translateX(0);
  opacity: 1;
}
`
const slidOutLR = (width: number) => keyframes`
0% {
  transform: translateX(0);
  opacity: 1;
}
100% {
  transform: translateX(${width}px);
  opacity: 0;
}
`

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const CardSlider = styled(MuiCard)<CardSlider>(({ theme, width = 0, active, position }) => ({
  // [theme.breakpoints.up('sm')]: { width: '28rem', transform: `translateX(-{width * 0.7}px)` }
  [theme.breakpoints.up('xs')]: {
    // width: active ? width : '0rem',

    animation: active
      ? position === 'R'
        ? `${slidInRL(width * 0.7)} 0.6s both`
        : `${slidInLR(width * 0.7)} 0.6s both`
      : position === 'R'
      ? `${slidOutRL(width * 0.7)} 0.6s both`
      : `${slidOutLR(width * 0.7)} 0.6s both`
  }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const SuccessIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  minWidth: '80px',
  minHeight: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  color: theme.palette.common.white
}))

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const [width, height] = useWindowSize()
  const [currCard, setCurrCard] = useState<string>('register')
  const [list, setList] = useState<CardList>({
    register: { status: true, position: 'R' },
    address: { status: false, position: 'R' },
    success: { status: false, position: 'R' }
  })

  const registerUserHook = useRegister()
  const updateUserBankHook = useUpdateUserBank()
  const [newCreatedUser, setNewCreatedUser] = useAtom(userAtom)

  const createUserValidation = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    phone: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    password: Yup.string().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm),
    tnc: Yup.bool().oneOf([true], 'Please accept the terms and conditions')
  })

  const addBankValidation = Yup.object().shape({
    bankName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    accNo: Yup.string().required('Required'),
    ifsc: Yup.string().required('Required'),
    registeredName: Yup.string().required('Required')
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createUserValidation)
  })

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 }
  } = useForm({
    resolver: yupResolver(addBankValidation)
  })

  const createUser = async (data: RegisterParams) => {
    const res: any = await registerUserHook.mutateAsync(data)
    if (res?.status === 'success') {
      setNewCreatedUser(res?.user)
      next()
    }
  }

  const addBank = async (user: any, data: any) => {
    const res: any = await updateUserBankHook.mutateAsync({ user, data })
    if (res?.status === 'success') {
      next()
      // setTimeout(() => {
      //   router.push('/pages/login')
      // }, 5000)
    }
  }

  const onSubmitRegister = (data: any) => createUser(data)
  const onSubmitBank = (data: any) => addBank(newCreatedUser?._id, data)

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const next = () => {
    const curIndex = Object.keys(list).findIndex(comp => comp === currCard)
    if (curIndex >= 0 && curIndex < 3) {
      setList(prev => ({
        ...prev,
        [Object.keys(list)[curIndex]]: { status: false, position: 'L' },
        [Object.keys(list)[curIndex + 1]]: { status: true, position: 'R' }
      }))
      setCurrCard(Object.keys(list)[curIndex + 1])
    }
  }

  const names = ['Satyam', 'Kunal', 'Aashish', 'Shyam', 'Vikram', 'David', 'Peter', 'Ricky Martin', 'Julia', 'Sofia'];
  const [randomName, setRandomName] = useState(getRandomName());

  const getRandomName = () => {
      const randomIndex = Math.floor(Math.random() * names.length);
      const name = names[randomIndex];
      setRandomName(name);
  };

  return (
    <Box>
      <Head>
        <title>Instagames | Signup</title>
      </Head>
      <Box className='content-center'>
        {list.register.status && (
          <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
              <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              </Box>
              <Box
                sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Please Enter registration details
                </Typography>
                <Typography variant='body2'>Make your app management easy and fun!</Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmitRegister)}>
                <TextField
                  {...register('name')}
                  error={Boolean(errors.name)}
                  helperText={errors.name ? `Name is ${errors.name?.message}` : null}
                  autoFocus
                  fullWidth
                  id='name'
                  name='name'
                  label='Name'
                  sx={{ marginBottom: 4 }}
                />
                <TextField
                  fullWidth
                  {...register('phone')}
                  error={Boolean(errors.phone)}
                  type='phone'
                  label='Phone'
                  name='phone'
                  sx={{ marginBottom: 4 }}
                  helperText={errors.phone ? (errors.phone?.message as string) : null}
                />
                <TextField
                  fullWidth
                  {...register('password')}
                  error={Boolean(errors.password)}
                  label='Password'
                  name='password'
                  sx={{ marginBottom: 4 }}
                  type={values.showPassword ? 'text' : 'password'}
                  helperText={
                    errors.password
                      ? (errors?.password?.message as string)?.includes('must match the following')
                        ? 'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.'
                        : `Password is ${errors.password?.message}`
                      : null
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                {/* <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Fragment>
                      <span>I agree to </span>
                      <Link href='/' passHref>
                        <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                          privacy policy & terms
                        </LinkStyled>
                      </Link>
                    </Fragment>
                  }
                /> */}
                <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7 }}>
                  Sign up
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    Already have an account?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/pages/login'>
                      <LinkStyled>Sign in instead</LinkStyled>
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
        )}
        {list.address.status && (
          <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
              <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              </Box>
              <Box
                sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Please add you bank details
                </Typography>
                <Typography variant='body2'>Make your app management easy and fun!</Typography>
              </Box>

              <form noValidate autoComplete='off' onSubmit={handleSubmit2(onSubmitBank)}>
                <TextField
                  {...register2('bankName')}
                  error={Boolean(errors2.bankName)}
                  helperText={errors2.bankName ? `Name is ${errors2.bankName?.message}` : null}
                  autoFocus
                  fullWidth
                  id='bankName'
                  name='bankName'
                  label='Bank Name'
                  sx={{ marginBottom: 4 }}
                />
                <TextField
                  fullWidth
                  {...register2('accNo')}
                  error={Boolean(errors2.accNo)}
                  type='accNo'
                  label='Account Number'
                  name='accNo'
                  sx={{ marginBottom: 4 }}
                  helperText={errors2.accNo ? (errors2.accNo?.message as string) : null}
                />
                <TextField
                  fullWidth
                  {...register2('ifsc')}
                  error={Boolean(errors2.ifsc)}
                  type='ifsc'
                  label='IFSC code'
                  name='ifsc'
                  sx={{ marginBottom: 4 }}
                  helperText={errors2.ifsc ? (errors2.ifsc?.message as string) : null}
                />

                <TextField
                  fullWidth
                  {...register2('registeredName')}
                  error={Boolean(errors2.registeredName)}
                  type='registeredName'
                  label='Registered Name'
                  name='registeredName'
                  sx={{ marginBottom: 4 }}
                  helperText={errors2.registeredName ? (errors2.registeredName?.message as string) : null}
                />
                <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7 }}>
                  Add Bank
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {list.success.status && (
          <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              </Box>
              <Box
                sx={{
                  mb: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography sx={{ mb: 2 }}>
                  Please Contact <b>{randomName}</b>
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  7259345477
                </Typography>
              </Box>
              <Box
                sx={{
                  mb: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Congratulations
                </Typography>
                <Typography variant='body2'>Account Created Successfully</Typography>
                <SuccessIcon sx={{ marginTop: 6, marginBottom: 3 }}>
                  <Avatar alt='SM' sx={{ width: 90, height: 90 }} src='/images/logo.svg' />
                </SuccessIcon>

                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Welcome to Insta Game
                </Typography>
                <Box height={20}></Box>
                <Button sx={{ width: '75%' }} fullWidth variant='contained'>
                  Sign in
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
      {/* <FooterIllustrationsV1 /> */}
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
