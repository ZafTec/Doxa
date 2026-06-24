import process from "node:process";

export interface AuthenticatedUser {
    email: string,
}

export async function getGoogleAccessToken(code: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("client_id", process.env["GOOGLE_CLIENT_ID"] ?? "");
    params.append("client_secret", process.env["GOOGLE_CLIENT_SECRET"] ?? "");
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/oauth");

    const resp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    })
    if (!resp.ok){
        throw new Error(resp.statusText);
    }
    const json = await resp.json();
    return json["access_token"]
}

export async function getGoogleUser( accessToken: string): Promise<AuthenticatedUser>{

    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }

    })
    if (!response.ok) {
        throw new Error("Could not find GoogleUser access token")
    }
    return await response.json();
}
