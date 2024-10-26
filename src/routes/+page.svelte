<script>
  let message = "waiting for message";

  const ws = new WebSocket("wss://echo.websocket.org");

  ws.addEventListener("message", (event) => {
    try {
      message = JSON.parse(event.data).message;
    } catch (e) {
      message = event.data;
    }
  });
</script>

<h1>{message}</h1>
