// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { useGetMyUser } from '@/@core/hooks/user/useUser'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { userAtom, bankAtom, contactAtom } from '../../../@core/store/user'
import { useGetMyWallet } from '@/@core/hooks/wallet/useWallet'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { walletAtom } from '@/@core/store/user'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const [user, setUser] = useAtom(userAtom)
  const [bank, setBank] = useAtom(bankAtom)
  const [contact, setContact] = useAtom(contactAtom)
  const [wallet, setWallet] = useAtom(walletAtom)

  // ** Hook
  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const getMyUserHook = useGetMyUser()

  const myWalletHook = useGetMyWallet()

  const getMyWallet = async () => {
    const res: any = await myWalletHook.mutateAsync()

    if (res?.status === 'success') {
      setWallet(res?.wallet)
    }
  }

  const getMyUserData = async () => {
    const res: any = await getMyUserHook.mutateAsync()
    if (res?.status === 'success') {
      setUser(res?.userData?.user)
      setBank(res?.userData?.bank)
      setContact(res?.userData?.contact)
    }
  }

  useEffect(() => {
    getMyWallet()
    getMyUserData()
  }, [])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {/* <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        /> */}
      </Box>

      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* {hiddenSm ? null : (
          <Box
            component='a'
            target='_blank'
            rel='noreferrer'
            sx={{ mr: 4, display: 'flex' }}
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free'
          >
            <img
              height={24}
              alt='github stars'
              src='https://img.shields.io/github/stars/themeselection/materio-mui-react-nextjs-admin-template-free?style=social'
            />
          </Box>
        )} */}
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
        {/* <NotificationDropdown /> */}
        <Box sx={{ mx: 5 }}>
          <Grid container>
            <Grid item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography>Wallet Points :</Typography>
            </Grid>
            <Grid item sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 30 }}> {wallet?.balance}</Typography>
            </Grid>
          </Grid>
        </Box>
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default AppBarContent
