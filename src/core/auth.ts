import { cookies } from 'next/headers';

export function generateUserId(): string {
    const userId = crypto.randomUUID()
    cookies().set('userId', userId);
    return userId;
}

export function generateVideoId(): string {
    return crypto.randomUUID();
}