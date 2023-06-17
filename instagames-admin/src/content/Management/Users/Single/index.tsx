// ** React Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { ThumbUp, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';
// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// ** Icons Imports
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useGetUser, useUpdateUserData } from '@/hooks/user/useUser';

import { bankAtom, contactAtom } from '@/store/user';

import { User } from '@/models/crypto_order';

const TabAccount = () => {
  // ** State
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>();
  const [contact, setContact] = useAtom(contactAtom);
  const [bank, setBank] = useAtom(bankAtom);
  const [saveButton, setSaveButton] = useState<boolean>(false);
  const [updatedKeys, setUpdatedKeys] = useState<any>();
  const [openRequestSuccessful, setOpenRequestSuccessful] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const UserDataValidation = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    contactValue: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    registeredName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    accNo: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    bankName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    ifsc: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    password: Yup.string().matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm
    ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(UserDataValidation),
    defaultValues: {
      contactValue: contact?.contactValue,
      registeredName: bank?.registeredName,
      name: user?.name,
      accNo: bank?.accNo,
      bankName: bank?.bankName,
      ifsc: bank?.ifsc,
      password: '',
    },
  });

  const getUserHook = useGetUser();
  const useUpdateUserDataHook = useUpdateUserData();

  const onSubmit = async (data: any) => {
    try {
      if (updatedKeys?.user) {
        const dataToUpdate = _.pick(data, Object.keys(updatedKeys?.user));
        if (dataToUpdate) {
          const res: any = await useUpdateUserDataHook?.mutateAsync({
            pathParams: {
              id,
            },
            body: {
              user: dataToUpdate,
            },
          });
          if (res?.status === 'success') {
            setUser(res?.user);
          }
        }
      }
      if (updatedKeys?.bank) {
        const dataToUpdate = _.pick(data, Object.keys(updatedKeys?.bank));
        if (dataToUpdate) {
          const res: any = await useUpdateUserDataHook?.mutateAsync({
            pathParams: {
              id,
            },
            body: {
              bank: dataToUpdate,
            },
          });
          if (res?.status === 'success') {
            setBank(res?.bank);
          }
        }
      }
      if (updatedKeys?.contact) {
        const dataToUpdate = _.pick(data, Object.keys(updatedKeys?.contact));
        if (dataToUpdate) {
          const res: any = await useUpdateUserDataHook?.mutateAsync({
            pathParams: {
              id,
            },
            body: {
              contact: dataToUpdate,
            },
          });
          if (res?.status === 'success') {
            setContact(res?.contact);
          }
        }
      }
      if (data?.password) {
        const res: any = await useUpdateUserDataHook?.mutateAsync({
          user: id,
          data: {},
          pathParams: {
            id,
          },
          body: {
            password: data?.password,
          },
        });
        if (res?.status === 'success') {
          setContact(res?.contact);
        }
      }
      setOpenRequestSuccessful(true);
      setSaveButton(false);
    } catch (error) {
      return;
    }
  };

  const getUserData = async () => {
    const res: any = await getUserHook.mutateAsync({
      pathParams: {
        id: id,
      },
    });

    if (res?.status === 'success') {
      setUser(res?.user);
      setBank(res?.user?.bank);
      setContact(res?.user?.contact);
      setValue('contactValue', res?.user?.contact?.contactValue);
      setValue('registeredName', res?.user?.bank?.registeredName);
      setValue('name', res?.user?.name);
      setValue('accNo', res?.user?.bank?.accNo);
      setValue('bankName', res?.user?.bank?.bankName);
      setValue('ifsc', res?.user?.bank?.ifsc);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleCloseBetSuccessful = () => {
    Promise.all([setOpenRequestSuccessful(false)]);
  };

  return (
    <CardContent sx={{ mt: 3 }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          if (isDirty) {
            const userChanges = _.pick(user, Object.keys(dirtyFields));
            const contactChanges = _.pick(contact, Object.keys(dirtyFields));
            const bankChanges = _.pick(bank, Object.keys(dirtyFields));

            const result = _({
              user: userChanges,
              contact: contactChanges,
              bank: bankChanges,
            })
              .omitBy(_.isEmpty)
              .omitBy(_.isNull)
              .value();

            setUpdatedKeys(result);

            setSaveButton(true);
          }
        }}
      >
        <Grid container spacing={7} sx={{ py: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('contactValue')}
              fullWidth
              label='Phone'
              type='text'
              defaultValue={contact?.contactValue}
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors?.contactValue)}
              helperText={
                errors.contactValue
                  ? (errors.contactValue?.message as string)
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('registeredName')}
              fullWidth
              type='text'
              label='Bank Account Name'
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue={contact?.contactValue}
              error={Boolean(errors?.contactValue)}
              helperText={
                errors.registeredName
                  ? (errors.registeredName?.message as string)
                  : null
              }
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
                shrink: true,
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
                shrink: true,
              }}
              error={Boolean(errors?.accNo)}
              helperText={
                errors.accNo ? (errors.accNo?.message as string) : null
              }
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
                ),
              }}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('bankName')}
              fullWidth
              type='text'
              label='Bank Name'
              defaultValue={bank?.bankName}
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors?.bankName)}
              helperText={
                errors.bankName ? (errors.bankName?.message as string) : null
              }
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
                shrink: true,
              }}
              error={Boolean(errors?.ifsc)}
              helperText={errors.ifsc ? (errors.ifsc?.message as string) : null}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type='submit'
              disabled={!saveButton}
              variant='contained'
              sx={{ marginRight: 3.5 }}
            >
              Save Changes
            </Button>
            <Button
              disabled={!saveButton}
              type='button'
              onClick={() => {
                setValue('contactValue', contact?.contactValue);
                setValue('registeredName', bank?.registeredName);
                setValue('name', user?.name);
                setValue('accNo', bank?.accNo);
                setValue('bankName', bank?.bankName);
                setValue('ifsc', bank?.ifsc);
                setValue('password', '');
                setSaveButton(false);
              }}
              variant='outlined'
              color='secondary'
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
      <RequestSuccessFull
        open={openRequestSuccessful}
        onClose={handleCloseBetSuccessful}
      />
    </CardContent>
  );
};

export default TabAccount;

const SuccessIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  minWidth: '80px',
  minHeight: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  color: theme.palette.common.white,
}));

function RequestSuccessFull(props: { onClose(): any; open: any }) {
  const { onClose, open } = props;
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogContent>
        <Box
          sx={{
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Success 🎉
          </Typography>
          <Typography variant='body2'>Data updated successfully</Typography>
          <SuccessIcon sx={{ marginTop: 6, marginBottom: 3 }}>
            <ThumbUp sx={{ fontSize: 50 }}></ThumbUp>
          </SuccessIcon>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
