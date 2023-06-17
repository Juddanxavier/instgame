// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { Divider, Container, Table } from '@mui/material'
import { useAtom } from 'jotai'
import { betAtom, NewBet } from '@/@core/store/game'
import { useGetBetList } from '@/@core/hooks/game/useGame'
import { useEffect } from 'react'
import TableContainer from '@mui/material/TableContainer'

import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import _ from 'lodash'

const BetNumberContainer = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    fontSize: 35,
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '20%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  }
}))

const CardImgTop = () => {
  const [betList, setBetList] = useAtom(betAtom)
  const getBetHook = useGetBetList()

  const getBetList = async () => {
    const res: any = await getBetHook.mutateAsync()
    if (res?.status === 'success') setBetList(_.reverse(res?.allBets))
  }
  useEffect(() => {
    getBetList()
  }, [])
  return (
    <Card sx={{ maxHeight: 800 }}>
      {/* <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/glass-house.png' /> */}
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          BETs Placed
        </Typography>
        <Divider></Divider>
        <TableContainer sx={{ maxHeight: 325 }}>
          <Table>
            <TableBody>
              {betList?.map(bet => (
                <TableRow
                  key={bet?._id}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TableCell align='right'>
                    <Box sx={{ display: 'flex', p: 0.5 }}>
                      <BetNumberContainer>{bet?.betNumber === 10 ? '0' : bet?.betNumber}</BetNumberContainer>
                    </Box>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography sx={{ fontSize: 30 }}>{bet?.betAmount}</Typography>{' '}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default CardImgTop
