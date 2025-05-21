export type AuthError<T> = {
    [key in keyof T]?: string;
}