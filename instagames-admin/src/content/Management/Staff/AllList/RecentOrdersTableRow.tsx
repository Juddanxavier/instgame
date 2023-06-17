import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Typography, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';

import { useDeleteUser } from '@/hooks/user/useUser';

import { User } from '@/store/user';

import CustomerDeleteDialogue from '../../Users/AllList/CustomerDeleteDialogue';

function RecentOrdersTableRow({ user, onSuccessDelete }) {
  const theme = useTheme();
  const router = useRouter();

  const deleteUserHook = useDeleteUser();
  const [openUserDelete, setOpenUserDelete] = useState<boolean>(false);
  const [userDelete, setUserDelete] = useState<User | undefined>();

  const handleDeleteUser = (user, value) => {
    if (value && user) {
      setUserDelete(user);
      setOpenUserDelete(true);
    } else {
      setUserDelete(user);
      setOpenUserDelete(value);
    }
  };

  const deleteUser = async (id) => {
    const res = await deleteUserHook.mutateAsync({
      pathParams: {
        id,
      },
    });
  };

  return (
    <TableRow hover key={user._id}>
      {/* <TableCell padding='checkbox'>
      <Checkbox
        color='primary'
        checked={isCryptoOrderSelected}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleSelectOneCryptoOrder(event, user._id)
        }
        value={isCryptoOrderSelected}
      />
    </TableCell> */}
      <TableCell align='left'>
        <Typography
          variant='body1'
          fontWeight='bold'
          color='text.primary'
          gutterBottom
          noWrap
        >
          {user.name}
        </Typography>
        <Typography variant='body2' color='text.secondary' noWrap>
          {user?.role}
        </Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography
          variant='body1'
          fontWeight='bold'
          color='text.primary'
          gutterBottom
          noWrap
        >
          {user?.contact?.contactValue}
        </Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography
          variant='body1'
          fontWeight='bold'
          color='text.primary'
          gutterBottom
          noWrap
        >
          {user?.role}
        </Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography
          variant='body1'
          fontWeight='bold'
          color='text.primary'
          gutterBottom
          noWrap
        >
          Active
        </Typography>
      </TableCell>

      <TableCell align='right'>
        <Tooltip title='Edit User' arrow>
          <IconButton
            sx={{
              '&:hover': {
                background: theme.colors.primary.lighter,
              },
              color: theme.palette.primary.main,
            }}
            onClick={() => {
              router.push(`/management/staff/${user?._id}`);
            }}
            color='inherit'
            size='small'
          >
            <EditTwoToneIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete User' arrow>
          <IconButton
            sx={{
              '&:hover': { background: theme.colors.error.lighter },
              color: theme.palette.error.main,
            }}
            onClick={() => {
              handleDeleteUser(user, true);
            }}
            color='inherit'
            size='small'
          >
            <DeleteTwoToneIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </TableCell>
      <CustomerDeleteDialogue
        open={openUserDelete}
        user={user}
        handleClose={handleDeleteUser}
        onSuccess={onSuccessDelete}
      />
    </TableRow>
  );
}

export default RecentOrdersTableRow;
