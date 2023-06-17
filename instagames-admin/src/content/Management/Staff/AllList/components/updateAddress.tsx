import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useUpdateUser } from '@/hooks/user/useUser';

function SimpleDialog(props) {
  const { onClose, selectedValue, open, user } = props;
  const updateUserHook = useUpdateUser();
  const [disable, setDisable] = useState<boolean>();

  const handleClose = () => {
    onClose();
  };

  const addUser = Yup.object().shape({
    street: Yup.string().required('Required'),
    aptOrLocality: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUser),
  });

  const updateUser = async (data) => {
    setDisable(true);
    const res: any = await updateUserHook.mutateAsync(data);
    if (res?.message.includes('updated')) {
      setTimeout(() => {
        setDisable(false);
        handleClose();
      }, 500);
    }
  };
  const onSubmit = (data) =>
    updateUser({ user: user?.data.id, data: { address: data } });
  //   const onSubmit = (data) => console.log(data);

  return (
    <Dialog fullWidth={true} maxWidth='xs' onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',

          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Update Address</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            Enter information to update {user?.name}&apos;s address
          </Typography>
        </Box>
        <Box>
          {(updateUserHook.isLoading || disable) && (
            <CircularProgress size={20} />
          )}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ paddingY: 4 }}>
        <Box
          component='form'
          // sx={{
          //   '& .MuiTextField-root': { m: 1 },
          // }}
          noValidate
          autoComplete='off'
        >
          <TextField
            {...register('street')}
            disabled={updateUserHook.isLoading || disable}
            error={Boolean(errors.street)}
            fullWidth
            margin='normal'
            label='House No.'
            helperText={
              errors.street ? `House No. is ${errors.street?.message}` : null
            }
          />
          <TextField
            fullWidth
            {...register('aptOrLocality')}
            disabled={updateUserHook.isLoading || disable}
            error={Boolean(errors.aptOrLocality)}
            margin='normal'
            label='Street/Locality'
            helperText={
              errors.aptOrLocality
                ? `Street/Locality is ${errors.aptOrLocality?.message}`
                : null
            }
          />
          <TextField
            fullWidth
            {...register('city')}
            disabled={updateUserHook.isLoading || disable}
            error={Boolean(errors.city)}
            margin='normal'
            label='City'
            helperText={errors.city ? `City is ${errors.city?.message}` : null}
          />
          <TextField
            fullWidth
            {...register('state')}
            disabled={updateUserHook.isLoading || disable}
            error={Boolean(errors.state)}
            margin='normal'
            label='State'
            helperText={
              errors.state ? `Reference Id ${errors.state?.message}` : null
            }
          />
          <TextField
            fullWidth
            {...register('country')}
            disabled={updateUserHook.isLoading || disable}
            error={Boolean(errors.country)}
            margin='normal'
            label='Country'
            helperText={
              errors.country ? `Reference Id ${errors.country?.message}` : null
            }
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingX: 4, paddingY: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={updateUserHook.isLoading || disable}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          type='button'
        >
          Add Address
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
