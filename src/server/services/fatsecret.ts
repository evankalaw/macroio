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
}
