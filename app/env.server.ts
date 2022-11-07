import invariant from "tiny-invariant";

export function getEnv() {
  console.log("-------", process.env.ADMIN_EMAIL);
  invariant(process.env.ADMIN_EMAIL, "ADMIN EMAIL SHOULD BE DEFINED");
  return {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
