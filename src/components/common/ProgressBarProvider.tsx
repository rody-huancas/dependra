"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export const ProgressBarProvider = () => {
  return (
    <ProgressBar
      height="4px"
      color="#fca311"
      options={{ showSpinner: false }}
      shallowRouting={true}
      startPosition={0.3}
      delay={0}
      stopDelay={0}
    />
  );
};
