import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
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
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';

import Label from '@/components/Label';

import BulkActions from './BulkActions';
import { useGetAllUsers } from '../../../../hooks/user/useUser';

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

const RecentOrdersTable: FC<RecentOrdersTableProps> = () => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const [users, setUsers] = useState<any>([]);
  const getAllUsersHook = useGetAllUsers();

  const getAllUsers = async () => {
    const res: any = await getAllUsersHook.mutateAsync('');
    if (res.status === 'success') {
      setUsers(res.users);
    }
  };

  const statusOptions = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'completed',
      name: 'Completed',
    },
    {
      id: 'pending',
      name: 'Pending',
    },
    {
      id: 'failed',
      name: 'Failed',
    },
  ];

  useEffect(() => {
    getAllUsers();
  }, []);

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
          action={
            <Box width={150}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel>Status</InputLabel>
                <Select value='all' label='Status' autoWidth>
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title='All Users'
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox color='primary' />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Bank Acc.</TableCell>
              <TableCell align='right'>Wallet Points</TableCell>
              <TableCell align='right'>Status</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                user.id
              );
              return (
                <TableRow hover key={user.id} selected={isCryptoOrderSelected}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, user.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
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
                      {/* {format(cryptoOrder.orderDate, 'MMMM dd yyyy')} */}
                      {user?.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {/* {cryptoOrder.orderID} */}
                      {user?.uId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {/* {cryptoOrder.sourceName} */}
                      {user?.bank?.accountNumber}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' noWrap>
                      {/* {cryptoOrder.sourceDesc} */}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {(Math.floor(Math.random() * 500) + 6000) / 100}
                      {(Math.floor(Math.random() * 500) + 6000) / 100}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' noWrap>
                      {/* {numeral(cryptoOrder.amount).format(
                        `${cryptoOrder.currency}0,0.00`
                      )} */}
                      {(Math.floor(Math.random() * 500) + 6000) / 100}
                      {(Math.floor(Math.random() * 500) + 6000) / 100}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    {/* {getStatusLabel(cryptoOrder.status)} */}
                  </TableCell>
                  <TableCell align='right'>
                    <Tooltip title='Edit Order' arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        color='inherit'
                        size='small'
                      >
                        <EditTwoToneIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete Order' arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
                        }}
                        color='inherit'
                        size='small'
                      >
                        <DeleteTwoToneIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
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

RecentOrdersTable.propTypes = {};

RecentOrdersTable.defaultProps = {};

export default RecentOrdersTable;
