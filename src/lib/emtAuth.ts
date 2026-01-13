let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getEmtAccessToken(): Promise<string> {
  let accessToken: string | null = null;
  let tokenExpiresAt = 0;

  if (!accessToken || Date.now() > tokenExpiresAt) {
    const res = await fetch(`${process.env.EMT_AUTH_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ClientId: process.env.EMT_CLIENT_ID,
        ClientSecret: process.env.EMT_CLIENT_SECRET,
      }),
    });

    const data = await res.json();
    accessToken = data.data[0].accessToken;
    tokenExpiresAt = Date.now() + data.data[0].tokenSecExpiration * 1000;
  }

  if (!accessToken) throw new Error("EMT access token not returned");

  return accessToken; // Now TypeScript knows it's definitely a string
}

