// Ensure test environment flags
Object.assign(process.env, {
  NODE_ENV: process.env.NODE_ENV ?? "test",
});
