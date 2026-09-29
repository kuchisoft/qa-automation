import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * The API counterpart to a page object.
 *
 * `Page` wraps a browser tab; `ApiClient` wraps an `APIRequestContext`. It adds
 * the two things every endpoint test would otherwise repeat: how to send a
 * request, and how to turn a response into a typed body while failing with a
 * message that actually explains what went wrong.
 *
 * It knows nothing about Toolshop's endpoints - those live in the resource
 * objects next to it (products.api.ts, users.api.ts).
 */
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

  /**
   * Asserts the status and returns the parsed body.
   *
   * The response body is included in the failure because "expected 200,
   * received 401" on its own tells you nothing about why.
   */
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
