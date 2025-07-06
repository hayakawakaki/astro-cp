import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4321",
});

export async function googleSignIn() {
  await authClient.signIn.social({ provider: "google" });
  console.warn("Google Signed In");
}

export async function discordSignIn() {
  try {
    await authClient.signIn.social({ provider: "discord" });
  }
  catch (error) {
    console.warn(`Error : ${error}`);
  }
  finally {
    console.warn("Discord Signed In");
  }
}

export async function signOut() {
  await authClient.signOut();
}
