import morgan from "morgan";
import chalk from "chalk";

export const setupLogger = (app) => {
  // Logging configuration: Colorful logs in development, standard logs in production
  if (process.env.NODE_ENV === "development") {
    app.use(
      morgan((tokens, req, res) => {
        const status = tokens.status(req, res);
        const statusColor =
          status >= 500
            ? chalk.red.bold(status)
            : status >= 400
              ? chalk.yellow.bold(status)
              : status >= 300
                ? chalk.cyan.bold(status)
                : chalk.green.bold(status);

        return [
          chalk.blue.bold(tokens.method(req, res)),
          chalk.magenta(tokens.url(req, res)),
          statusColor,
          chalk.white(tokens["response-time"](req, res) + " ms"),
          chalk.gray("- " + (tokens.res(req, res, "content-length") || "0")),
        ].join(" ");
      })
    );
  } else {
    // Standard uncolored logs for production
    app.use(morgan("combined"));
  }
};
