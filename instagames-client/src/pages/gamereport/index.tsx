// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Table from '@mui/material/Table'
import { useEffect, useState } from 'react'
import { useGetMyBetsTillNow } from '@/@core/hooks/game/useGame'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import MuiTableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import _ from 'lodash'
import { LoadingButton } from '@mui/lab'
import Head from 'next/head'
import Button from '@mui/material/Button'

dayjs.extend(localizedFormat)

export interface AllBetListSet {
  number: number
  totalBet: number
}

export interface Game {
  _id: string
  gameId2: string
  createdAt: Date
  updatedAt: Date
  __v: number
  winningNumber: number
  allBetListSet: AllBetListSet[]
  grandTotal: number
  winningAmount: number
  amountReceived: number
}

const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main
}))

const TableSecondHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: theme?.palette?.grey?.[300]
}))

const TableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme?.palette?.common?.white
}))

const Report = () => {
  const [report, setReport] = useState<Game[]>()
  const [query, setQuery] = useState<{ [key: string]: string | undefined }>({
    from: undefined,
    to: dayjs().format('YYYY-MM-DD')
  })

  const myBetsTillNow = useGetMyBetsTillNow()

  const getAllBetsTillNow = async () => {
    const res: any = await myBetsTillNow.mutateAsync({
      query
    })

    if (res?.status === 'success') {
      setReport(res?.report)
    }
  }

  useEffect(() => {
    getAllBetsTillNow()
  }, [])

  return (
    <>
      <Head>
        <title>Instagames | Game Report</title>
      </Head>
      <Grid container spacing={4}>
        {/* <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container spacing={2} rowGap={4}>
                  <Grid item sm={2} xs={12}>
                    <LoadingButton
                      fullWidth
                      loading={myBetsTillNow?.isLoading}
                      variant='contained'
                      onClick={() => getAllBetsTillNow()}
                    >
                      Search
                    </LoadingButton>
                  </Grid>
                  <Grid item xs={0} sm></Grid>
                  <Grid item xs={12} md={2.5}>
                    <TextField
                      fullWidth
                      id='date'
                      label='From'
                      type='date'
                      onChange={date => {
                        if (date.target.value) {
                          setQuery(prev => ({ ...prev, from: date.target.value }))
                        } else {
                          const obj = _.pick(
                            query,
                            Object.keys(query).filter(key => key !== 'from')
                          )
                          setQuery(obj)
                        }
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2.5}>
                    <TextField
                      fullWidth
                      id='date'
                      label='To'
                      type='date'
                      defaultValue={query?.to}
                      onChange={date => {
                        if (date.target.value) {
                          setQuery(prev => ({ ...prev, to: date.target.value }))
                        } else {
                          const obj = _.pick(
                            query,
                            Object.keys(query).filter(key => key !== 'to')
                          )
                          setQuery(obj)
                        }
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                </Grid>
              }
            />
          </Card>
        </Grid> */}
        {report?.map(game => (
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
                    <TableHeadCell>Bet-Points</TableHeadCell>
                    <TableHeadCell>Won-Points</TableHeadCell>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{game?.gameId2}</TableCell>
                      <TableCell>{dayjs(game?.createdAt).format('LLL')}</TableCell>
                      <TableCell>{dayjs(game?.updatedAt).format('LLL')}</TableCell>
                      <TableCell>{game?.grandTotal}</TableCell>
                      <TableCell>
                        {game?.winningNumber ? (game?.winningNumber === 10 ? '0' : game?.winningNumber) : '-'}
                      </TableCell>
                      <TableCell>
                        {game?.allBetListSet.find(bet => bet?.number === game?.winningNumber)?.totalBet || '-'}
                      </TableCell>
                      <TableCell>{game?.winningAmount || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table>
                  <TableSecondHead>
                    <TableRow>
                      <TableCell>Bet Number</TableCell>
                      <TableCell>Bet Point</TableCell>
                    </TableRow>
                  </TableSecondHead>
                  <TableBody>
                    {game?.allBetListSet?.map((bet, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant='body1' fontWeight='bold' color='text.primary' gutterBottom noWrap>
                            {bet?.number === 10 ? '0' : bet?.number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body1' fontWeight='bold' color='text.primary' gutterBottom noWrap>
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
    </>
  )
}

export default Report
