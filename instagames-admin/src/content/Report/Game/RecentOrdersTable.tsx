// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
// ** Demo Components Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useEffect, useState } from 'react';

import { useGetAllBetsTillNow } from '@/hooks/game/useGame';

dayjs.extend(localizedFormat);

export interface AllBetListSet {
  number: number;
  totalBet: number;
}

export interface Game {
  _id: string;
  gameId2: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  winningNumber: number;
  allBetListSet: AllBetListSet[];
  grandTotal: number;
  pointsDistributed: number;
}

const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main,
}));

const TableSecondHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: theme?.palette?.background?.paper,
}));

const TableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme?.palette?.common?.white,
}));

const Report = () => {
  const [report, setReport] = useState<Game[]>();
  const [query, setQuery] = useState<{ [key: string]: string | undefined }>({
    from: undefined,
    to: dayjs().format('YYYY-MM-DD'),
  });

  const myBetsTillNow = useGetAllBetsTillNow();

  const getAllBetsTillNow = async () => {
    const res: any = await myBetsTillNow.mutateAsync({
      query,
    });

    if (res.status === 'success') {
      setReport(res.report);
    }
  };

  useEffect(() => {
    getAllBetsTillNow();
  }, []);

  return (
    <Grid container spacing={4} sx={{ pt: 5 }}>
      {/* <Grid item xs={12} sx={{ mt: 5 }}>
        <Card>
          <CardHeader
            action={
              <Grid container spacing={3}>
                <Grid item xs={12} sm display='flex' justifyContent='end'>
                  <TextField
                    id='date'
                    label='From'
                    type='date'
                    onChange={(date) => {
                      if (date.target.value) {
                        setQuery((prev) => ({
                          ...prev,
                          from: date.target.value,
                        }));
                      } else {
                        const obj = _.pick(
                          query,
                          Object.keys(query).filter((key) => key !== 'from')
                        );
                        setQuery(obj);
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm display='flex' justifyContent='end'>
                  <TextField
                    id='date'
                    label='To'
                    type='date'
                    defaultValue={query?.to}
                    onChange={(date) => {
                      if (date.target.value) {
                        setQuery((prev) => ({
                          ...prev,
                          to: date.target.value,
                        }));
                      } else {
                        const obj = _.pick(
                          query,
                          Object.keys(query).filter((key) => key !== 'to')
                        );
                        setQuery(obj);
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            }
            title={
              <Grid container spacing={2}>
                <Grid item sm={1.7} xs={12}>
                <Button
                  variant='contained'
                  onClick={() => {
                    const data = transactions?.map((transaction) => {
                      return {
                        'User Phone': transaction?.contact?.contactValue,
                        'User Name': transaction?.user?.name,
                        'Account No': transaction?.bank?.accNo,
                        IFSC: transaction?.bank?.ifsc,
                        Amount: transaction?.bank?.bankName,
                        'UPI ID/No.': '' + transaction?.amount,
                      };
                    });
                    downloadExcel(data);
                  }}
                >
                  Download
                </Button>
              </Grid>
                <Grid item sm={1.7} xs={12}>
                  <LoadingButton
                    loading={myBetsTillNow?.isLoading}
                    variant='contained'
                    onClick={() => getAllBetsTillNow()}
                  >
                    Search
                  </LoadingButton>
                </Grid>
              </Grid>
            }
          />
        </Card>
      </Grid> */}
      {report?.map((game) => (
        <Grid key={game?._id} item xs={12} md={12}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableHeadCell>Game Id</TableHeadCell>
                  <TableHeadCell>Start Date</TableHeadCell>
                  <TableHeadCell>End Date</TableHeadCell>
                  <TableHeadCell>Total Bet</TableHeadCell>
                  <TableHeadCell>Winning-Number</TableHeadCell>
                  <TableHeadCell>Won-Points</TableHeadCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{game?.gameId2}</TableCell>
                    <TableCell>
                      {dayjs(game?.createdAt).format('LLL')}
                    </TableCell>
                    <TableCell>
                      {dayjs(game?.updatedAt).format('LLL')}
                    </TableCell>
                    <TableCell>{game?.grandTotal}</TableCell>
                    <TableCell>
                      {game?.winningNumber
                        ? game?.winningNumber === 10
                          ? '0'
                          : game?.winningNumber
                        : '-'}
                    </TableCell>
                    <TableCell>{game?.pointsDistributed || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableSecondHead>
                  <TableRow>
                    <TableCell>Bet Number</TableCell>
                    <TableCell>Bet Points</TableCell>
                  </TableRow>
                </TableSecondHead>
                <TableBody>
                  {game?.allBetListSet?.map((bet, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography
                          variant='body1'
                          fontWeight='bold'
                          color='text.primary'
                          gutterBottom
                          noWrap
                        >
                          {bet?.number === 10 ? '0' : bet?.number}
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
                          {bet?.totalBet}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Report;
