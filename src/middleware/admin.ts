import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const session = await getToken({ req: request });

    if (request.nextUrl.pathname.startsWith('/admin') && session?.role !== 'Admin') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}