// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import { Wallet } from 'mdi-material-ui'
import { Box, Button, Container, Dialog, DialogContent, DialogActions } from '@mui/material'

import { useEffect, useState } from 'react'
import AddMoney from './addMoney'
import WithdrawMoney from './withdrawMoney'
import { useGetMyWallet } from '@/@core/hooks/wallet/useWallet'
import { User, walletAtom } from '@/@core/store/user'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import { ThumbUp } from '@mui/icons-material'
import { useAtom } from 'jotai'
import Avatar from '@mui/material/Avatar'

const TotalEarning = () => {
  const [depositAmount, setDepositAmount] = useState(false)
  const [withdrawAmount, setWithDrawAmount] = useState(false)
  const [wallet, setWallet] = useAtom(walletAtom)
  const [openRequestSuccessful, setOpenRequestSuccessful] = useState<boolean>(false)

  const myWalletHook = useGetMyWallet()

  const getMyWallet = async () => {
    const res: any = await myWalletHook.mutateAsync()
    if (res?.status === 'success') {
      setWallet(res?.wallet)
    }
  }

  useEffect(() => {
    getMyWallet()
  }, [])
  const handleDepositMoneyClickOpen = () => {
    setDepositAmount(true)
  }
  const handleWithdrawMoneyClickOpen = () => {
    setWithDrawAmount(true)
  }

  const handleDepositCloseAndNext = (value: any) => {
    if (value) {
      Promise.all([setDepositAmount(false), setOpenRequestSuccessful(true)])
    } else {
      setDepositAmount(false)
    }
  }
  const handleWithdrawCloseAndNext = (value: any) => {
    if (value) {
      Promise.all([setWithDrawAmount(false), setOpenRequestSuccessful(true)])
    } else {
      setWithDrawAmount(false)
    }
  }

  const handleCloseBetSuccessful = () => {
    Promise.all([setOpenRequestSuccessful(false)])
  }

  return (
    <Card>
      <CardHeader
        title={
          <Container sx={{ display: 'flex', alignItems: 'center' }}>
            <Wallet style={{ fontSize: '2rem !important' }} />
            <Typography
              variant='h1'
              sx={{
                fontWeight: 600,
                fontSize: '2.125rem !important',
                lineHeight: '1.6 !important',
                marginX: 2,
                letterSpacing: '0.15px !important'
              }}
            >
              Wallet
            </Typography>
          </Container>
        }
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        // action={
        //   <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
        //     <DotsVertical />
        //   </IconButton>
        // }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Grid container spacing={10}>
          <Grid item sm xs={12}>
            <Typography variant='subtitle2' sx={{ alignItems: 'center' }}>
              Total Points
            </Typography>
            <Typography variant='h1' sx={{ fontWeight: 600, fontSize: '3.125rem !important' }}>
              {Number(Math.round((wallet?.balance + 'e2') as unknown as number) + 'e-2')}
            </Typography>
          </Grid>

          <Grid container spacing={2} item sm={7} md={5} xs={12}>
            <Grid item sm={6} xs={12} display='flex' alignItems='end'>
              <Button
                fullWidth
                variant='outlined'
                onClick={handleWithdrawMoneyClickOpen}
                sx={{ paddingY: 4, fontWeight: 600 }}
              >
                Withdraw
              </Button>
            </Grid>
            <Grid item sm={6} xs={12} display='flex' alignItems='end'>
              <Button
                fullWidth
                onClick={handleDepositMoneyClickOpen}
                variant='contained'
                sx={{ paddingY: 4, fontWeight: 600 }}
              >
                Add Points
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <AddMoney open={depositAmount} onClose={handleDepositCloseAndNext} />
        <WithdrawMoney open={withdrawAmount} onClose={handleWithdrawCloseAndNext} />
        <RequestSuccessFull open={openRequestSuccessful} onClose={handleCloseBetSuccessful} />
      </CardContent>
    </Card>
  )
}

export default TotalEarning

const SuccessIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  minWidth: '80px',
  minHeight: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  color: theme.palette.common.white
}))

function RequestSuccessFull(props: { onClose(): any; open: any }) {
  const theme = useTheme()
  const { onClose, open } = props
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogContent>
        <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Congratulations
          </Typography>
          <Typography variant='body2'>Request Placed Successfully</Typography>
          <SuccessIcon sx={{ marginTop: 6, marginBottom: 3 }}>
            <Avatar alt='SM' sx={{ width: 90, height: 90 }} src='/images/logo.svg' />
          </SuccessIcon>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
