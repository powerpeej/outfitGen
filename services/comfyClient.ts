export class ComfyClient {
  private apiUrl: string;
  private wsUrl: string;
  private clientId: string;
  private ws: WebSocket | null = null;
  private history: Map<string, any> = new Map();

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.clientId = crypto.randomUUID();

    // Determine WS URL
    const url = new URL(this.apiUrl);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    this.wsUrl = `${protocol}//${url.host}/ws?clientId=${this.clientId}`;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to ComfyUI WebSocket');
        resolve();
      };

      this.ws.onerror = (err) => {
        console.error('ComfyUI WebSocket Error:', err);
        reject(err);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Handle specific message types if needed
          // e.g. status, executing, executed
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };
    });
  }

  async uploadImage(base64Image: string): Promise<string> {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const blob = await (await fetch(`data:image/png;base64,${cleanBase64}`)).blob();
    const formData = new FormData();
    const filename = `upload_${Date.now()}.png`;
    formData.append("image", blob, filename);
    formData.append("overwrite", "true");

    const response = await fetch(`${this.apiUrl}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();
    return result.name || filename;
  }

  async queuePrompt(workflow: any): Promise<any> {
    if (!this.ws) {
      await this.connect();
    }

    const payload = {
      prompt: workflow,
      client_id: this.clientId,
    };

    const response = await fetch(`${this.apiUrl}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to queue prompt: ${response.statusText}`);
    }

    return await response.json();
  }

  async waitForCompletion(promptId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'execution_error' && msg.data.prompt_id === promptId) {
            this.ws?.removeEventListener('message', listener);
            reject(new Error(`ComfyUI Error: ${JSON.stringify(msg.data)}`));
          }

          if (msg.type === 'executed' && msg.data.prompt_id === promptId) {
             this.ws?.removeEventListener('message', listener);
             const outputImages = msg.data.output.images;
             if (outputImages && outputImages.length > 0) {
                 const image = outputImages[0];
                 const imageUrl = `${this.apiUrl}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`;
                 resolve(imageUrl);
             } else {
                 reject(new Error("No images generated"));
             }
          }
        } catch (e) {
           // ignore parsing errors
        }
      };

      this.ws?.addEventListener('message', listener);
    });
  }

  async downloadImageAsBase64(imageUrl: string): Promise<string> {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
      });
  }
}
