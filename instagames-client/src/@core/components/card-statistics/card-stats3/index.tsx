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
import { CardStats3 } from '../types'

const WinnerNumber = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    fontSize: 60,
    width: '140px',
    height: '140px',
    display: 'flex'
  }
}))

const CardStats3 = (props: CardStats3) => {
  // ** Props
  const { number, subtitle, heading, color, icon, stats, trend, trendNumber } = props

  return (
    <Card sx={{ height: { xs: 200, md: 250 } }}>
      <CardHeader
        title={heading}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 1.5
          }}
        >
          <WinnerNumber>{number}</WinnerNumber>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardStats3
