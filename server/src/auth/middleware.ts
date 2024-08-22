import { Context } from "koa"
import { decrypt } from "../lib/cookieAuth"

const authenticator = () => {
    console.log('middleware called');

    const authFunc = (ctx: Context) => {
        const cookie = ctx.cookies.get('loggedIn')

        if (!cookie) {
            console.log("not cookie");
            ctx.status = 404
            ctx.body = { message: "No User Logged In" }
            ctx.throw(new Error("User Not Found"))
        }
        const authToken = cookie;
        const decryptedUser = decrypt(authToken);
        const user = JSON.parse(decryptedUser);
        console.log(user);
        
        if (!user) {
            console.log("not user");
            
            ctx.status = 404
            ctx.body = { message: "Unauthorised" }
            ctx.throw(new Error("Unauthorised"))
        }
        ctx.status = 200
    }
    return authFunc
}

export default authenticator