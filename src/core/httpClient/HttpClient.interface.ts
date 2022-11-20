export interface IRequestOptions<T = Record<string, unknown>> {
    url: string | URL
    body?: T,
    headers?: Record<string, string>
}

export interface IHttpClient {
    get<T>(options: IRequestOptions): Promise<T>;

    post<T>(options: IRequestOptions): Promise<T>;

    put<T>(options: IRequestOptions): Promise<T>;

    delete<T>(options: IRequestOptions): Promise<T>;
}
