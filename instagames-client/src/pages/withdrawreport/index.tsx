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
import { TextField, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import _ from 'lodash'
import { LoadingButton } from '@mui/lab'
import { useGetTransactions } from '@/@core/hooks/transaction/useTransaction'
import Box from '@mui/material/Box'
import * as XLSX from 'xlsx'

const downloadExcel = (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, 'Report.xlsx')
}

dayjs.extend(localizedFormat)

export interface Transaction {
  _id: string
  type: string
  user: string
  mode: string
  amount: number
  createdAt: Date
  updatedAt: Date
  __v: number
}

const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main
}))

const TableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme?.palette?.common?.white
}))

const Report = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [query, setQuery] = useState<{ [key: string]: string | undefined }>({
    from: undefined,
    to: dayjs().format('YYYY-MM-DD')
  })

  const getTransactionsHook = useGetTransactions()

  const getWithdrawTransactions = async () => {
    const res: any = await getTransactionsHook.mutateAsync({
      query: {
        type: ['withdraw']
      }
    })

    if (res.status === 'success') {
      setTransactions(res.transactions)
    }
  }

  useEffect(() => {
    getWithdrawTransactions()
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Grid container spacing={2} rowGap={4}>
                <Grid item sm={2} xs={12}>
                  <Button
                    fullWidth
                    variant='contained'
                    onClick={() => {
                      const data = transactions?.map(transaction => {
                        return {
                          'Withdraw Points': transaction?.amount,
                          'Withdraw Mode': transaction?.mode,
                          'Transaction Type': transaction?.type,
                          'Request Date': dayjs(transaction?.createdAt).format('LLL'),
                          'Process Complete': dayjs(transaction?.updatedAt).format('LLL')
                        }
                      })
                      downloadExcel(data)
                    }}
                  >
                    Download
                  </Button>
                </Grid>
                <Grid item sm={2} xs={12}>
                  <LoadingButton
                    fullWidth
                    loading={getTransactionsHook?.isLoading}
                    variant='contained'
                    onClick={() => getWithdrawTransactions()}
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
      </Grid>

      <Grid item xs={12} md={12}>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableHeadCell>Withdraw Points</TableHeadCell>
                <TableHeadCell>Withdraw Mode</TableHeadCell>
                <TableHeadCell>Transaction Type</TableHeadCell>
                <TableHeadCell>Requested Date</TableHeadCell>
                <TableHeadCell>Process Complete</TableHeadCell>
              </TableHead>
              <TableBody>
                {transactions?.map(transaction => (
                  <TableRow key={transaction?._id}>
                    <TableCell>{transaction?.amount}</TableCell>
                    <TableCell>{transaction?.mode}</TableCell>
                    <TableCell>{transaction?.type}</TableCell>
                    <TableCell>{dayjs(transaction?.createdAt).format('LLL')}</TableCell>
                    <TableCell>{dayjs(transaction?.updatedAt).format('LLL')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Report
