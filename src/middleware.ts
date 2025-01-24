import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth/login",
    },
});

export const config = {
    matcher: ["/dashboard/:path*"],
};


// export { default } from 'next-auth/middleware';

//rutas protegidas
// export const config = {
//     matcher: ["/dashboard"],
// }