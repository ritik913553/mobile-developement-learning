import {createClient} from '@libsql/client/web';

export const db = createClient({
    url:process.env.TURSO_DATABASE_URL!,
    authToken:process.env.TURSO_AUTH_TOKEN!,
})
   

// By adding the !, you are telling the TypeScript compiler: "I promise you that this variable will definitely exist at runtime. Silence the error and treat it strictly as a string."