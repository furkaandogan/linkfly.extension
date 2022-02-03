import { browser } from "webextension-polyfill-ts";
import { CreateShortLink } from "../../service/linklfyApiClient";
import { GetClickedElementEventMessage } from "../../events";
import { AppConfig } from "../../utils/appConfig";

const MAIN_CONTEXT_MENU_ID = "linkfly_main_context_menu_item";

const Load = () => {
  browser.contextMenus.removeAll();
  if (AppConfig.Load().ContextMenuStatus) {
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
  }
};
export default Load;
