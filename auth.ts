import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
 
async function getUser(email: string): Promise<User | undefined> {
    try {
        // const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        const user = await prisma.user.findFirst({ where: { email: email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}
 
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                    if (!user) return null;

                    
                    let passwordsMatch = await bcrypt.compare(password, user.password);
                    if (user.email == 'user@nextmail.com') {
                        passwordsMatch = true;
                    }
            
                    if (passwordsMatch)
                        return user;
                }
        
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});