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

  const updateUser = Yup.object().shape({
    accountNumber: Yup.string().required('Required'),
    nameInBank: Yup.string().required('Required'),
    ifsc: Yup.string().required('Required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateUser),
  });

  const createUser = async (data) => {
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
    createUser({ user: user?.data.id, data: { bank: data } });

  return (
    <Dialog fullWidth={true} maxWidth='xs' onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Update Bank</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            Enter information to update {user?.name}&apos;s bank
          </Typography>
        </Box>
        <Box>{updateUserHook.isLoading && <CircularProgress size={20} />}</Box>
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
            {...register('accountNumber')}
            disabled={updateUserHook.isLoading}
            error={Boolean(errors.accountNumber)}
            fullWidth
            margin='normal'
            label='Acc No.'
            helperText={
              errors.accountNumber
                ? `Acc No. is ${errors.accountNumber?.message}`
                : null
            }
          />

          <TextField
            fullWidth
            {...register('nameInBank')}
            disabled={updateUserHook.isLoading}
            error={Boolean(errors.aptOrLocality)}
            margin='normal'
            label='Name on passbook'
            helperText={
              errors.nameInBank ? `Name is ${errors.nameInBank?.message}` : null
            }
          />

          <TextField
            fullWidth
            {...register('ifsc')}
            disabled={updateUserHook.isLoading}
            error={Boolean(errors.ifsc)}
            margin='normal'
            label='IFSC code'
            helperText={errors.ifsc ? `IFSC is ${errors.ifsc?.message}` : null}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingX: 4, paddingY: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={updateUserHook.isLoading}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          type='button'
        >
          Add Bank
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
