import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography
} from '@mui/material'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { userAtom, walletAtom } from '@/@core/store/user'
import { Grid } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { lighten, styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import Image from 'next/image'
import { Key, useRef, useState, ChangeEvent, useEffect } from 'react'
import { useUploadImage } from '@/@core/hooks/image/useImage'
import {
  useDepositRequest,
  useGetMyWallet,
  useGetMyWalletSetting,
  useWithdrawRequest
} from '@/@core/hooks/wallet/useWallet'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

const AvatarAddWrapper = styled(Avatar)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  width: theme.spacing(8),
  height: theme.spacing(8)
}))

const CardLogo = styled('img')(
  ({ theme }) => `
      border: 1px solid ${theme.palette.grey[900]};
      border-radius: 10px;
      padding: ${theme.spacing(1)};
      margin-right: ${theme.spacing(2)};
      background: ${theme.palette.common.white};
`
)

const ImageWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  width: 'auto',
  height: '200px',
  position: 'relative'
}))

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.palette.error.main} dashed 1px;
        height: 100%;
        color: ${theme.palette.error.main};
        box-shadow: none;
        text-align:center;
        padding: 5px;
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
`
)

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.palette.error.light};
     color: ${theme.palette.error.main};
     padding: ${theme.spacing(0.5)};

     &:hover {
      background: ${lighten(theme.palette.error.light, 0.4)};
     }
`
)

const CardCc = styled(Card)(
  ({ theme }) => `
     border: 1px solid ${theme.palette.primary.main};
     background: ${theme.palette.grey[900]};
     box-shadow: none;
`
)
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

function WithdrawMoney(props: { onClose: any; open: any }) {
  const { onClose, open } = props
  const [amount, setAmount] = useState<number>(0)
  const [setting, setSetting] = useState({
    minimumAccountBalance: '0',
    userDefaultBalance: '0',
    minimumWithdrawAmount: '0',
    maximumWithdrawAmount: '0'
  })
  const [wallet, setWallet] = useAtom(walletAtom)

  const withdrawRequestHook = useWithdrawRequest()
  const getWalletSettingHook = useGetMyWalletSetting()
  const myWalletHook = useGetMyWallet()

  const getMyWallet = async () => {
    const res: any = await myWalletHook.mutateAsync()

    if (res?.status === 'success') {
      setWallet(res?.wallet)
    }
  }

  const handleClose = (value: any) => {
    reset()
    setAmount(0)
    clearErrors()
    onClose(value)
  }

  const addUser = Yup.object().shape({
    amount: Yup.number()
      .required('Points are required')
      .min(
        Number(setting?.minimumWithdrawAmount),
        `Points must be greater than or equal to ${setting?.minimumWithdrawAmount}`
      )
      .max(
        Number(
          Math.round(
            ((wallet?.balance as number) - Number(setting.minimumAccountBalance) + 'e2') as unknown as number
          ) + 'e-2'
        ),
        `Points must be less than or equal to ${Number(
          Math.round(
            ((wallet?.balance as number) - Number(setting.minimumAccountBalance) + 'e2') as unknown as number
          ) + 'e-2'
        )}`
      )
  })

  const {
    register,
    trigger,
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(addUser),
    mode: 'onChange'
  })

  const onSubmit = async (data: any) => {
    const res: any = await withdrawRequestHook.mutateAsync(data)
    if (res.status === 'success') {
      handleClose(true)
      getMyWallet()
    }
  }

  const getWalletSettings = async () => {
    const res: any = await getWalletSettingHook.mutateAsync()
    if (res.status === 'success') {
      setSetting(res.walletSetting)
    }
  }

  useEffect(() => {
    getMyWallet()
    getWalletSettings()
    return () => {
      setAmount(0)
      getMyWallet()
    }
  }, [])

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogTitle
        sx={{
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Withdraw points from Wallet</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            please enter points to withdraw from wallet.
          </Typography>
          <Divider />
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            minimum withdraw points: {setting?.minimumWithdrawAmount}
          </Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            maximum withdraw points: {setting?.maximumWithdrawAmount}
          </Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            maximum wallet points: {setting?.minimumAccountBalance}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Grid container md={8}>
            <TextField
              {...register('amount')}
              error={Boolean(errors.amount)}
              helperText={errors.amount ? `${errors.amount?.message}` : null}
              autoFocus
              fullWidth
              onChange={event => {
                setAmount(Number(event.target.value))
              }}
              id='amount'
              label='Points'
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>
              }}
              sx={{ marginBottom: 4 }}
            />
          </Grid>
          <Grid container columnSpacing={4} rowSpacing={2} item md={10} marginTop={4}>
            <Grid item xs={6}>
              <Typography style={{ fontSize: 15, textAlign: 'right' }}>Current Balance :</Typography>
            </Grid>
            <Grid item xs={1} style={{ fontSize: 15, textAlign: 'right' }}></Grid>
            <Grid item xs={5}>
              <Typography style={{ fontSize: 15, textAlign: 'left' }}>
                {Number(Math.round((wallet?.balance + 'e2') as unknown as number) + 'e-2')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                color={(!(Number(amount) >= Number(setting.minimumWithdrawAmount)) && 'error') || ''}
                style={{ fontSize: 15, textAlign: 'right' }}
              >
                Withdraw Points :
              </Typography>
            </Grid>
            <Grid item xs={1} style={{ fontSize: 15, textAlign: 'right' }}>
              <Typography color={(!(Number(amount) >= Number(setting.minimumWithdrawAmount)) && 'error') || ''}>
                -
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <Typography
                style={{ fontSize: 15, textAlign: 'left' }}
                color={(!(Number(amount) >= Number(setting.minimumWithdrawAmount)) && 'error') || ''}
              >
                {Number(amount) >= Number(setting.minimumWithdrawAmount) ? Number(amount) : Number(amount)}
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <Typography
                style={{ fontSize: 20, textAlign: 'right' }}
                color={
                  (!(
                    Number(
                      Math.round((Number(wallet?.balance) - Number(amount) + 'e2') as unknown as number) + 'e-2'
                    ) >= Number(setting?.minimumAccountBalance)
                  ) &&
                    'error') ||
                  ''
                }
              >
                Wallet Points :
              </Typography>
            </Grid>
            <Grid item xs={1} style={{ fontSize: 15, textAlign: 'right' }}></Grid>
            <Grid item xs={5}>
              <Typography
                color={
                  (!(
                    Number(
                      Math.round((Number(wallet?.balance) - Number(amount) + 'e2') as unknown as number) + 'e-2'
                    ) >= Number(setting?.minimumAccountBalance)
                  ) &&
                    'error') ||
                  ''
                }
                style={{ fontSize: 20, textAlign: 'left' }}
              >
                {Number(amount)
                  ? Number(Math.round((Number(wallet?.balance) - Number(amount) + 'e2') as unknown as number) + 'e-2')
                  : Number(Math.round((wallet?.balance + 'e2') as unknown as number) + 'e-2')}
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              {Number(amount)
                ? !(
                    Number(amount) >= Number(setting.minimumWithdrawAmount) &&
                    Number(
                      Math.round(
                        ((wallet?.balance as number) -
                          Number(setting.minimumAccountBalance) +
                          'e2') as unknown as number
                      ) + 'e-2'
                    )
                  ) && (
                    <CardAddAction>
                      <Typography color='error'>This request is not valid</Typography>
                      <Typography color='error' variant='subtitle2'>
                        {Number(amount) < Number(setting?.minimumWithdrawAmount)
                          ? `You can withdraw above ${setting?.minimumWithdrawAmount}`
                          : (wallet?.balance as number) - Number(amount) > Number(setting?.minimumAccountBalance)
                          ? `You can not withdraw more that ${
                              (wallet?.balance as number) - Number(setting?.minimumWithdrawAmount)
                            }`
                          : Number(amount) > Number(setting?.maximumWithdrawAmount)
                          ? 'Exceeded Maximum withdraw points!'
                          : `Insufficient Points`}
                      </Typography>
                    </CardAddAction>
                  )
                : ''}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button sx={{ my: 4 }} onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button sx={{ width: '160px' }} disabled={withdrawRequestHook.isLoading} variant='contained' type='submit'>
            {withdrawRequestHook.isLoading ? <CircularProgress color='warning' size={20} /> : 'Send Request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default WithdrawMoney
