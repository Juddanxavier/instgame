import _ from 'lodash'
import { NextCookies } from 'next/dist/server/web/spec-extension/cookies'
import { NextRequest, NextResponse } from 'next/server'

import routesRequireAuth from '@/utils/routesRequireAuth.json'
import { APIHost, cookies } from './utils/apiUtils'

interface CookieType extends NextCookies {
  accessToken: string
  refreshToken: string
}

interface ExtendedRequest extends NextRequest {
  cookies: CookieType
}

export default async function middleware(request: ExtendedRequest) {
  const authorization = request.cookies.get('accessToken')
  const refresh = request.cookies.get('refreshToken')

  const url = request.nextUrl.clone()
  url.pathname = '/pages/login/'
  const doesIt =
    request.nextUrl.pathname === '/'
      ? 1
      : routesRequireAuth.filter(route => request.nextUrl.pathname.includes(route)).length

  if (doesIt) {
    if (authorization === undefined) {
      return NextResponse.redirect(url)
    }

    try {
      const res: any = await fetch(`${APIHost}/api/auth/validateJWT`, {
        method: 'POST',
        headers: request.headers,
        redirect: 'manual'
      })
        .then(async res => {
          return { data: await res.json(), header: res.headers }
        })
        .catch(error => {
          return NextResponse.redirect(url)
        })
      if (res.data.error || res.error) {
        return NextResponse.redirect(url)
      }

      if (res.data.accessToken) {
        const response = NextResponse.next()
        response.cookies.set(res.data.accessToken.name, res.data.accessToken.value, {
          path: '/',
          maxAge: res.data.accessToken.expiresIn
        })
      }

      return NextResponse.next()
    } catch (error) {
      console.log(error)
    }
  }
  return NextResponse.next()
}
