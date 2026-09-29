import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(readonly request: APIRequestContext) {}

  get(path: string, params?: Record<string, string | number | boolean>) {
    return this.request.get(path, { params });
  }

  post(path: string, data?: unknown) {
    return this.request.post(path, { data });
  }

  delete(path: string) {
    return this.request.delete(path);
  }

  async json<T>(response: APIResponse, expectedStatus = 200): Promise<T> {
    if (response.status() !== expectedStatus) {
      const body = (await response.text()).slice(0, 400);
      throw new Error(
        `${response.url()} expected ${expectedStatus} but received ` +
          `${response.status()} ${response.statusText()}: ${body}`,
      );
    }

    return (await response.json()) as T;
  }
}
