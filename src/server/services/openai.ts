export class OpenAiService {
  private openAiApiKey: string | undefined;

  constructor() {
    this.openAiApiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;

    if (!this.openAiApiKey) {
      console.warn("Open AI Api Key not set configured properly.");
    }
  }
}
