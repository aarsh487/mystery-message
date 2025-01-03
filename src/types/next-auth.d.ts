import 'next-auth';

declare module 'next-auth'{
    interface Session {
        user: {
            id: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user']
    }

    interface User {
        id: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}

declare module 'next-auth/jwt'{
    interface JWT {
        id: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}