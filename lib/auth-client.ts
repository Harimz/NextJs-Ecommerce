import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // The base URL of your auth server
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["user", "admin"],
          required: true,
          defaultValue: "user",
        },
      },
    }),
  ],
});
