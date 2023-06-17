// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'

// ** Custom Components Imports
import CardStats1 from '@/@core/components/card-statistics/card-stats1'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import { DoneOutline, ErrorOutline } from '@mui/icons-material'
import CardStats2 from '@/@core/components/card-statistics/card-stats2'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { gameAtom } from '@/@core/store/game'
import { useGetMyWallet } from '@/@core/hooks/wallet/useWallet'
import CardStats3 from '@/@core/components/card-statistics/card-stats3'
import { walletAtom } from '@/@core/store/user'
import Head from 'next/head'

const Dashboard = () => {
  const [game, setGame] = useAtom(gameAtom)
  const [wallet, setWallet] = useAtom(walletAtom)

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

  return (
    <>
      <Head>
        <title>Instagames | Home</title>
      </Head>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <CardStats1
                  stats='$25.6k'
                  icon={game?.gameStatus ? <DoneOutline /> : <ErrorOutline />}
                  color={game?.gameStatus ? 'success' : 'error'}
                  trendNumber='+42%'
                  heading='Game Status'
                  title={game?.gameStatus ? 'Game on' : 'Game Off'}
                  subtitle='Weekly Profit'
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CardStats3
                  stats='$78'
                  heading='Wallet Points'
                  number={Number(wallet?.balance)}
                  trend='negative'
                  color='secondary'
                  trendNumber='-15%'
                  subtitle='Past Month'
                  icon={<CurrencyUsd />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CardStats2
                  stats='$78'
                  heading='Recent Winning Number'
                  number={(game?.recentWinner === 10 ? '0' : game?.recentWinner) as number}
                  trend='negative'
                  color='secondary'
                  trendNumber='-15%'
                  subtitle='Past Month'
                  icon={<CurrencyUsd />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <DepositWithdraw />
          </Grid>
          <Grid item xs={12}>
            <Table />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export default Dashboard
