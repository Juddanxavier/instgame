// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'

// ** Icons Imports
import { styled, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { TypographyProps } from '@mui/system'
import TextField from '@mui/material/TextField'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { usePlaceBet } from '@/@core/hooks/game/useGame'
import { useAtom } from 'jotai'
import { betAtom, gameAtom } from '@/@core/store/game'
import Grid from '@mui/material/Grid'

interface BetNumberContainerType extends TypographyProps {
  active: boolean
}

const BetNumberContainer = styled(Typography)<BetNumberContainerType>(({ theme, active }) => ({
  [theme.breakpoints.up('xs')]: {
    fontSize: 35,
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '20%',
    backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[100],
    color: active ? theme.palette.common.white : theme.palette.common.black
  }
}))

const TextHighlighPrimary = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold'
}))

const betNumbers = [
  { value: 1, title: '1' },
  { value: 2, title: '2' },
  { value: 3, title: '3' },
  { value: 4, title: '4' },
  { value: 5, title: '5' },
  { value: 6, title: '6' },
  { value: 7, title: '7' },
  { value: 8, title: '8' },
  { value: 9, title: '9' },
  { value: 10, title: '0' }
]

interface BetError {
  betNumber?: string
  betAmount?: string
}

const CardSupport = () => {
  const [error, setError] = useState<BetError>({})
  const [errorMessage, setErrorMessage] = useState<string>()
  const [game, setGame] = useAtom(gameAtom)
  const [betNumber, setBetNumber] = useState<number | null>()
  const [betAmount, setBetAmount] = useState<number | null>()
  const [open, setOpen] = useState<boolean>(false)
  const [openGameClosed, setOpenGameClosed] = useState<boolean>(false)
  const [openBetSuccessful, setOpenBetSuccessful] = useState<boolean>(false)

  const theme = useTheme()

  const handleClose = (value: boolean, message: string) => {
    Promise.all([setOpen(false)])
    if (value && message === null) {
      setOpenBetSuccessful(true)
    } else if (value === false && message) {
      Promise.all([setErrorMessage(message), setOpenGameClosed(true)])
    }
  }

  const handleCloseGameClosed = () => {
    Promise.all([setOpenGameClosed(false)])
  }

  const handleCloseBetSuccessful = () => {
    Promise.all([setOpenBetSuccessful(false), setBetAmount(null), setBetNumber(null)])
  }

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
        }}
      >
        <Typography variant='subtitle2' sx={{ marginY: 2.75 }}>
          Bet Numbers
        </Typography>
        <Grid xs={12} container spacing={2} sx={{ justifyContent: 'center' }}>
          {betNumbers.map(number => (
            <Grid item xs={4} sm sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BetNumberContainer
                onClick={() => {
                  setBetNumber(number.value)
                  setError(prev => ({ ...(Object.keys(prev).filter(key => key !== 'betNumber') as BetError) }))
                }}
                active={number.value == betNumber}
              >
                {number.title}
              </BetNumberContainer>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ width: '100%', marginTop: 10, marginBottom: 4, justifyContent: 'center' }}>
          <Typography variant='subtitle2'>Bet Points</Typography>
          <RadioGroup
            row
            name='betAmount'
            sx={{ marginBottom: 10, justifyContent: 'center' }}
            value={betAmount ? String(betAmount) : ''}
          >
            <FormControlLabel
              value='5'
              control={
                <Radio
                  onChange={event => {
                    const number = Number(event.target.value)
                    setBetAmount(number)
                    setError(prev => ({ ...(Object.keys(prev).filter(key => key !== 'betAmount') as BetError) }))
                  }}
                />
              }
              label='5'
            />
            <FormControlLabel
              value='10'
              control={
                <Radio
                  onChange={event => {
                    const number = Number(event.target.value)
                    setBetAmount(number)
                    setError(prev => ({ ...(Object.keys(prev).filter(key => key !== 'betAmount') as BetError) }))
                  }}
                />
              }
              label='10'
            />
            <FormControlLabel
              value='25'
              control={
                <Radio
                  onChange={event => {
                    const number = Number(event.target.value)
                    setBetAmount(number)
                    setError(prev => ({ ...(Object.keys(prev).filter(key => key !== 'betAmount') as BetError) }))
                  }}
                />
              }
              label='25'
            />
            <FormControlLabel
              value='50'
              control={
                <Radio
                  onChange={event => {
                    const number = Number(event.target.value)
                    setBetAmount(number)
                    setError(prev => ({ ...(Object.keys(prev).filter(key => key !== 'betAmount') as BetError) }))
                  }}
                />
              }
              label='50'
            />
            <FormControlLabel
              value='100'
              control={
                <Radio
                  onChange={event => {
                    const number = Number(event.target.value)
                    setBetAmount(number)
                    setError(prev => ({ ...(Object.keys(prev).filter(key => key !== 'betAmount') as BetError) }))
                  }}
                />
              }
              label='100'
            />
          </RadioGroup>
          <Button
            disabled={!game?.gameStatus}
            variant='contained'
            size='medium'
            onClick={() => {
              if (game?.gameStatus) {
                if (betNumber && betAmount) {
                  Promise.all([setOpen(true)])
                } else {
                  setOpenGameClosed(true)
                  setErrorMessage('Please Select Bet Number and Bet Point')
                }
              } else {
                setOpenGameClosed(true)
                setErrorMessage('Game is off')
              }
              // if (betAmount !== null && betNumber) placeBet(betAmount, betNumber)
              // else {
              //   if (!betAmount) {
              //     setError({ betAmount: 'Please Select Bet Point' })
              //   }
              //   if (!betNumber) {
              //     setError({ betAmount: 'Please Select Bet Number' })
              //   }
              // }
            }}
          >
            Bet Now
          </Button>
        </Box>
        <Typography variant='body2' sx={{ marginBottom: 6 }}>
          To place a bet select one bet number above, enter bet points below and hit{' '}
          <TextHighlighPrimary color={theme.palette.primary.main}>BET NOW</TextHighlighPrimary> button
        </Typography>
      </CardContent>
      <PlaceBet betNumber={betNumber!} betAmount={betAmount!} open={open} onClose={handleClose} />
      <GameOff open={openGameClosed} onClose={handleCloseGameClosed} message={errorMessage!} />
      <BetSuccessFull open={openBetSuccessful} onClose={handleCloseBetSuccessful} />
    </Card>
  )
}

export default CardSupport

import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'

function PlaceBet(props: {
  onClose(value: boolean, message: string | null): void
  open: any
  betNumber: number
  betAmount: number
}) {
  const { onClose, open, betNumber, betAmount } = props
  const [error, setError] = useState<BetError>({})
  const [betList, setBetList] = useAtom(betAtom)
  const [wallet, setWallet] = useAtom(walletAtom)
  const placeBetHook = usePlaceBet()
  const handleClose = (value: boolean, message: string | null) => {
    onClose(value, message)
  }

  const myWalletHook = useGetMyWallet()

  const getMyWallet = async () => {
    const res: any = await myWalletHook.mutateAsync()
    if (res?.status === 'success') {
      setWallet(res?.wallet)
    }
  }

  const placeBet = async (betAmount: number, betNumber: number) => {
    try {
      const res: any = await placeBetHook.mutateAsync({
        betAmount,
        betNumber
      })
      if (res.status === 'success') {
        if (res?.newBet) {
          setBetList(prev => [...prev!, res?.newBet])
        }
        getMyWallet()
        handleClose(true, null)
        return true
      }
    } catch (e: any) {
      handleClose(false, e?.response?.data?.error?.message)
    }
  }

  const onSubmit = async (data: any) => {
    if (betAmount !== null && betNumber) {
      placeBet(betAmount, betNumber)
    } else {
      if (!betAmount) {
        setError({ betAmount: 'Please Select Bet Point' })
      }
      if (!betNumber) {
        setError({ betAmount: 'Please Select Bet Number' })
      }
      handleClose(false, null)
    }
  }

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogTitle
        sx={{
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Bet placed on number : {betNumber === 10 ? '0' : betNumber}</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            Point selected : {betAmount}
          </Typography>
          <Divider />
        </Box>
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => handleClose(false, null)}>Cancel</Button>
        <LoadingButton variant='contained' onClick={onSubmit} loading={placeBetHook?.isLoading} type='button'>
          Confirm Bet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

function GameOff(props: { onClose(): any; open: any; message: string }) {
  const { onClose, open, message } = props
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogTitle
        sx={{
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>{message}</Typography>
          <Divider />
        </Box>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

import { LoadingButton } from '@mui/lab'
import { walletAtom } from '../../@core/store/user'
import { useGetMyWallet } from '@/@core/hooks/wallet/useWallet'
import Avatar from '@mui/material/Avatar'

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

function BetSuccessFull(props: { onClose(): any; open: any }) {
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
          <Typography variant='body2'>Bet Placed Successfully</Typography>
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
