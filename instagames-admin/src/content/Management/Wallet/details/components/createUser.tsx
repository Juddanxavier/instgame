import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useCreateUser } from '@/hooks/user/useUser';

import { userAtom } from '@/store/user';

import { themeColors } from '@/theme/schemes/GreenFieldsTheme';

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
          <Typography style={{ fontSize: 20 }}>
            Upload Payment Screenshot
          </Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            please upload successful payment screenshot to add in wallet.
          </Typography>
        </Box>
        <Box>{createUserHook.isLoading && <CircularProgress size={20} />}</Box>
      </DialogTitle>

      <DialogContent
        sx={{
          paddingY: 4,
          minHeight: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box component='form' sx={{ width: '100%' }} autoComplete='off'>
          <Typography style={{ fontSize: 20, color: themeColors.primary }}>
            Total payment requests - 2
          </Typography>
          <ImageList cols={3} rowHeight={164}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  src={item.img}
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading='lazy'
                />
              </ImageListItem>
            ))}
          </ImageList>

          {/* <TextField
            {...register('name')}
            disabled={createUserHook.isLoading}
            error={Boolean(errors.name)}
            fullWidth
            margin='normal'
            label='Name'
            helperText={errors.name ? `Name is ${errors.name?.message}` : null}
          /> */}
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

const itemData = [
  {
    img: '/static/images/payments/_1666023181467962258485835018922.jpg',
    title: 'Breakfast',
  },
  {
    img: '/static/images/payments/4db4cd22-005f-4eb7-beeb-54019a129348_1665669752 - 2000.00 To Vishakha Pardeshi on Google Pay.png',
    title: 'Burger',
  },
  {
    img: '/static/images/payments/4db4cd22-005f-4eb7-beeb-54019a129348_1665669752 - 2000.00 To Vishakha Pardeshi on Google Pay.png',
    title: 'Burger',
  },
];
