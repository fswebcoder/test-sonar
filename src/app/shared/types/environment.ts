export type Environment = {
    production: boolean;
    cookie: {
        domain: string;
        sameSite: 'Lax' | 'Strict' | 'None';
        expires: number;
    };
    services: {
        security: string;
        socketUrl: string;
    };
};
