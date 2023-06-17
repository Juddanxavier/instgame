// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { useAtom } from 'jotai'
import { gameAtom } from '@/@core/store/game'
import { bankAtom, contactAtom, userAtom } from '@/@core/store/user'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useGetMyUser, useUpdateBank, useUpdateContact, useUpdateUser } from '@/@core/hooks/user/useUser'
import _ from 'lodash'
import { Dialog, DialogContent, DialogActions } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

const TabAccount = () => {
  // ** State
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [game, setGame] = useAtom(gameAtom)
  const [user, setUser] = useAtom(userAtom)
  const [contact, setContact] = useAtom(contactAtom)
  const [bank, setBank] = useAtom(bankAtom)
  const [saveButton, setSaveButton] = useState<boolean>(false)
  const [updatedKeys, setUpdatedKeys] = useState<any>()
  const [openRequestSuccessful, setOpenRequestSuccessful] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const UserDataValidation = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    contactValue: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    registeredName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    accNo: Yup.string().min(8, 'Too Short!').max(50, 'Too Long!').required('Required'),
    bankName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    ifsc: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    password: Yup.string().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm)
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, dirtyFields }
  } = useForm({
    resolver: yupResolver(UserDataValidation),
    defaultValues: {
      contactValue: contact?.contactValue,
      registeredName: bank?.registeredName,
      name: user?.name,
      accNo: bank?.accNo,
      bankName: bank?.bankName,
      ifsc: bank?.ifsc,
      password: ''
    }
  })

  const getMyUserHook = useGetMyUser()
  const updateUser = useUpdateUser()
  const updateBank = useUpdateBank()
  const updateContact = useUpdateContact()

  const onSubmit = async (data: any) => {
    try {
      if (updatedKeys?.user) {
        const dataToUpdate = _.pick(data, Object.keys(updatedKeys?.user))
        if (dataToUpdate) {
          const res: any = await updateUser?.mutateAsync({ data: dataToUpdate })
          if (res?.status === 'success') {
            setUser(res?.user)
          }
        }
      }
      if (updatedKeys?.bank) {
        const dataToUpdate = _.pick(data, Object.keys(updatedKeys?.bank))
        if (dataToUpdate) {
          const res: any = await updateBank?.mutateAsync({ data: dataToUpdate })
          if (res?.status === 'success') {
            setBank(res?.bank)
          }
        }
      }
      if (updatedKeys?.contact) {
        const dataToUpdate = _.pick(data, Object.keys(updatedKeys?.contact))
        if (dataToUpdate) {
          const res: any = await updateContact?.mutateAsync({ data: dataToUpdate })
          if (res?.status === 'success') {
            setContact(res?.contact)
          }
        }
      }
      if (data?.password) {
        const res: any = await updateUser?.mutateAsync({ data: { password: data?.password } })
        if (res?.status === 'success') {
          setContact(res?.contact)
        }
      }
      setOpenRequestSuccessful(true)
      setSaveButton(false)
    } catch (error) {}
  }

  const getMyUserData = async () => {
    const res: any = await getMyUserHook.mutateAsync()
    if (res?.status === 'success') {
      setUser(res?.userData?.user)
      setBank(res?.userData?.bank)
      setContact(res?.userData?.contact)
      setValue('contactValue', res?.userData?.contact?.contactValue)
      setValue('registeredName', res?.userData?.bank?.registeredName)
      setValue('name', res?.userData?.user?.name)
      setValue('accNo', res?.userData?.bank?.accNo)
      setValue('bankName', res?.userData?.bank?.bankName)
      setValue('ifsc', res?.userData?.bank?.ifsc)
    }
  }

  useEffect(() => {
    getMyUserData()
  }, [])

  const handleCloseBetSuccessful = () => {
    Promise.all([setOpenRequestSuccessful(false)])
  }

  return (
    <CardContent>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          if (isDirty) {
            const userChanges = _.pick(user, Object.keys(dirtyFields))
            const contactChanges = _.pick(contact, Object.keys(dirtyFields))
            const bankChanges = _.pick(bank, Object.keys(dirtyFields))

            var result = _({ user: userChanges, contact: contactChanges, bank: bankChanges })
              .omitBy(_.isEmpty)
              .omitBy(_.isNull)
              .value()

            setUpdatedKeys(result)

            setSaveButton(true)
          }
        }}
      >
        <Grid container spacing={7} sx={{ py: 10 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('contactValue')}
              fullWidth
              label='Phone'
              type='text'
              defaultValue={contact?.contactValue}
              InputLabelProps={{
                shrink: true
              }}
              error={Boolean(errors?.contactValue)}
              helperText={errors.contactValue ? (errors.contactValue?.message as string) : null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('registeredName')}
              fullWidth
              type='text'
              label='Bank Account Name'
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={contact?.contactValue}
              error={Boolean(errors?.contactValue)}
              helperText={errors.registeredName ? (errors.registeredName?.message as string) : null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('name')}
              fullWidth
              type='text'
              label='Name'
              defaultValue={user?.name}
              InputLabelProps={{
                shrink: true
              }}
              error={Boolean(errors?.name)}
              helperText={errors.name ? (errors.name?.message as string) : null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('accNo')}
              fullWidth
              type='text'
              label='Bank Account Number'
              defaultValue={bank?.accNo}
              InputLabelProps={{
                shrink: true
              }}
              error={Boolean(errors?.accNo)}
              helperText={errors.accNo ? (errors.accNo?.message as string) : null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('password')}
              error={Boolean(errors.password)}
              fullWidth
              type={showPassword ? 'text' : 'password'}
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
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText={
                errors.password
                  ? (errors?.password?.message as string)?.includes('must match the following')
                    ? 'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.'
                    : `Password is ${errors.password?.message}`
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('bankName')}
              fullWidth
              type='text'
              label='Bank Name'
              defaultValue={bank?.bankName}
              InputLabelProps={{
                shrink: true
              }}
              error={Boolean(errors?.bankName)}
              helperText={errors.bankName ? (errors.bankName?.message as string) : null}
            />
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('ifsc')}
              fullWidth
              type='text'
              label='IFSC code'
              defaultValue={bank?.ifsc}
              InputLabelProps={{
                shrink: true
              }}
              error={Boolean(errors?.ifsc)}
              helperText={errors.ifsc ? (errors.ifsc?.message as string) : null}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' disabled={!saveButton} variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button
              disabled={!saveButton}
              type='button'
              onClick={() => {
                setValue('contactValue', contact?.contactValue)
                setValue('registeredName', bank?.registeredName)
                setValue('name', user?.name)
                setValue('accNo', bank?.accNo)
                setValue('bankName', bank?.bankName)
                setValue('ifsc', bank?.ifsc)
                setSaveButton(false)
              }}
              variant='outlined'
              color='secondary'
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
      <RequestSuccessFull open={openRequestSuccessful} onClose={handleCloseBetSuccessful} />
    </CardContent>
  )
}

export default TabAccount

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

function RequestSuccessFull(props: { onClose(): any; open: any }) {
  const theme = useTheme()
  const { onClose, open } = props
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogContent>
        <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Success
          </Typography>
          <Typography variant='body2'>Data Updated Successfully</Typography>
          <SuccessIcon sx={{ marginTop: 6, marginBottom: 3 }}>
            <Avatar alt='SM' sx={{ width: 90, height: 90 }} src='/images/logo.svg' />
          </SuccessIcon>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
