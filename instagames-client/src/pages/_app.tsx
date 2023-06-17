// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'

import { Cookies, CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState, useEffect } from 'react'
import socketService from '@/@core/utils/socket'
import gameService from '@/@core/utils/game'
import { gameAtom, gameTimerAtom } from '@/@core/store/game'
import { useAtom } from 'jotai'
import { APIHost } from '@/utils/apiUtils'
import { useGetMyUser } from '@/@core/hooks/user/useUser'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  cookies: any
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, cookies } = props
  const [game, setGame] = useAtom(gameAtom)

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const isBrowser = typeof window !== 'undefined'
  const [queryClient] = useState(() => new QueryClient())

  Router.events.on('routeChangeStart', NProgress.start)
  Router.events.on('routeChangeError', NProgress.done)
  Router.events.on('routeChangeComplete', NProgress.done)

  const connectSocket = async () => {
    const socket = await socketService.connect(APIHost).catch(err => {
      console.log('Error: ', err)
    })
  }
  const handleGameStatus = () => {
    if (socketService.socket)
      gameService.onGameStatus(socketService.socket, data => {
        setGame(data)
      })
  }
  const handleGameStoppedTimer = () => {
    if (socketService.socket)
      gameService.onGameOffTime(socketService.socket, data => {
        setGame(prev => ({ ...prev, ...data }))
      })
  }

  useEffect(() => {
    connectSocket()
    handleGameStatus()
    handleGameStoppedTimer()
    return function () {
      socketService.disconnect()
    }
  }, [])

  return (
    <CookiesProvider cookies={isBrowser ? undefined : new Cookies(cookies)}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          {/* <Head>
            <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
            <meta
              name='description'
              content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
            />
            <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head> */}

          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </CacheProvider>
      </QueryClientProvider>
    </CookiesProvider>
  )
}

export default App
