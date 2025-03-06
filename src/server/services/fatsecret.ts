interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export class FatSecretService {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_FATSECRET_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_FATSECRET_CLIENT_SECRET;

    if (!this.clientId || !this.clientSecret) {
      console.warn("FatSecret API credentials not configured properly.");
    }
  }
  /**
   * Get an OAuth token for the FatSecret API
   * Handles caching and automatic refresh
   */
  async getAccessToken(): Promise<string> {
    // Return existing token if valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error("FatSecret API credentials not configured");
    }

    try {
      const response = await fetch(
        "https://oauth.fatsecret.com/connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          },
          body: "grant_type=client_credentials&scope=basic",
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`FatSecret authentication failed: ${error}`);
      }

      const data = (await response.json()) as TokenResponse;

      this.accessToken = data.access_token;

      // Set expiry (typically 24 hours, but subtract 5 minutes for safety)
      const expiresIn = data.expires_in;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);

      return this.accessToken;
    } catch (error) {
      // Improve error handling with type checking
      if (error instanceof Error) {
        console.error("Failed to get FatSecret access token:", error.message);
        throw new Error(
          `Failed to authenticate with FatSecret API: ${error.message}`,
        );
      }
      // Handle non-Error objects
      console.error("Failed to get FatSecret access token:", error);
      throw new Error("Failed to authenticate with FatSecret API");
    }
  }
}

// Export a singleton instance
export const fatSecretService = new FatSecretService();
