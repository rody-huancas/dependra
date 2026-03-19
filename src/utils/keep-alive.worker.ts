/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

let interval: number | null = null;

self.onmessage = (event) => {
  if (event.data === "start") {
    if (interval) return;
    interval = self.setInterval(() => {
      self.postMessage({ type: "heartbeat", timestamp: Date.now(), random: Math.random() });
    }, 100);
  } else if (event.data === "stop") {
    if (interval) {
      self.clearInterval(interval);
      interval = null;
    }
  }
};

export default null;
