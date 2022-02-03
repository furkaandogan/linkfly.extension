import axios from "axios";

export function CreateShortLink(url: string) {
  return axios.post("https://linkfly0.herokuapp.com/", {
    link: url,
  });
}

export function CreateShortLinkWithFocusElement(url: string, xpath: string) {
  return axios.post("https://linkfly0.herokuapp.com/focus-element", {
    link: url,
    xpath: xpath,
  });
}
