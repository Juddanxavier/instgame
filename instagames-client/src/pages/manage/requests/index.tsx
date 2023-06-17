// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import TableStickyHeader from 'src/views/manage/request/TableStickyHeader'
import Head from 'next/head'

const MUITable = () => {
  return (
    <>
      <Head>
        <title>Instagames | Requests</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>
            <Link href='https://mui.com/components/tables/' target='_blank'>
              Requests Summary
            </Link>
          </Typography>
          {/* <Typography variant='body2'>
          Tables display all requests status. Please use filter to find Complete / Pending requests.
        </Typography> */}
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Requests' titleTypographyProps={{ variant: 'h6' }} />
            <TableStickyHeader />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default MUITable
