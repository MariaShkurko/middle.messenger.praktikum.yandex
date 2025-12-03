import type { IErrorResponse } from "../models/IErrorResponse";

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;
const HOST = "https://ya-praktikum.tech";
export const URL_RESOURCES = `${HOST}/api/v2/resources`;

type TMethod = keyof typeof METHODS;

type Headers = Record<string, string>;

interface RequestOptions<D> {
  method?: TMethod;
  headers?: Headers;
  data?: D;
  timeout?: number;
}

interface Response<R> {
  success: boolean;
  data?: R;
  error?: IErrorResponse;
}

type HTTPMethod = <D = unknown, R = unknown>(
  url: string,
  options?: Partial<RequestOptions<D>>,
) => Promise<Response<R>>;

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.keys(data);
  return keys.length
    ? "?" +
        keys
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]))}`)
          .join("&")
    : "";
}

class HTTP {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private createMethod(method: TMethod): HTTPMethod {
    return (url, options = {}) =>
      this.request(url, {
        ...options,
        method,
      });
  }

  public readonly get = this.createMethod(METHODS.GET);
  public readonly put = this.createMethod(METHODS.PUT);
  public readonly post = this.createMethod(METHODS.POST);
  public readonly delete = this.createMethod(METHODS.DELETE);

  private request<D, R>(url: string, options: RequestOptions<D>): Promise<Response<R>> {
    const { method, data, headers = {}, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method specified"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      xhr.open(
        method,
        isGet && !!data
          ? `${HOST}${this.baseUrl}${url}${queryStringify(data)}`
          : `${HOST}${this.baseUrl}${url}`,
      );

      xhr.withCredentials = true;
      xhr.timeout = timeout;

      let contentType: string | null = null;

      if (data instanceof FormData) {
        contentType = null;
      } else if (data !== undefined) {
        contentType = "application/json";
      }

      if (!headers["Content-Type"] && contentType) {
        xhr.setRequestHeader("Content-Type", contentType);
      }

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        const status = xhr.status;
        let responseData: R;

        try {
          responseData = JSON.parse(xhr.responseText) as R;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          responseData = xhr.responseText as unknown as R;
        }

        if (status >= 200 && status < 300) {
          resolve({
            success: true,
            data: responseData,
          });
        } else {
          const errorResponse = JSON.parse(xhr.responseText) as {
            reason: string;
            details?: string;
          };
          resolve({
            success: false,
            error: {
              status: status,
              message: errorResponse.reason || xhr.statusText,
              details: errorResponse?.details || null,
            },
          });
        }
      };
      xhr.onerror = () => {
        resolve({
          success: false,
          error: {
            status: 500,
            message: "Network Error",
            details: "Не удалось установить соединение с сервером",
          },
        });
      };

      xhr.ontimeout = () => {
        resolve({
          success: false,
          error: {
            status: 504,
            message: "Request timed out",
            details: `Запрос занял больше ${timeout} мс`,
          },
        });
      };

      if (isGet || !data) {
        xhr.send();
      } else {
        if (data instanceof FormData) {
          xhr.send(data);
        } else {
          xhr.send(JSON.stringify(data));
        }
      }
    });
  }
}

export default HTTP;
