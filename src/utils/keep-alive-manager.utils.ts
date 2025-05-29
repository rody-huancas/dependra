export class KeepAliveManager {
  private keepAliveInterval      : NodeJS.Timeout   | null = null;
  private wakeLock               : WakeLockSentinel | null = null;
  private audioContext           : AudioContext     | null = null;
  private heartbeatWorker        : Worker           | null = null;
  private visibilityChangeHandler: (() => void)     | null = null;
  private isActive = false;

  async start(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    await this.requestWakeLock();
    this.createSilentAudio();
    this.createHeartbeatWorker();
    this.startKeepAliveInterval();
    this.setupVisibilityHandler();

    console.log("KeepAlive iniciado");
  }

  async stop(): Promise<void> {
    if (!this.isActive) return;
    this.isActive = false;

    this.clearKeepAliveInterval();
    await this.releaseWakeLock();
    await this.closeAudioContext();
    this.terminateWorker();
    this.removeVisibilityHandler();

    console.log("KeepAlive detenido");
  }

  private async requestWakeLock(): Promise<void> {
    try {
      if ("wakeLock" in navigator) {
        this.wakeLock = await navigator.wakeLock.request("screen");

        this.wakeLock.addEventListener("release", () => {
          if (this.isActive && !document.hidden) {
            setTimeout(() => this.requestWakeLock(), 100);
          }
        });
      }
    } catch (error) {
      console.log("Wake Lock no disponible:", error);
    }
  }

  private createSilentAudio(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      const oscillator = this.audioContext.createOscillator();
      const gainNode   = this.audioContext.createGain();

      gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(20000, this.audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.start();
    } catch (error) {
      console.log("AudioContext no disponible:", error);
    }
  }

  private createHeartbeatWorker(): void {
    try {
      const workerCode = `
          let interval;
          self.onmessage = function(e) {
            if (e.data === 'start') {
              interval = setInterval(() => {
                const now    = Date.now();
                const random = Math.random();
                self.postMessage({ type: 'heartbeat', timestamp: now, random });
              }, 100);
            } else if (e.data === 'stop') {
              if (interval) {
                clearInterval(interval);
                interval = null;
              }
            }
          };
        `;

      const blob  = new Blob([workerCode], { type: "application/javascript" });
      this.heartbeatWorker = new Worker(URL.createObjectURL(blob));

      this.heartbeatWorker.onmessage = (e) => {
        if (e.data.type === "heartbeat") {
          performance.now();
        }
      };

      this.heartbeatWorker.postMessage("start");
    } catch (error) {
      console.log("Worker no disponible:", error);
    }
  }

  private startKeepAliveInterval(): void {
    this.keepAliveInterval = setInterval(() => {
      this.performKeepAliveOperations();
    }, 5);
  }

  private performKeepAliveOperations(): void {
    performance.now();
    Date.now();
    Math.random();

    if (document.body) {
      document.body.getAttribute("class");
    }

    if (navigator.onLine && Math.random() > 0.99) {
      fetch("data:text/plain,ping", {
        method: "HEAD",
        cache : "no-cache",
      }).catch(() => {});
    }
  }

  private setupVisibilityHandler(): void {
    this.visibilityChangeHandler = async () => {
      if (!document.hidden && this.isActive) {
        await this.requestWakeLock();

        const intensiveInterval = setInterval(() => {
          this.performKeepAliveOperations();
        }, 1);

        setTimeout(() => {
          clearInterval(intensiveInterval);
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", this.visibilityChangeHandler);
  }

  private clearKeepAliveInterval(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  private async releaseWakeLock(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
      } catch (e) {}
      this.wakeLock = null;
    }
  }

  private async closeAudioContext(): Promise<void> {
    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }

  private terminateWorker(): void {
    if (this.heartbeatWorker) {
      this.heartbeatWorker.terminate();
      this.heartbeatWorker = null;
    }
  }

  private removeVisibilityHandler(): void {
    if (this.visibilityChangeHandler) {
      document.removeEventListener("visibilitychange", this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
  }
}
