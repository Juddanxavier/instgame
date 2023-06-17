// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types Imports
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { CardStats2 } from '../types'

const WinnerNumber = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    border: `2px solid ${theme.palette.success.main}`,
    borderRadius: '50%',
    fontSize: 100,
    width: '140px',
    height: '140px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: theme.palette.success.main,
    backgroundColor: '#F4F5FA',
    color: theme.palette.success.main
  }
}))

const CardStats2 = (props: CardStats2) => {
  // ** Props
  const { number, subtitle, heading, color, icon, stats, trend, trendNumber } = props

  return (
    <Card sx={{ height: 250 }}>
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
        {/* <Grid container>
          <Grid item>
            <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'common.white', backgroundColor: `${color}.main` }}>
              {icon}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography sx={{ fontWeight: 600, fontSize: '1.875rem' }}>{title}</Typography>
          </Grid>
        </Grid> */}

        <Box sx={{ marginTop: 1.5, display: 'flex', flexWrap: 'wrap', marginBottom: 1.5, alignItems: 'flex-start' }}>
          {/* <Typography variant='h6' sx={{ mr: 2 }}>
            {stats}
          </Typography>
          <Typography
            component='sup'
            variant='caption'
            sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}
          >
            {trendNumber}
          </Typography> */}
          <WinnerNumber>{number}</WinnerNumber>
        </Box>
        {/* <Typography variant='caption'>{subtitle}</Typography> */}
      </CardContent>
    </Card>
  )
}

export default CardStats2
