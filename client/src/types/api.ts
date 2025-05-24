export type ApiResponse<T = undefined> = {
    type: 'success' | 'error';
    message: string,
    data?: T
}