const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type HTTPMethod = keyof typeof METHODS;

type Headers = Record<string, string>;

interface RequestOptions {
  method?: HTTPMethod;
  headers?: Headers;
  data?: Record<string, unknown> | null;
  timeout?: number;
}

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
  get = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.GET }, options.timeout);
  };

  post = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
  };

  put = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
  };

  delete = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
  };

  request = (
    url: string,
    options: RequestOptions,
    timeout: number = 5000,
  ): Promise<XMLHttpRequest> => {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method specified"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

      // Установить таймаут
      xhr.timeout = timeout;

      // Установить заголовки
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onerror = () => reject(new Error("Network Error"));
      xhr.ontimeout = () => reject(new Error("Request timed out"));

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      }
    });
  };
}

export default HTTP;
