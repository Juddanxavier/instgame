// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { useState, ChangeEvent, useEffect } from 'react'
import { useGetMyRequests } from '@/@core/hooks/wallet/useWallet'
import { Column, typeObj } from '../manage/request/TableStickyHeader'
import Image from 'next/image'
import _ from 'lodash'
import dayjs from 'dayjs'
import ViewImage from '@/@core/components/ViewImage'

interface RowType {
  age: number
  name: string
  date: string
  email: string
  salary: string
  status: string
  designation: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const rows: RowType[] = [
  {
    age: 27,
    status: 'current',
    date: '09/27/2018',
    name: 'Sally Quinn',
    salary: '$19586.23',
    email: 'eebsworth2m@sbwire.com',
    designation: 'Human Resources Assistant'
  },
  {
    age: 61,
    date: '09/23/2016',
    salary: '$23896.35',
    status: 'professional',
    name: 'Margaret Bowers',
    email: 'kocrevy0@thetimes.co.uk',
    designation: 'Nuclear Power Engineer'
  },
  {
    age: 59,
    date: '10/15/2017',
    name: 'Minnie Roy',
    status: 'rejected',
    salary: '$18991.67',
    email: 'ediehn6@163.com',
    designation: 'Environmental Specialist'
  },
  {
    age: 30,
    date: '06/12/2018',
    status: 'resigned',
    salary: '$19252.12',
    name: 'Ralph Leonard',
    email: 'dfalloona@ifeng.com',
    designation: 'Sales Representative'
  },
  {
    age: 66,
    status: 'applied',
    date: '03/24/2018',
    salary: '$13076.28',
    name: 'Annie Martin',
    designation: 'Operator',
    email: 'sganderton2@tuttocitta.it'
  },
  {
    age: 33,
    date: '08/25/2017',
    salary: '$10909.52',
    name: 'Adeline Day',
    status: 'professional',
    email: 'hnisius4@gnu.org',
    designation: 'Senior Cost Accountant'
  },
  {
    age: 61,
    status: 'current',
    date: '06/01/2017',
    salary: '$17803.80',
    name: 'Lora Jackson',
    designation: 'Geologist',
    email: 'ghoneywood5@narod.ru'
  },
  {
    age: 22,
    date: '12/03/2017',
    salary: '$12336.17',
    name: 'Rodney Sharp',
    status: 'professional',
    designation: 'Cost Accountant',
    email: 'dcrossman3@google.co.jp'
  }
]

const statusObj: StatusObj = {
  rejected: { color: 'error' },
  requested: { color: 'primary' },
  verifying: { color: 'warning' },
  completed: { color: 'success' }
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
    label: 'Requested on',
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

const DashboardTable = () => {
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
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
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
    </Card>
  )
}

export default DashboardTable
