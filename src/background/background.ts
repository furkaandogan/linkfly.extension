import { browser } from "webextension-polyfill-ts";
import axios from "axios";

// import "images/icon-16.png";
// import "images/icon-48.png";
// import "images/icon-128.png";

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    return browser.tabs.create({
      url: browser.runtime.getURL("welcome.html"),
    });
  }
});

browser.webRequest.onBeforeRequest.addListener(
  (request) => {
    if (request.type === "main_frame" && request.method === "GET") {
      axios.get(request.url).then((res) => {
        browser.tabs.update({
          url: res.data.Linkly.Uri.FullUrl,
        });
        // browser.tabs.create({
        //     url: res.data.Linkly.Uri.FullUrl
        // })
      });
    }
  },
  { urls: ["*://linkfly0.herokuapp.com/*"] },
  ["blocking"]
);
