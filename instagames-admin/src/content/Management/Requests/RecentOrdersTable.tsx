import { Add } from '@mui/icons-material';
import {
  Card,
  IconButton,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { CardHeader, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import _ from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useEffect, useState } from 'react';

import { useAllRequests } from '@/hooks/request/useRequest';

import Label from '@/components/Label';

import {
  CustomizedMenus,
  TableHead,
  TableHeadCell,
  WithdrawRequest,
} from '@/content/Report/Withdraw/RecentOrdersTable';
import { RequestStatus } from '@/models/crypto_order';

import ViewImage from './ViewImage';
import { TypeStatus } from '../../../models/crypto_order';
import { userAtom } from '../../../store/user';

interface RecentOrdersTableProps {
  className?: string;
}

interface Filters {
  status?: RequestStatus;
}

const getStatusLabel = (requestsStatus: RequestStatus): JSX.Element => {
  const map = {
    rejected: {
      text: 'Rejected',
      color: 'error',
    },
    completed: {
      text: 'Completed',
      color: 'success',
    },
    verifying: {
      text: 'Verifying',
      color: 'warning',
    },
    requested: {
      text: 'Requested',
      color: 'warning',
    },
  };

  const { text, color }: any = map[requestsStatus];

  return <Label color={color}>{text}</Label>;
};
const getTypeLabel = (typeStatus: TypeStatus): JSX.Element => {
  const map = {
    deposit: {
      text: 'deposit',
      color: 'success',
    },
    withdraw: {
      text: 'withdraw',
      color: 'warning',
    },
  };

  const { text, color }: any = map[typeStatus];

  return <Label color={color}>{_.upperFirst(_.toLower(text))}</Label>;
};

const applyFilters = (
  requests: WithdrawRequest[],
  filters: Filters
): WithdrawRequest[] => {
  return requests.filter((request: WithdrawRequest) => {
    let matches = true;

    if (filters.status && request.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  requests: WithdrawRequest[],
  page: number,
  limit: number
): WithdrawRequest[] => {
  return requests.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = () => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [image, setImage] = useState<string>();
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  const statusOptions = [
    {
      id: '',
      name: 'All',
    },
    {
      id: 'completed',
      name: 'Completed',
    },
    {
      id: 'verifying',
      name: 'Verifying',
    },
    {
      id: 'requested',
      name: 'Requested',
    },
    {
      id: 'rejected',
      name: 'Rejected',
    },
  ];

  const handleCloseMenu = (value) => {
    if (value) {
      getAllRequests();
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<string>): void => {
    let value: RequestStatus = 'requested';

    if (e.target.value !== 'all') {
      value = e.target.value as RequestStatus;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const [openCreateAccount, setOpenCreateAccount] = useState(false);

  const handleCreateAccountClickOpen = (image) => {
    setImage(image);
    setOpenCreateAccount(true);
  };

  const handleCreateAccountCloseAndNext = (value) => {
    Promise.all([setOpenCreateAccount(false)]);
  };

  const allRequestsHook = useAllRequests();

  const getAllRequests = async () => {
    const res: any = await allRequestsHook.mutateAsync({
      query: {
        type: ['deposit'],
      },
    });

    if (res.status === 'success') {
      setRequests(res.requests);
    }
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? requests.map((request: WithdrawRequest) => request._id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    _event: ChangeEvent<HTMLInputElement>,
    requestsId: string
  ): void => {
    if (!selectedCryptoOrders.includes(requestsId)) {
      setSelectedCryptoOrders((prevSelected) => [...prevSelected, requestsId]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== requestsId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(requests, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < requests.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === requests.length;
  const theme = useTheme();

  return (
    <Grid container spacing={4}>
      {/* <Grid item xs={12}>
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
                    <Select
                      value={filters.status ?? ''}
                      onChange={handleStatusChange}
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
                </Box>
              }
              title='Deposit Requests'
            />
          )}
          <Divider />

          <Box p={2}>
            <TablePagination
              component='div'
              count={filteredCryptoOrders.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25, 30]}
            />
          </Box>
        </Card>
      </Grid> */}
      {user?.permissions?.find(
        (permission) => permission?.title === 'Upload Image'
      )?.access ? (
        <Grid item xs={12} sx={{ mt: 5 }}>
          <Card>
            <CardHeader
              title={
                <Grid container spacing={2} display='flex' justifyContent='end'>
                  {/* <Grid item>
                  <Button
                    variant='contained'
                    onClick={() => {
                      // const data = requests?.map((request) => {
                      //   return {
                      //     'User Phone': request?.contact?.contactValue,
                      //     'User Name': request?.user?.name,
                      //     'Account No': request?.bank?.accNo,
                      //     IFSC: request?.bank?.ifsc,
                      //     'Bank Name': request?.bank?.bankName,
                      //     Points: '' + request?.amount,
                      //     Status: request?.status,
                      //   };
                      // });
                      // downloadExcel(data);
                    }}
                  >
                    Download
                  </Button>
                </Grid> */}
                  <Grid item>
                    <Button
                      variant='contained'
                      onClick={() =>
                        router?.push('/management/requests/deposit')
                      }
                    >
                      <Add />
                      <Box sx={{ width: 10 }}></Box>
                      Create Deposit Request
                    </Button>
                  </Grid>
                </Grid>
              }
            />
          </Card>
        </Grid>
      ) : (
        <></>
      )}

      <Grid item xs={12} md={12} sx={{ mt: 2 }}>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableHeadCell
                  sx={{
                    borderLeft: 10,
                    borderLeftColor: '#44a574',
                  }}
                >
                  Request Type
                </TableHeadCell>
                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Requested By</TableHeadCell>
                <TableHeadCell>Raised By</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell align='right'>Status</TableHeadCell>
                <TableHeadCell align='right'>Actions</TableHeadCell>
              </TableHead>
              <TableBody>
                {requests.map((request: WithdrawRequest) => {
                  const isCryptoOrderSelected = selectedCryptoOrders.includes(
                    request._id
                  );
                  return (
                    <TableRow
                      hover
                      key={request._id}
                      selected={isCryptoOrderSelected}
                    >
                      {/* <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, request._id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell> */}
                      <TableCell
                        sx={{
                          borderLeft: 10,
                          borderLeftColor:
                            (['requested', 'verifying'].includes(
                              request?.status
                            ) &&
                              '#FCCF31') ||
                            ('completed' === request?.status && '#44a574') ||
                            ('rejected' === request?.status && '#FF1943') ||
                            '',
                        }}
                      >
                        <Typography
                          variant='body1'
                          fontWeight='bold'
                          color='text.primary'
                          gutterBottom
                          noWrap
                        ></Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          noWrap
                        >
                          {getTypeLabel(request?.type)}
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
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              position: 'relative',
                            }}
                          >
                            {request.image && (
                              <Image
                                onClick={() =>
                                  handleCreateAccountClickOpen(
                                    request.image.url
                                  )
                                }
                                src={request.image.thumbnailUrl}
                                layout='fill'
                                alt={request.image.thumbnailUrl}
                              />
                            )}
                          </div>
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
                          {request.user.name}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          noWrap
                        >
                          {request.user.type}
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
                          {request?.raisedBy?.name}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          noWrap
                        >
                          {request?.raisedBy?.type}
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
                          {request.amount
                            ? request.amount
                            : request?.transaction?.amount || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        {getStatusLabel(request.status)}
                      </TableCell>
                      <TableCell align='right'>
                        <CustomizedMenus
                          request={request}
                          handleCloseMenu={handleCloseMenu}
                        />
                        <Tooltip title='Reject' arrow>
                          <IconButton
                            size='small'
                            sx={{
                              '&:hover': {
                                color: theme.colors.alpha.trueWhite[100],
                                backgroundColor: theme.palette.error.main,
                              },

                              background: theme.colors.error.lighter,
                              color: theme.palette.error.main,
                            }}
                          >
                            {/* <DeleteTwoToneIcon /> */}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <ViewImage
        open={openCreateAccount}
        onClose={handleCreateAccountCloseAndNext}
        image={image}
        height='700'
      />
    </Grid>
  );
};

RecentOrdersTable.propTypes = {};

RecentOrdersTable.defaultProps = {};

export default RecentOrdersTable;
