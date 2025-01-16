
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<{
        id: string;
        content: string;
        createdAt: Date;
        userId?: string
    }>;
    text?: string;
}
