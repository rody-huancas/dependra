import { REGEX_GITHUB_URL } from "@/config/constants";

export const validateGithubUrl = (input: string): boolean => {
  return REGEX_GITHUB_URL.test(input);
};

export const isEmptyUrl = (url: string): boolean => {
  return url.trim() === "";
};

export const isValidUrlInput = (url: string): boolean => {
  return isEmptyUrl(url) || validateGithubUrl(url);
};
