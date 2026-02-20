import { createNextMiddleware } from "gt-next/middleware";

export default createNextMiddleware();

export const config = {
  matcher: [
    "/((?!_next|_gt|favicon.ico|api|.*\\..*).*)",
  ],
};
