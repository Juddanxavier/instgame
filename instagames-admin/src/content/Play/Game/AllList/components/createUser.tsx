import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useCreateUser } from '@/hooks/user/useUser';

import { userAtom } from '@/store/user';

import { colors } from '@/theme/schemes/DarkSpacesTheme';

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const createUserHook = useCreateUser();
  const [newCreatedUser, setNewCreatedUser] = useAtom(userAtom);

  const handleClose = () => {
    onClose(newCreatedUser);
  };

  const addUser = Yup.object().shape({
    role: Yup.string().required('Required').nullable(),
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid').required('Required'),
    phone: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    referenceUid: Yup.string()
      .required('Required')
      .length(7)
      .matches(/^(SO|SA|BO|AG|SAG|CU)[a-zA-Z0-9]{5}/, 'Invalid'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUser),
  });
  createUserHook.isLoading;

  const createUser = async (data) => {
    const res: any = await createUserHook.mutateAsync(data);
    if (res?.data?.id) {
      setNewCreatedUser(res);
      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  const onSubmit = (data) => createUser({ ...data, password: 'Abc@12345' });

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogTitle
        sx={{
          display: 'flex',

          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Add User</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            Enter information to Create User
          </Typography>
        </Box>
        <Box>{createUserHook.isLoading && <CircularProgress size={20} />}</Box>
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
          <RadioGroup
            {...register('role', { required: true })}
            name='role'
            aria-disabled={createUserHook.isLoading}
            defaultValue=''
            sx={{ paddingX: 3, paddingY: 2 }}
          >
            <Typography variant='h4' sx={{ paddingY: 1 }}>
              Select user role
            </Typography>
            {errors.role && (
              <Typography
                style={{ fontSize: 12 }}
                variant='subtitle2'
                color={colors.error.main}
              >
                <> Role is {errors.role?.message}</>
              </Typography>
            )}

            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <FormControlLabel
                  disabled={createUserHook.isLoading}
                  value='bookie'
                  control={<Radio />}
                  label='Bookie'
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  disabled={createUserHook.isLoading}
                  value='subagent'
                  control={<Radio />}
                  label='Sub Agent'
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlLabel
                  disabled={createUserHook.isLoading}
                  value='superagent'
                  control={<Radio />}
                  label='Super Agent'
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlLabel
                  disabled={createUserHook.isLoading}
                  value='customer'
                  control={<Radio />}
                  label='Customer'
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  disabled={createUserHook.isLoading}
                  value='agent'
                  control={<Radio />}
                  label='Agent'
                />
              </Grid>
            </Grid>
          </RadioGroup>
          <Divider />
          <TextField
            {...register('name')}
            disabled={createUserHook.isLoading}
            error={Boolean(errors.name)}
            fullWidth
            margin='normal'
            label='Name'
            helperText={errors.name ? `Name is ${errors.name?.message}` : null}
          />

          <TextField
            fullWidth
            {...register('email')}
            disabled={createUserHook.isLoading}
            error={Boolean(errors.email)}
            margin='normal'
            label='Email address'
            helperText={
              errors.email ? `Email is ${errors.email?.message}` : null
            }
          />

          <TextField
            fullWidth
            {...register('phone')}
            disabled={createUserHook.isLoading}
            error={Boolean(errors.phone)}
            name='phone'
            margin='normal'
            label='Phone'
            helperText={
              errors.phone ? `Password is ${errors.phone?.message}` : null
            }
          />
          <TextField
            fullWidth
            {...register('referenceUid')}
            disabled={createUserHook.isLoading}
            error={Boolean(errors.referenceUid)}
            name='referenceUid'
            margin='normal'
            label='Reference Id'
            helperText={
              errors.referenceUid
                ? `Reference Id ${errors.referenceUid?.message}`
                : null
            }
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingX: 4, paddingY: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={createUserHook.isLoading}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          type='button'
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
