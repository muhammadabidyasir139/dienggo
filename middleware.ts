import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Define paths that should ALWAYS be accessible
    const isMaintenancePage = pathname.startsWith('/maintenance')
    const isAdminRoute = pathname.startsWith('/admin')
    const isLoginRoute = pathname.startsWith('/login')
    const isApiRoute = pathname.startsWith('/api')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    if (isMaintenancePage || isAdminRoute || isLoginRoute || isApiRoute || isStaticAsset) {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        })
    }

    try {
        // Check if user is admin - this is safe on Edge
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
        if (token?.role === 'admin') {
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                }
            })
        }
        
        // Maintenance mode check moved to RootLayout because database drivers 
        // are not compatible with Edge Runtime
    } catch (e) {
        console.error('Middleware error:', e)
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
