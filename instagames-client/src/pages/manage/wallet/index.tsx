// ** MUI Imports

import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import TotalEarning from '@/views/manage/wallet/TotalEarning'
import Head from 'next/head'

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Instagames | Wallet</title>
      </Head>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <TotalEarning />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export default Dashboard
