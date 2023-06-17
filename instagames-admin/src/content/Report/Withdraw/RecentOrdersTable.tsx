// ** MUI Imports
import {
  Check,
  Clear,
  EditTwoTone,
  MoreVert,
  Undo,
  Visibility,
} from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';
// ** Demo Components Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import {
  useAllRequests,
  useRevertRequest,
  useUpdateRequest,
} from '@/hooks/request/useRequest';

import { Bank, Contact, User } from '@/store/user';

import { Image, RequestStatus, TypeStatus } from '@/models/crypto_order';

const downloadExcel = (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, 'Report.xlsx');
};

dayjs.extend(localizedFormat);

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main,
}));

export const TableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme?.palette?.common?.white,
}));

export interface Transaction {
  _id: string;
  type: string;
  user: string;
  mode: string;
  amount: number;
  request: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface WithdrawRequest {
  image: Image;
  _id: string;
  type: TypeStatus;
  status: RequestStatus;
  user: User;
  raisedBy: User;
  amount: number;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  bank: Bank;
  contact: Contact;
  transaction: Transaction;
}

const Report = () => {
  const [query, setQuery] = useState<{ [key: string]: string | undefined }>({
    from: undefined,
    to: dayjs().format('YYYY-MM-DD'),
  });
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);

  const router = useRouter();

  const allRequestsHook = useAllRequests();

  const handleCloseMenu = (value) => {
    console.log(value);
  };

  const getAllRequests = async () => {
    const res: any = await allRequestsHook.mutateAsync({
      query: {
        type: ['withdraw'],
      },
    });

    if (res.status === 'success') {
      setRequests(res.requests);
    }
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Card>
          <CardHeader
            // action={
            //   <Grid container spacing={3}>
            //     <Grid item xs={12} sm display='flex' justifyContent='end'>
            //       <TextField
            //         id='date'
            //         label='From'
            //         type='date'
            //         onChange={(date) => {
            //           if (date.target.value) {
            //             setQuery((prev) => ({
            //               ...prev,
            //               from: date.target.value,
            //             }));
            //           } else {
            //             const obj = _.pick(
            //               query,
            //               Object.keys(query).filter((key) => key !== 'from')
            //             );
            //             setQuery(obj);
            //           }
            //         }}
            //         InputLabelProps={{
            //           shrink: true,
            //         }}
            //       />
            //     </Grid>
            //     <Grid item xs={12} sm display='flex' justifyContent='end'>
            //       <TextField
            //         id='date'
            //         label='To'
            //         type='date'
            //         defaultValue={query?.to}
            //         onChange={(date) => {
            //           if (date.target.value) {
            //             setQuery((prev) => ({
            //               ...prev,
            //               to: date.target.value,
            //             }));
            //           } else {
            //             const obj = _.pick(
            //               query,
            //               Object.keys(query).filter((key) => key !== 'to')
            //             );
            //             setQuery(obj);
            //           }
            //         }}
            //         InputLabelProps={{
            //           shrink: true,
            //         }}
            //       />
            //     </Grid>
            //   </Grid>
            // }
            title={
              <Grid container spacing={2}>
                <Grid item sm={1.7} xs={12}>
                  <Button
                    variant='contained'
                    onClick={() => {
                      const data = requests?.map((request) => {
                        return {
                          'User Phone': request?.contact?.contactValue,
                          'User Name': request?.user?.name,
                          'Account No': request?.bank?.accNo,
                          IFSC: request?.bank?.ifsc,
                          'Bank Name': request?.bank?.bankName,
                          Points: '' + request?.amount,
                          Status: request?.status,
                        };
                      });
                      downloadExcel(data);
                    }}
                  >
                    Download
                  </Button>
                </Grid>
                {/* <Grid item sm={1.7} xs={12}>
                  <LoadingButton
                    loading={allRequestsHook?.isLoading}
                    variant='contained'
                    onClick={() => getAllRequests()}
                  >
                    Search
                  </LoadingButton>
                </Grid> */}
              </Grid>
            }
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={12}>
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
                  User Phone
                </TableHeadCell>
                <TableHeadCell>User Name</TableHeadCell>
                <TableHeadCell>Account No</TableHeadCell>
                <TableHeadCell>IFSC</TableHeadCell>
                <TableHeadCell>Bank Name</TableHeadCell>
                <TableHeadCell>Points</TableHeadCell>
                {/* <TableHeadCell>UPI ID/No.</TableHeadCell> */}
                <TableHeadCell>Action</TableHeadCell>
              </TableHead>
              <TableBody>
                {requests?.map((request) => (
                  <TableRow hover key={request?._id}>
                    <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
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
                      {request?.contact?.contactValue}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
                    >
                      {request?.user?.name}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
                    >
                      {request?.bank?.accNo}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
                    >
                      {request?.bank?.ifsc}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
                    >
                      {request?.bank?.bankName}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
                    >
                      {request?.amount}
                    </TableCell>
                    {/* <TableCell
                      onClick={() => {
                        ['requested', 'verifying'].includes(request?.status) &&
                          router.push(`/management/requests/${request._id}`);
                      }}
                    ></TableCell> */}
                    <TableCell onClick={() => null} align='center'>
                      <CustomizedMenus
                        request={request}
                        handleCloseMenu={handleCloseMenu}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Report;

const Action = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        onClose={handleClose}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>chack</MenuItem>
      </Menu>
    </Box>
  );
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '&& .MuiButtonBase-root .Mui-selected': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },

      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },

      '&:active': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
}));

export const CustomizedMenus = ({
  request,
  handleCloseMenu,
}: {
  request: WithdrawRequest;
  handleCloseMenu: (value: boolean) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handle2Click = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const theme = useTheme();

  const updateRequestHook = useUpdateRequest();
  const revertRequestHook = useRevertRequest();

  const updateRequest = async (id, status) => {
    const res: any = await updateRequestHook.mutateAsync({
      pathParams: {
        id,
      },
      body: {
        status,
      },
    });
  };
  const revertRequest = async (id) => {
    const res: any = await revertRequestHook.mutateAsync({
      pathParams: {
        id,
      },
    });
    if (res?.status === 'success') {
      // handleCloseMenu(true);
      return;
    }
  };

  return (
    <Box>
      {'requested' === request?.status && (
        <Box>
          <Button
            id='demo-customized-button'
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            variant='contained'
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Options
          </Button>
          <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                ['requested', 'verifying'].includes(request?.status) &&
                  router.push(`/management/requests/${request._id}`);
                handleClose();
              }}
            >
              <Visibility />
              View
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              selected
              onClick={() => {
                updateRequest(request?._id, 'verifying');
                router?.push(`/management/requests/${request?._id}`);
                handleClose();
              }}
            >
              <Check />
              <Typography>Accept</Typography>
            </MenuItem>
            <MenuItem
              selected
              onClick={() => {
                updateRequest(request?._id, 'rejected');
                handleClose();
              }}
            >
              <Clear />
              Reject
            </MenuItem>
          </StyledMenu>
        </Box>
      )}
      {'verifying' === request?.status && (
        <Box>
          <Button
            id='demo-customized-button'
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            variant='contained'
            disableElevation
            onClick={() => {
              ['requested', 'verifying'].includes(request?.status) &&
                router.push(`/management/requests/${request._id}`);
              handleClose();
            }}
            endIcon={<Visibility />}
          >
            View
          </Button>
        </Box>
      )}
      {'completed' === request?.status && (
        <Box justifyContent='end' alignItems='center' display='flex'>
          {/* <IconButton
            variant='text'
            onClick={() => {
              ['requested', 'verifying'].includes(request?.status) &&
                router.push(`/management/requests/${request._id}`);
              handleClose();
            }}
          >
            <Visibility />
          </IconButton> */}
          <Tooltip title='Edit Request' arrow>
            <IconButton
              sx={{
                '&:hover': {
                  background: theme.colors.primary.lighter,
                },
                color: theme.palette.primary.main,
              }}
              onClick={handle2Click}
              color='inherit'
              size='small'
            >
              <EditTwoTone fontSize='small' />
            </IconButton>
          </Tooltip>
          <StyledMenu anchorEl={anchorEl2} open={open2} onClose={handleClose2}>
            <MenuItem
              selected
              onClick={() => {
                revertRequest(request?._id);
                handleCloseMenu(true);
                handleClose2();
              }}
            >
              <Undo />
              <Typography>Revert Request</Typography>
            </MenuItem>
          </StyledMenu>
          <Check color='primary' />
        </Box>
      )}
      {'rejected' === request?.status && (
        <Box>
          <Clear color='error' />
        </Box>
      )}
    </Box>
  );
};

CustomizedMenus.propTypes = {
  request: PropTypes.object.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
};
