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
import { useGetMyRequests } from '@/@core/hooks/wallet/useWallet'
import Image from 'next/image'
import Chip from '@mui/material/Chip'
import _ from 'lodash'
import { ThemeColor } from '@/@core/layouts/types'
import { Delete } from 'mdi-material-ui'
import { Edit } from '@mui/icons-material'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useGetTransactions } from '@/@core/hooks/transaction/useTransaction'
import { User } from '@/@core/store/user'
import ViewImage from '@/@core/components/ViewImage'

dayjs.extend(localizedFormat)

export interface Image {
  url: string
  thumbnailUrl: string
}

export interface Request {
  status: string
  _id: string
  type: string
  user: User
  amount: number
  __v: number
  createdAt: Date
  updatedAt: Date
  image: Image
}

export interface Column {
  id: 'image' | 'type' | 'status' | 'createdAt' | 'amount' | ''
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: any, row: Request) => any
}
interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

export const statusObj: StatusObj = {
  current: { color: 'info' },
  rejected: { color: 'error' },
  requested: { color: 'primary' },
  verifying: { color: 'warning' },
  completed: { color: 'success' }
}

export const typeObj: StatusObj = {
  withdraw: { color: 'warning' },
  deposit: { color: 'success' }
}

const columns: readonly Column[] = [
  // {
  //   id: 'image',
  //   label: 'Request Image',
  //   minWidth: 170,
  //   format: (value: any) => (
  //     <>
  //       {value && (
  //         <div style={{ width: '50px', height: '50px', position: 'relative' }}>
  //           <Image src={value.thumbnailUrl} layout='fill' alt={value} />
  //         </div>
  //       )}
  //     </>
  //   )
  // },
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
      <Typography sx={{ fontWeight: 500, textAlign: 'center' }}>{value ? `${value}` : '-'}</Typography>
    )
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
    format: (value: string) => (
      <Chip
        label={value}
        color={statusObj[value].color}
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
    id: 'createdAt',
    label: 'Date',
    minWidth: 170,
    align: 'right',
    format: (value: string) => <Typography sx={{ fontWeight: 500 }}>{dayjs(value).format('LL')}</Typography>
  }
  // {
  //   id: '',
  //   label: 'Actions',
  //   align: 'right',
  //   format: (value, row) => (
  //     <>
  //       {row.status !== 'completed' && (
  //         <Tooltip arrow title='Edit request'>
  //           <Edit sx={{ marginX: 1 }} color='primary' />
  //         </Tooltip>
  //       )}
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
  const [requests, setRequests] = useState([])

  const [openImage, setOpenImage] = useState(false)
  const [image, setImage] = useState<string>('')

  const handleImageOpen = (image: any) => {
    setImage(image)
    setOpenImage(true)
  }

  const handleImageClose = (value: any) => {
    Promise.all([setOpenImage(false)])
  }

  const getMyRequestsHook = useGetMyRequests()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getAllRequests = async () => {
    const res: any = await getMyRequestsHook.mutateAsync()

    if (res.status === 'success') {
      setRequests(res.requests)
    }
  }

  useEffect(() => {
    getAllRequests()
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
            {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row._id}>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell
                        onClick={() => {
                          if (column.id === 'image') {
                            handleImageOpen(value.url)
                          }
                        }}
                        key={column.id}
                        align={column.align}
                      >
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ViewImage open={openImage} onClose={handleImageClose} image={image} height='700' />
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default TableStickyHeader
