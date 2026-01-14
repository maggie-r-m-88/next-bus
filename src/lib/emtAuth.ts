let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getEmtAccessToken(): Promise<string> {
  // Reuse token if still valid (with 1 min buffer)
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 60_000) {
    return accessToken;
  }

  const res = await fetch(
    "https://openapi.emtmadrid.es/v1/mobilitylabs/user/login",
    {
      method: "GET",
      headers: {
        email: process.env.EMT_EMAIL!,
        password: process.env.EMT_PASSWORD!,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to authenticate with EMT API");
  }

  const data = await res.json();

  accessToken = data.data[0].accessToken;
  tokenExpiresAt = Date.now() + data.data[0].tokenSecExpiration * 1000;

  return accessToken;
}