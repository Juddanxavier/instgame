// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider, { DividerProps } from '@mui/material/Divider'
import { ChangeEvent, useEffect, useState } from 'react'
import { useGetTransactions } from '@/@core/hooks/transaction/useTransaction'
import _ from 'lodash'
import dayjs from 'dayjs'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

interface DataType {
  logo: string
  title: string
  amount: string
  subtitle: string
  logoWidth: number
  logoHeight: number
}

const depositData = [
  {
    logoWidth: 28,
    logoHeight: 29,
    amount: '+$4,650',
    subtitle: 'Sell UI Kit',
    title: 'Gumroad Account',
    logo: '/images/logos/gumroad.png'
  },
  {
    logoWidth: 38,
    logoHeight: 38,
    amount: '+$92,705',
    title: 'Mastercard',
    subtitle: 'Wallet deposit',
    logo: '/images/logos/mastercard-label.png'
  },
  {
    logoWidth: 20,
    logoHeight: 28,
    amount: '+$957',
    title: 'Stripe Account',
    subtitle: 'iOS Application',
    logo: '/images/logos/stripe.png'
  },
  {
    logoWidth: 34,
    logoHeight: 32,
    amount: '+$6,837',
    title: 'American Bank',
    subtitle: 'Bank Transfer',
    logo: '/images/logos/american-bank.png'
  },
  {
    logoWidth: 33,
    logoHeight: 22,
    amount: '+$446',
    title: 'Bank Account',
    subtitle: 'Wallet deposit',
    logo: '/images/logos/citi-bank.png'
  }
]

const withdrawData = [
  {
    logoWidth: 29,
    logoHeight: 30,
    amount: '-$145',
    title: 'Google Adsense',
    subtitle: 'Paypal deposit',
    logo: '/images/logos/google.png'
  },
  {
    logoWidth: 34,
    logoHeight: 34,
    amount: '-$1870',
    title: 'Github Enterprise',
    logo: '/images/logos/github.png',
    subtitle: 'Security & compliance'
  },
  {
    logoWidth: 30,
    logoHeight: 30,
    amount: '-$450',
    title: 'Upgrade Slack Plan',
    subtitle: 'Debit card deposit',
    logo: '/images/logos/slack.png'
  },
  {
    logoWidth: 30,
    logoHeight: 30,
    amount: '-$540',
    title: 'Digital Ocean',
    subtitle: 'Cloud Hosting',
    logo: '/images/logos/digital-ocean.png'
  },
  {
    logoWidth: 36,
    logoHeight: 21,
    amount: '-$21',
    title: 'AWS Account',
    logo: '/images/logos/aws.png',
    subtitle: 'Choosing a Cloud Platform'
  }
]

// Styled Divider component
const Divider = styled(MuiDivider)<DividerProps>(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const DepositWithdraw = () => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [requests, setRequests] = useState([])
  const router = useRouter()

  const getTransactionsHook = useGetTransactions()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getAllRequests = async () => {
    const res: any = await getTransactionsHook.mutateAsync({
      query: {
        type: ['withdraw', 'deposit']
      }
    })
    if (res.status === 'success') {
      setRequests(res.transactions)
    }
  }

  useEffect(() => {
    getAllRequests()
  }, [])

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Deposit'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={
            <Button
              variant='text'
              onClick={() => {
                router?.push('/manage/transactions/')
              }}
            >
              <Typography variant='caption'>View All</Typography>
            </Button>
          }
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          {requests
            .filter((item: any) => item.type === 'deposit')
            .map((item: any) => {
              return (
                <Box
                  key={item.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                    // mb: index !== depositData.length - 1 ? 6 : 0
                  }}
                >
                  {/* <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                    <img src={item.logo} alt={item.title} width={item.logoWidth} height={item.logoHeight} />
                  </Box> */}
                  <Box
                    sx={{
                      ml: 4,
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {_.upperFirst(_.toLower(item.mode))}
                      </Typography>

                      <Typography variant='caption'>{item.subtitle}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {dayjs(item?.createdAt).format('LL')}
                    </Typography>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'success.main' }}>
                      {item.amount ? ' ' + item.amount : ''}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Withdraw'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={
            <Button
              variant='text'
              onClick={() => {
                router?.push('/manage/transactions/')
              }}
            >
              <Typography variant='caption'>View All</Typography>
            </Button>
          }
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          {requests
            .filter((item: any) => item.type === 'withdraw')
            .map((item: any) => {
              return (
                <Box
                  key={item.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                    // mb: index !== depositData.length - 1 ? 6 : 0
                  }}
                >
                  {/* <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                  <img src={item.logo} alt={item.title} width={item.logoWidth} height={item.logoHeight} />
                </Box> */}
                  <Box
                    sx={{
                      ml: 4,
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {_.upperFirst(_.toLower(item.mode))}
                      </Typography>

                      <Typography variant='caption'>{item.subtitle}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {dayjs(item?.createdAt).format('LL')}
                    </Typography>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'success.main' }}>
                      {item.amount ? ' ' + item.amount : ''}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
        </CardContent>
      </Box>
    </Card>
  )
}

export default DepositWithdraw
