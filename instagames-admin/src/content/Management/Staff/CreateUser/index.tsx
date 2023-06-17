import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardContent,
  CardHeader,
  FormGroup,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useCreateUser } from '@/hooks/user/useUser';

import { userAtom } from '@/store/user';

export interface Permission {
  id: number;
  title: string;
  access: boolean;
}

const permissionsRaw = [
  {
    id: 1,
    title: 'Customers',
    access: false,
    path: '/management/customers',
  },
  {
    id: 2,
    title: 'Staff',
    access: false,
    path: '/management/staff',
  },
  {
    id: 3,
    title: 'Transactions List',
    access: false,
    path: '/management/transactions',
  },
  {
    id: 4,
    title: 'Requests',
    access: false,
    path: '/management/requests',
  },
  {
    id: 5,
    title: 'Wallet Settings',
    access: false,
    path: 'management/wallet',
  },
  {
    id: 6,
    title: 'Game',
    access: false,
    path: '/play/game',
  },
  {
    id: 7,
    title: 'Game Settings',
    access: false,
    path: '/play/setting',
  },
  {
    id: 8,
    title: 'Game Report',
    access: false,
    path: '/report/game',
  },
  {
    id: 9,
    title: 'Withdrawal Report',
    access: false,
    path: '/report/withdraw',
  },
  {
    id: 10,
    title: 'Deposit Request',
    access: false,
    path: '/report/withdraw',
  },
  {
    id: 11,
    title: 'Upload Image',
    access: false,
    path: '/report/withdraw',
  },
];

function CreateStaff() {
  const [permissions, setPermissions] = useState<Permission[]>(permissionsRaw);
  const createUserHook = useCreateUser();
  const [newCreatedUser, setNewCreatedUser] = useAtom(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const router = useRouter();

  const createUserCheck = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    // email: Yup.string().email('Invalid').required('Required'),
    phone: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    password: Yup.string().matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createUserCheck),
  });

  const createUser = async (data) => {
    const res: any = await createUserHook.mutateAsync({
      headers: {
        ...data,
        type: 'admin',
        role: 'staff',
      },

      body: {
        permissions,
      },
    });
    if (res?.status === 'success') {
      // setNewCreatedUser(res);
      router?.push('/management/staff');
    }
  };

  return (
    <Grid
      container
      spacing={3}
      component='form'
      onSubmit={handleSubmit(createUser)}
    >
      <Grid
        item
        container
        xs
        // height='100%'
        justifyContent='space-between'
        alignItems='start'
      >
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={12}>
            <Typography>User Name</Typography>
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
          </Grid>
          <Grid item xs={12}>
            <Typography>Phone Number</Typography>
            <TextField
              fullWidth
              {...register('phone')}
              // disabled={createUserHook.isLoading}
              error={Boolean(errors.phone)}
              name='phone'
              required
              margin='normal'
              label='Phone'
              helperText={
                errors.phone ? (errors.phone?.message as string) : null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Password</Typography>
            <TextField
              {...register('password')}
              error={Boolean(errors.password)}
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              margin='normal'
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
        </Grid>
        <Grid item xs>
          <LoadingButton
            loading={createUserHook?.isLoading}
            type='submit'
            variant='contained'
            fullWidth
          >
            Create User
          </LoadingButton>
        </Grid>
      </Grid>
      <Grid item xs>
        <Card>
          <CardHeader
            title={
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.every(
                        (permission) => permission.access === true
                      )}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setPermissions((prev) =>
                            prev.map((permission) => ({
                              ...permission,
                              access: true,
                            }))
                          );
                        } else {
                          setPermissions((prev) =>
                            prev.map((permission) => ({
                              ...permission,
                              access: false,
                            }))
                          );
                        }
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 20 }}>Permissions</Typography>
                  }
                />
              </>
            }
          />
          <CardContent>
            <FormGroup>
              {permissions
                ?.sort(
                  (firstPermission, secondPermission) =>
                    firstPermission.id - secondPermission.id
                )
                ?.map((permission) => (
                  <FormControlLabel
                    key={permission?.title}
                    control={
                      <Checkbox
                        defaultChecked={permission?.access}
                        checked={permission?.access}
                        onChange={(event) => {
                          setPermissions((prev) => [
                            ...prev.filter(
                              (permissionState) =>
                                permissionState.title !== permission.title
                            ),
                            {
                              id: permission.id,
                              title: permission.title,
                              access: event.target.checked,
                            },
                          ]);
                        }}
                      />
                    }
                    label={permission?.title}
                  />
                ))}
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default CreateStaff;
