import { parse, serialize } from "cookie";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt } from "./lib/auth/auth";

export async function middleware(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    if (!cookie) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const cookies = parse(cookie);
    const authToken = cookies["loggedIn"];

    if (!authToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    const decrypted = decrypt(authToken)
    if (!decrypted) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.headers.set(
            "Set-Cookie",
            serialize("auth", "", { path: "/", maxAge: -1 })
        );
        return response;
    }
    const user = JSON.parse(decrypted);
    if (!user) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.headers.set(
            "Set-Cookie",
            serialize("auth", "", { path: "/", maxAge: -1 })
        );
        return response;
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/wallet/:path*"],
};