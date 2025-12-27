export class LmStudioClient {
    private apiUrl: string;

    constructor(apiUrl: string) {
      this.apiUrl = apiUrl.replace(/\/$/, "");
    }

    async chatCompletion(messages: any[], model?: string): Promise<string> {
      const payload = {
        messages: messages,
        model: model || "local-model", // LM Studio often ignores this or uses the loaded model
        temperature: 0.7,
        max_tokens: -1,
        stream: false
      };

      try {
        const response = await fetch(`${this.apiUrl}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`LM Studio API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
      } catch (error) {
        console.error("LM Studio Chat Error:", error);
        throw error;
      }
    }

    // For Vision (Analyze Image), we use the same chat endpoint but with image_url content
    // Note: LM Studio must have a vision model loaded (e.g. LLaVA)
    async analyzeImage(base64Image: string, prompt: string): Promise<string> {
        const messages = [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: base64Image } }
                ]
            }
        ];
        return this.chatCompletion(messages);
    }
  }
