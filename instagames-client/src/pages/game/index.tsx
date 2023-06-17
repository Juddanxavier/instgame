// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CardImgTop from 'src/views/game/CardImgTop'
import CardSupport from 'src/views/game/CardSupport'
import CardMembership from 'src/views/game/CardMembership'
import Head from 'next/head'

const CardBasic = () => {
  return (
    <>
      <Head>
        <title>Instagames | Play Game</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <CardMembership />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardSupport />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <CardImgTop />
        </Grid>
      </Grid>
    </>
  )
}

export default CardBasic
