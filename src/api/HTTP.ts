const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type TMethod = keyof typeof METHODS;

type Headers = Record<string, string>;

interface RequestOptions {
  method?: TMethod;
  headers?: Headers;
  data?: Record<string, unknown> | null;
  timeout?: number;
}

type HTTPMethod = <R = unknown>(url: string, options?: Partial<RequestOptions>) => Promise<R>;

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
  private createMethod(method: TMethod): HTTPMethod {
    return (url, options = {}) => this.request(url, { ...options, method });
  }

  protected readonly get = this.createMethod(METHODS.GET);

  protected readonly put = this.createMethod(METHODS.PUT);

  protected readonly post = this.createMethod(METHODS.POST);

  protected readonly delete = this.createMethod(METHODS.DELETE);

  private request<R>(url: string, options: RequestOptions): Promise<R> {
    const { method, data, headers = {}, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method specified"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

      xhr.timeout = timeout;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        resolve(xhr.response as unknown as R);
      };
      xhr.onerror = () => reject(new Error("Network Error"));
      xhr.ontimeout = () => reject(new Error("Request timed out"));

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

export default HTTP;
