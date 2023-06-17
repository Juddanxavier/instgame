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
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useGetUser, useUpdateUserData } from '@/hooks/user/useUser';

import { User } from '@/store/user';

export interface Permission {
  id: number;
  title: string;
  access: boolean;
  path: string;
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

function UpdateStaff() {
  const [permissions, setPermissions] = useState<Permission[]>(permissionsRaw);
  const [permissionsChanged, setPermissionsChanged] = useState<boolean>(false);
  const updateUserData = useUpdateUserData();
  const getUserHook = useGetUser();
  const [user, setUser] = useState<User>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const router = useRouter();

  const { id } = router.query;

  const createUserCheck = Yup.object().shape({});
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(createUserCheck),
    mode: 'onTouched',
  });

  const getUser = async () => {
    const res = await getUserHook.mutateAsync({
      pathParams: {
        id: id,
      },
    });
    if (res?.status === 'success') {
      setPermissions(
        _.merge(
          permissionsRaw,
          res?.user?.permissions?.map((permission: any, index: any) => ({
            id: index + 1,
            ...permission,
          }))
        )
      );

      setUser(res?.user);
    }
  };

  const updateUser = async (data: any) => {
    const res: any = await updateUserData.mutateAsync({
      pathParams: {
        id: id,
      },
      body: {
        user: _.omit(data, ['password']),
        permissions,
        password: data?.password,
      },
    });
    if (res?.status === 'success') {
      setPermissionsChanged(false);

      reset(user);
      setValue('name', res?.user?.name);
      setValue('phone', res?.user?.phone);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Grid
      container
      spacing={3}
      component='form'
      onSubmit={handleSubmit(updateUser)}
    >
      <Grid item container xs justifyContent='space-between' alignItems='start'>
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={12}>
            <Typography>User Name</Typography>
            <TextField
              {...register('name')}
              fullWidth
              // value={user?.name}

              onChange={(event) => {
                setUser({
                  ...user,
                  name: event.target.value as string,
                } as User);
              }}
              error={Object.keys(errors).includes('name')}
              required
              margin='normal'
              helperText={
                errors.name ? `Name is ${errors.name?.message}` : null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Phone Number</Typography>
            <TextField
              {...register('phone')}
              fullWidth
              name='phone'
              onChange={(event) => {
                setUser({
                  ...user,
                  contact: { contactValue: event.target.value as string },
                } as User);
              }}
              required
              margin='normal'
              value={user?.contact?.contactValue}
              error={Object.keys(errors).includes('phone')}
              helperText={(errors?.phone?.message as string) || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Password</Typography>
            <TextField
              {...register('password')}
              error={Boolean(errors.password)}
              fullWidth
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
            disabled={!(isDirty || permissionsChanged)}
            loading={updateUserData?.isLoading}
            type='submit'
            variant='contained'
            fullWidth
          >
            Update User
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
                          setPermissionsChanged(true);
                        } else {
                          setPermissions((prev) =>
                            prev.map((permission) => ({
                              ...permission,
                              access: false,
                            }))
                          );
                          setPermissionsChanged(true);
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
                          setPermissionsChanged(true);
                          setPermissions((prev) => [
                            ...prev.filter(
                              (permissionState) =>
                                permissionState.title !== permission.title
                            ),
                            {
                              id: permission.id,
                              path: permission.path,
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

export default UpdateStaff;
