import { NextCookies } from 'next/dist/server/web/spec-extension/cookies';
import { NextRequest, NextResponse } from 'next/server';

import routesRequireAuth from '@/utils/routesRequireAuth.json';

import { APIHost } from './utils/apiUtils';

interface CookieType extends NextCookies {
  accessToken: string;
  refreshToken: string;
}

interface ExtendedRequest extends NextRequest {
  cookies: CookieType;
}

export default async function middleware(request: ExtendedRequest) {
  const authorization = request.cookies.get('accessToken');
  const refresh = request.cookies.get('refreshToken');

  const url = request.nextUrl.clone();
  url.pathname = '/auth/signin/';

  const page404 = request.nextUrl.clone();
  page404.pathname = '/404';

  const doesIt =
    request.nextUrl.pathname === '/'
      ? 1
      : routesRequireAuth.filter((route) =>
          request.nextUrl.pathname.includes(route.path)
        ).length;

  if (doesIt) {
    if (authorization === undefined) {
      return NextResponse.redirect(url);
    }

    try {
      const res: any = await fetch(`${APIHost}/api/auth/validateJWT`, {
        method: 'POST',
        headers: request.headers,
        redirect: 'manual',
      })
        .then(async (res) => {
          return { data: await res.json(), header: res.headers };
        })
        .catch((error) => {
          return NextResponse.redirect(url);
        });

      if (res.data.error || res.error || res.data.user.role !== 'staff') {
        return NextResponse.redirect(url);
      }

      const response = NextResponse.next();

      // if (res.data.user) {
      //   response.cookies.set('role', res.data.user.role);
      //   if (!['superadmin', 'admin'].includes(res.data.user.role)) {
      //     return NextResponse.redirect(url);
      //   }

      //   const access =
      //     request.nextUrl.pathname === '/'
      //       ? ['superadmin', 'admin']
      //       : routesRequireAuth.find((route) => {
      //           return request.nextUrl.pathname.includes(route.path);
      //         });

      //   if (!access?.find((role) => role === res.data.user.role)) {
      //     return NextResponse.redirect(page404);
      //   }
      // }

      if (res.data.accessToken) {
        response.cookies.set(
          res.data.accessToken.name,
          res.data.accessToken.value,
          {
            path: '/',
            maxAge: res.data.accessToken.expiresIn,
          }
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.log(error);
    }
  }
  return NextResponse.next();
}
