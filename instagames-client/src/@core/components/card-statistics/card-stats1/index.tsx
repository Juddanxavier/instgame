// ** MUI Imports
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Types Imports
import { CardStats1 } from 'src/@core/components/card-statistics/types'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

const CardStats1 = (props: CardStats1) => {
  // ** Props
  const { title, subtitle, heading, color, icon, stats, trend, trendNumber } = props

  return (
    <Card sx={{ height: { xs: 180, md: 250 } }}>
      <CardHeader
        title={heading}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        // action={
        //   <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
        //     <DotsVertical />
        //   </IconButton>
        // }
      />
      <CardContent>
        <Grid container>
          <Grid item>
            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'common.white', backgroundColor: `${color}.main` }}>
              {icon}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography sx={{ fontWeight: 600, fontSize: '1.875rem' }}>{title}</Typography>
          </Grid>
        </Grid>

        {/* <Box sx={{ marginTop: 1.5, display: 'flex', flexWrap: 'wrap', marginBottom: 1.5, alignItems: 'flex-start' }}>
          <Typography variant='h6' sx={{ mr: 2 }}>
            {stats}
          </Typography>
          <Typography
            component='sup'
            variant='caption'
            sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}
          >
            {trendNumber}
          </Typography>
        </Box> */}
        {/* <Typography variant='caption'>{subtitle}</Typography> */}
      </CardContent>
    </Card>
  )
}

export default CardStats1
