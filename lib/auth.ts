import { betterAuth } from "better-auth";

export const auth = betterAuth({
    emailAndPassword: {  
        enabled: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
}
});
