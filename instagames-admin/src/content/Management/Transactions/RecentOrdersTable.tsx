import {
  Box,
  Card,
  CardHeader,
  Divider,
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
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ChangeEvent, useEffect, useState } from 'react';

import { useGetAllTransactions } from '@/hooks/transaction/useTransaction';

import { Bank, Contact, User } from '@/store/user';

import BulkActions from './BulkActions';
dayjs.extend(localizedFormat);

export interface WithdrawTransaction {
  _id: string;
  type: string;
  user: User;
  mode: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  bank: Bank;
  contact: Contact;
}
export interface Response {
  type: string;
  status: string;
  message: string;
  transactions: WithdrawTransaction[];
}

// interface TransactionTableProps {
//   className?: string;
//   cryptoOrders: CryptoOrder[];
// }

// interface Filters {
//   status?: CryptoOrderStatus;
// }

// const getStatusLabel = (cryptoOrderStatus: CryptoOrderStatus): JSX.Element => {
//   const map = {
//     failed: {
//       text: 'Failed',
//       color: 'error',
//     },
//     completed: {
//       text: 'Completed',
//       color: 'success',
//     },
//     pending: {
//       text: 'Pending',
//       color: 'warning',
//     },
//     notinitialized: {
//       test: 'Not Initialized',
//       color: 'warning',
//     },
//   };

//   const { text, color }: any = map[cryptoOrderStatus];

//   return <Label color={color}>{text}</Label>;
// };

// const applyFilters = (
//   cryptoOrders: CryptoOrder[],
//   filters: Filters
// ): CryptoOrder[] => {
//   return cryptoOrders.filter((cryptoOrder) => {
//     let matches = true;

//     if (filters.status && transaction.status !== filters.status) {
//       matches = false;
//     }

//     return matches;
//   });
// };

// const applyPagination = (
//   cryptoOrders: CryptoOrder[],
//   page: number,
//   limit: number
// ): CryptoOrder[] => {
//   return cryptoOrders.slice(page * limit, page * limit + limit);
// };

const TransactionTable = () => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const [query, setQuery] = useState({});
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState({
    status: undefined,
  });
  const [transactions, setTransactions] = useState<WithdrawTransaction[]>([]);

  const allTransactionsHook = useGetAllTransactions();

  const getAllTransactions = async () => {
    const res: any = await allTransactionsHook.mutateAsync({
      query: {
        type: ['withdraw', 'deposit'],
        ...query,
      },
    });
    if (res.status === 'success') {
      setTransactions(res.transactions);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [query]);

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

  // const handleStatusChange = (e: SelectChangeEvent<string>): void => {
  //   let value: CryptoOrderStatus = 'notinitialized';

  //   if (e.target.value !== 'all') {
  //     value = e.target.value as CryptoOrderStatus;
  //   }

  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     status: value,
  //   }));
  // };

  // const handleSelectAllCryptoOrders = (
  //   event: ChangeEvent<HTMLInputElement>
  // ): void => {
  //   setSelectedCryptoOrders(
  //     event.target.checked
  //       ? cryptoOrders.map((cryptoOrder) => transaction.id)
  //       : []
  //   );
  // };

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

  // const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  // const paginatedCryptoOrders = applyPagination(page, limit);
  // const selectedSomeCryptoOrders =
  //   selectedCryptoOrders.length > 0 &&
  //   selectedCryptoOrders.length < cryptoOrders.length;
  // const selectedAllCryptoOrders =
  //   selectedCryptoOrders.length === cryptoOrders.length;
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
                <Typography>All Transactions</Typography>
              </Grid>
              <Grid xs={12} item sm={5}>
                <TextField
                  onChange={(event) =>
                    setQuery((prev) => ({
                      ...prev,
                      keyword: event.target.value,
                    }))
                  }
                  fullWidth
                  label='Search'
                />
              </Grid>
              {/* <Grid xs={12} item sm={3} md={2}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Status</InputLabel>
                  <Select
                    onChange={(event) => console.log(event.target.value)}
                    defaultValue='all'
                    fullWidth
                    label='Status'
                    autoWidth
                  >
                    {statusOptions.map((statusOption) => (
                      <MenuItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
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
                <Checkbox
                  color='primary'
                  // checked={selectedAllCryptoOrders}
                  // indeterminate={selectedSomeCryptoOrders}
                  // onChange={handleSelectAllCryptoOrders}
                />
              </TableCell> */}
              <TableCell>Transaction Details</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>User Name</TableCell>

              <TableCell>Bank Acc.</TableCell>
              <TableCell>IFSC</TableCell>
              <TableCell>Bank Name</TableCell>
              {/* <TableCell align='right'>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.map((transaction: WithdrawTransaction) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                transaction?._id
              );
              return (
                <TableRow
                  hover
                  key={transaction?._id}
                  selected={isCryptoOrderSelected}
                >
                  {/* <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, transaction._id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell> */}

                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {transaction?.type}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' noWrap>
                      {dayjs(transaction?.createdAt).format('LL')}
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
                      {transaction.mode}
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
                      {transaction.amount}
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
                      {transaction?.user?.name}
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
                      {transaction?.bank?.accNo}
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
                      {transaction?.bank?.ifsc}
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
                      {transaction?.bank?.bankName}
                    </Typography>
                  </TableCell>

                  {/* <TableCell align='right'>
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
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component='div'
          count={0}
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

TransactionTable.defaultProps = {};

export default TransactionTable;
