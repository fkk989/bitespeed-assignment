import "module-alias/register";
import app from "./app";

const PORT = process.env.PORT;

function init() {
  const server = app;
  app.listen(PORT, () => {
    console.log(`server running at  http://localhost:${PORT}`);
  });
}

init();
