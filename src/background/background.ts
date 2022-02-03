import { browser } from "webextension-polyfill-ts";
import axios from "axios";
import { AppConfig } from "../utils/appConfig";
import ContextMenu from "../components/contexMenu";
import { CreateShortLinkWithFocusElement } from "../service/linklfyApiClient";
import {
  ElementFocusEventMessage,
  EventMessage,
  SendClickedElementEventMessage,
} from "../events";

// import "images/icon-16.png";
// import "images/icon-48.png";
// import "images/icon-128.png";

const focusElements: any = {};

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    return browser.tabs.create({
      url: browser.runtime.getURL("welcome.html"),
    });
  }
});

ContextMenu();

browser.runtime.onMessage.addListener((message: EventMessage<any>, sender) => {
  if (message.Type === SendClickedElementEventMessage.TYPE) {
    if (sender.tab === undefined || sender.tab.url === undefined) {
      return;
    }
    CreateShortLinkWithFocusElement(
      sender.tab.url,
      (message as SendClickedElementEventMessage).Data.XPath
    ).then((res) => {
      alert(res.data.Linkly.Hash);
      console.log(res.data);
    });
  }
});

browser.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "complete") {
    if (!focusElements[tabId]) {
      return;
    }
    browser.tabs.sendMessage(
      tabId,
      new ElementFocusEventMessage(focusElements[tabId].xpath),
      {}
    );
    delete focusElements[tabId];
    console.log(focusElements);
  }
});

browser.webRequest.onBeforeRequest.addListener(
  (request) => {
    if (
      !AppConfig.Load().RedirectStatus ||
      !(request.type === "main_frame" && request.method === "GET")
    ) {
      return;
    }
    axios.get(request.url).then((res) => {
      browser.tabs
        .update({
          url: res.data.Linkly.Uri.FullUrl,
        })
        .then((tab) => {
          if (tab.id === undefined) {
            return;
          }
          if (res.data.Linkly.FocusElement) {
            focusElements[tab.id] = {
              xpath: res.data.Linkly.FocusElement.XPath,
            };
          }
        });
    });
  },
  { urls: ["*://linkfly0.herokuapp.com/*"] },
  ["blocking"]
);
