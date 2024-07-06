import { defineConfig, loadEnv } from "vite";
import { node } from "@liuli-util/vite-plugin-node";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [node()],
    define: {
      "process.env.SCHWAB_APP_KEY": JSON.stringify(env.SCHWAB_APP_KEY),
      "process.env.SCHWAB_APP_SECRET": JSON.stringify(env.SCHWAB_APP_SECRET),
      "process.env.MONGO_URI": JSON.stringify(env.MONGO_URI),
      "process.env.REDIRECT_URI": JSON.stringify(env.REDIRECT_URI),
      "process.env.REFRESH_AND_RETRY": env.REFRESH_AND_RETRY === "true",
    },
  };
});
