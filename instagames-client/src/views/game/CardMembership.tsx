// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports

import { useEffect, useState } from 'react'
import socketService from '@/@core/utils/socket'
import gameService from '@/@core/utils/game'
import { useAtom } from 'jotai'
import { gameAtom, gameTimerAtom } from '@/@core/store/game'

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))
const WinnerNumber = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    border: `2px solid ${theme.palette.success.main}`,
    borderRadius: '50%',
    fontSize: 100,
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: theme.palette.success.main,
    backgroundColor: '#F4F5FA',
    color: theme.palette.success.main
  }
}))

const CardMembership = () => {
  const [gameStatus, setGameStatus] = useState(false)
  const [game, setGame] = useAtom(gameAtom)
  const [settings, setSettings] = useState({
    deductionPercentage: 0,
    deductionRatio: 0,
    winningRatio: 0,
    gameOffTime: 0
  })
  const getMyGameSettingHook = useGetMyGameSetting()

  const getGameSettings = async () => {
    const res: any = await getMyGameSettingHook.mutateAsync()
    if (res.status === 'success') {
      setSettings(res.gameSetting)
    }
  }

  const handleGameStart = () => {
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, data => {
        setGame(data)
        setGameStatus(true)
      })
  }
  const handleGameStopped = () => {
    if (socketService.socket)
      gameService.onStartEnd(socketService.socket, () => {
        setGameStatus(false)
        setGame(null)
      })
  }

  useEffect(() => {
    handleGameStart()
    handleGameStopped()
    getGameSettings()
    const interval = setInterval(() => {
      if (socketService.socket) {
        gameService.getGameStatus(socketService.socket)
      }
    }, 3000)
  }, [])

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid
          item
          sm={3.5}
          xs={12}
          sx={{ paddingTop: ['0 !important', '1.5rem !important'], paddingLeft: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              padding: theme => `${theme.spacing(18, 5, 16)} !important`
            }}
          >
            <Box>
              <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ lineHeight: 1, fontWeight: 600, fontSize: '3.75rem !important' }}>
                  {game?.offTime ? (
                    <MyTimer expiryTimestamp={dayjs(game?.offTime).add(settings?.gameOffTime || 1, 'minute')} />
                  ) : game?.gameStatus ? (
                    'Game on'
                  ) : (
                    'Game Off'
                  )}
                </Typography>
              </Box>

              {game?.offTime ? (
                <Typography variant='body2' sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}>
                  <span>Time left for game to end</span>
                  <span>Hurry up!</span>
                </Typography>
              ) : game?.gameStatus ? (
                <Typography variant='body2' sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}>
                  <span>Game is on.</span>
                  <span>Place Bets!</span>
                </Typography>
              ) : (
                <Typography variant='body2' sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}>
                  <span>Game is off.</span>
                  <span>Please wait for game to start !</span>
                </Typography>
              )}
            </Box>
          </CardContent>
        </Grid>
        <Grid item container xs={12} sm={7}>
          <Grid item md={6} sm={12}>
            <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
              <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
                Recent Winning Number
              </Typography>
              <WinnerNumber>{game?.recentWinner === 10 ? '0' : game?.recentWinner}</WinnerNumber>
            </CardContent>
          </Grid>

          <Grid item md={6} sm={12}>
            <BasicTable />
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CardMembership

import { useTimer } from 'react-timer-hook'
import dayjs from 'dayjs'

function MyTimer({ expiryTimestamp }: any) {
  const [gameTimer, setGameTimer] = useAtom(gameTimerAtom)
  const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => setGameTimer(null)
  })

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '100px' }}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  )
}

import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useGetTodayGames } from '@/@core/hooks/game/useGame'
import { useGetMyGameSetting } from '../../@core/hooks/game/useGame'

export interface TodayGame {
  _id: string
  createdAt: Date
  updatedAt: Date
  winningNumber: number
  __v: number
}

function BasicTable() {
  const getTodayGamesHook = useGetTodayGames()
  const [recentGames, setRecentGame] = useState<TodayGame[] | undefined>()

  const getTodayGames = async () => {
    const res: any = await getTodayGamesHook.mutateAsync()
    if (res?.status === 'success') {
      setRecentGame(res?.todayGames)
    }
  }

  useEffect(() => {
    getTodayGames()
  }, [])
  return (
    <CardContent>
      <TableContainer>
        <Table sx={{ maxHeight: 200 }}>
          <TableHead>
            <TableRow>
              <TableCell align='right'>Time</TableCell>
              <TableCell align='right'>Recent Winning Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentGames?.map((row: TodayGame) => (
              <TableRow
                key={row?.updatedAt as unknown as string}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='right'>{dayjs(row.updatedAt).format('HH:mm:ss')}</TableCell>
                <TableCell align='right'>{row?.winningNumber === 10 ? '0' : row?.winningNumber} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  )
}
