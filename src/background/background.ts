import { browser } from "webextension-polyfill-ts";
import axios from "axios";
import { AppConfig } from "../utils/appConfig";
import {
  CreateShortLink,
  CreateShortLinkWithFocusElement,
} from "../service/linklfyApiClient";
import {
  ElementFocusEventMessage,
  EventMessage,
  GetClickedElementEventMessage,
  SendClickedElementEventMessage,
} from "../events";

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

const MAIN_CONTEXT_MENU_ID = "linkfly_main_context_menu_item";
browser.contextMenus.removeAll();

browser.contextMenus.create({
  id: MAIN_CONTEXT_MENU_ID,
  enabled: true,
  title: "share to linkfly",
  contexts: ["all"],
  visible: true,
});
browser.contextMenus.create({
  id: "linkfly_short_link_context_menu_item",
  parentId: MAIN_CONTEXT_MENU_ID,
  enabled: true,
  title: "generate the short link of the page",
  visible: true,
  contexts: ["all"],
  onclick: (info, tab) => {
    if (!info.pageUrl) {
      return;
    }
    CreateShortLink(info.pageUrl).then((res) => {
      alert(res.data.Linkly.Hash);
    });
  },
});
browser.contextMenus.create({
  id: "linkfly_short_element_context_menu_item",
  parentId: MAIN_CONTEXT_MENU_ID,
  enabled: true,
  title: "generate the short link of the focus element",
  visible: true,
  contexts: ["all"],
  onclick: (info, tab) => {
    if (!tab.id) {
      return;
    }
    browser.tabs.sendMessage(tab.id, new GetClickedElementEventMessage(), {
      frameId: info.frameId,
    });
  },
});

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
            // TODO: content js içine load mesaj atıp tab url yüklenecek yüklenme success olunca focus yapılacak. #FF Refactor
            setTimeout(() => {
              browser.tabs.sendMessage(
                tab.id,
                new ElementFocusEventMessage(
                  res.data.Linkly.FocusElement.XPath
                ),
                {}
              );
            }, 1000);
          }
        });
    });
  },
  { urls: ["*://linkfly0.herokuapp.com/*"] },
  ["blocking"]
);
