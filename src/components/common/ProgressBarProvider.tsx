"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export const ProgressBarProvider = () => {
  return (
    <ProgressBar
      color="#fca311"
      height="4px"
      shallowRouting={true}
      options={{ showSpinner: false }}
    />
  );
};
