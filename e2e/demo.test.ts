import { expect, test, WebSocketRoute } from "@playwright/test";

export function withResolvers<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;

  const promise = new Promise<T>((r) => {
    resolve = r;
  });

  return {
    promise,
    resolve,
  };
}

test("home page has expected h1", async ({ page }) => {
  const { promise, resolve } = withResolvers<WebSocketRoute>();

  await page.routeWebSocket(/.*/, (ws: WebSocketRoute) => {
    ws.onMessage((message) => {
      console.log("WS message", message);
    });

    ws.send(JSON.stringify({ message: "message from routeWebSocket" }));

    setTimeout(() => {
      ws.send(
        JSON.stringify({ message: "message from routeWebSocket (setTimeout)" })
      );
    }, 1000);

    resolve(ws);
  });

  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("message from routeWebSocket");
  await expect(page.locator("h1")).toHaveText(
    "message from routeWebSocket (setTimeout)"
  );

  const ws = await promise;
  await ws.send(JSON.stringify({ message: "message from resolved ws" }));
  await expect(page.locator("h1")).toHaveText("message from resolved ws");
});
