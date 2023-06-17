// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Image from 'next/image'
import Chip from '@mui/material/Chip'
import _ from 'lodash'
import { ThemeColor } from '@/@core/layouts/types'
import { Delete } from 'mdi-material-ui'

import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useGetTransactions } from '@/@core/hooks/transaction/useTransaction'

dayjs.extend(localizedFormat)

interface Column {
  id: 'image' | 'type' | 'status' | 'createdAt' | 'amount' | 'updatedAt'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: any) => any
}
interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  current: { color: 'info' },
  rejected: { color: 'error' },
  requested: { color: 'primary' },
  verifying: { color: 'warning' },
  completed: { color: 'success' }
}

const typeObj: StatusObj = {
  withdraw: { color: 'warning' },
  deposit: { color: 'success' }
}

const columns: readonly Column[] = [
  {
    id: 'type',
    label: 'Type',
    minWidth: 100,
    format: (value: string) => (
      <Chip
        label={_.upperFirst(_.toLower(value))}
        color={typeObj[value].color}
        sx={{
          height: 24,
          fontSize: '0.75rem',
          textTransform: 'capitalize',
          '& .MuiChip-label': { fontWeight: 500 }
        }}
      />
    )
  },
  {
    id: 'amount',
    label: 'Points',
    format: (value: string) => (
      <Typography sx={{ fontWeight: 500, textAlign: 'left' }}>{value ? `${value}` : '-'}</Typography>
    )
  },

  {
    id: 'createdAt',
    label: 'Requested on',
    minWidth: 170,
    align: 'right',
    format: (value: string) => <Typography sx={{ fontWeight: 500 }}>{dayjs(value).format('LL')}</Typography>
  },
  {
    id: 'updatedAt',
    label: 'Updated on',
    minWidth: 170,
    align: 'right',
    format: (value: string) => <Typography sx={{ fontWeight: 500 }}>{dayjs(value).format('LL')}</Typography>
  }
  // {
  //   id: '',
  //   label: 'Actions',
  //   align: 'right',
  //   format: () => (
  //     <>
  //       <Tooltip arrow title='Delete request'>
  //         <Delete sx={{ marginX: 1 }} color='error' />
  //       </Tooltip>
  //     </>
  //   )
  // }
]

const TableStickyHeader = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [transactions, setTransactions] = useState([])

  const getTransactionsHook = useGetTransactions()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getAllTransactions = async () => {
    const res: any = await getTransactionsHook.mutateAsync({
      query: {
        type: ['withdraw', 'deposit']
      }
    })

    if (res?.status === 'success') {
      setTransactions(res?.transactions)
    }
  }

  useEffect(() => {
    getAllTransactions()
  }, [])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row._id}>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={transactions?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default TableStickyHeader
