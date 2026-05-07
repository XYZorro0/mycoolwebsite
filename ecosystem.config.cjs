// PM2 process file tuned for a Mac Mini that should sit idle most of the day.
// Restart on memory growth so a long-running process can never balloon.

module.exports = {
  apps: [
    {
      name: "retro-portfolio",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "350M",
      node_args: ["--max-old-space-size=384"],
      env: {
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
        PORT: "3000",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/err.log",
      merge_logs: true,
      time: true,
    },
  ],
};
