import {
  Box,
  Card,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import { useDeleteUser, useGetAllUsers } from '@/hooks/user/useUser';

import Label from '@/components/Label';

import { User } from '@/store/user';

import BulkActions from './BulkActions';
import RecentOrdersTableRow from './RecentOrdersTableRow';

interface RecentOrdersTableProps {
  className?: string;
}

const getStatusLabel = (cryptoOrderStatus): JSX.Element => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error',
    },
    completed: {
      text: 'Completed',
      color: 'success',
    },
    pending: {
      text: 'Pending',
      color: 'warning',
    },
    notinitialized: {
      test: 'Not Initialized',
      color: 'warning',
    },
  };

  const { text, color }: any = map[cryptoOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const RecentOrdersTable = () => {
  const router = useRouter();
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const [query, setQuery] = useState({});
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const [users, setUsers] = useState<any>([]);
  const getAllUsersHook = useGetAllUsers();
  const deleteUserHook = useDeleteUser();
  const [openUserDelete, setOpenUserDelete] = useState<boolean>(false);
  const [userDelete, setUserDelete] = useState<User | undefined>();

  const getAllUsers = async () => {
    const res: any = await getAllUsersHook.mutateAsync({
      query: {
        type: ['customer'],
        role: 'user',
        ...query,
      },
    });
    if (res.status === 'success') {
      setUsers(res.users);
    }
  };

  const handleDeleteUser = (inventory, value) => {
    if (value && inventory) {
      setUserDelete(inventory);
      setOpenUserDelete(true);
    } else {
      setOpenUserDelete(false);
    }
  };

  const onSuccessDelete = (value) => {
    if (value) {
      getAllUsers();
    }
  };

  const deleteUser = async (id) => {
    const res = await deleteUserHook.mutateAsync({
      pathParams: {
        id,
      },
    });
  };

  const statusOptions = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'active',
      name: 'Active',
    },
    {
      id: 'inactive',
      name: 'Inactive',
    },
  ];

  useEffect(() => {
    getAllUsers();
  }, [query]);

  const handleSelectOneCryptoOrder = (
    _event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId,
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          title={
            <Grid container spacing={3}>
              <Grid
                xs={12}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                item
                sm
              >
                <Typography>All customers</Typography>
              </Grid>
              <Grid xs={12} item sm>
                <TextField
                  // disabled={updateUserHook.isLoading}
                  // error={Boolean(errors.accountNumber)}
                  onChange={(event) =>
                    setQuery((prev) => ({
                      ...prev,
                      keyword: event.target.value,
                    }))
                  }
                  fullWidth
                  label='Search'
                  // helperText={
                  //   errors.accountNumber
                  //     ? `Acc No. is ${errors.accountNumber?.message}`
                  //     : null
                  // }
                />
              </Grid>
              <Grid xs={12} item sm={3} md={2}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Status</InputLabel>
                  <Select defaultValue='all' fullWidth label='Status' autoWidth>
                    {statusOptions.map((statusOption) => (
                      <MenuItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          }
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell padding='checkbox'>
                <Checkbox color='primary' />
              </TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Registered Name</TableCell>
              <TableCell>Bank Acc.</TableCell>
              <TableCell>Wallet Points</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                user.id
              );
              return (
                <RecentOrdersTableRow
                  user={user}
                  onSuccessDelete={onSuccessDelete}
                  key={user._id}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component='div'
          count={users.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.defaultProps = {};

export default RecentOrdersTable;
