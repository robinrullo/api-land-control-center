import {IHttpClient, IRequestOptions} from "./HttpClient.interface";
import {HttpMethod} from "./HttpMethod.enum";
import {staticImplements} from "../../TypeUtils";
import Bottleneck from "bottleneck";

const delay = <T>(callback: () => T, delay = 2000): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(callback()), delay))
}
const limiter = new Bottleneck({
    minTime: 100
});

@staticImplements<IHttpClient>()
export class HttpClient {
    public static async get<T>(options: IRequestOptions): Promise<T> {
        return this.fetcher<T>(HttpMethod.GET, options);
    }

    public static async post<T>(options: IRequestOptions): Promise<T> {
        return this.fetcher<T>(HttpMethod.POST, {headers: {'Content-Type': 'application/json', ...options?.headers}, ...options});
    }

    public static async put<T>(options: IRequestOptions): Promise<T> {
        return this.fetcher<T>(HttpMethod.PUT, {headers: {'Content-Type': 'application/json', ...options?.headers}, ...options});
    }

    public static async delete<T>(options: IRequestOptions): Promise<T> {
        return this.fetcher<T>(HttpMethod.DELETE, {headers: {'Content-Type': 'application/json', ...options?.headers}, ...options});
    }

    private static async fetcher<T>(method: HttpMethod, options: IRequestOptions): Promise<T> {
        return limiter.schedule(async () => {
            const {url, body, headers: optionHeaders, ...rest} = options
            const response = await fetch(url, {
                method,
                body: JSON.stringify(body),
                headers: {
                    ...optionHeaders
                },
                ...rest,
            })
            return delay(() => response.json(), 0)
        })
    }
}
