import { Outlet } from "@remix-run/react";

export default function UsersRoute() {
  return <Outlet />;
}
// to catch unexpected errors
export function ErrorBoundary({ error }: { error: unknown }) {
  if (error instanceof Error) {
    return (
      <div className="text-red-500">
        Oh no, something went wrong in Users!!
        <pre>{error.message}</pre>
      </div>
    );
  }
  return <div className="text-red-500">Oh no, something went wrong!</div>;
}
