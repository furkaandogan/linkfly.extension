import { browser } from "webextension-polyfill-ts";
import {
  ElementFocusEventMessage,
  EventMessage,
  GetClickedElementEventMessage,
  SendClickedElementEventMessage,
} from "../events";
import { getElementByXPath, getXPath } from "../utils/nodeElement";

console.log("🔥 Hello from linkfly Extension! 🔥");

var clickedElement: any = undefined;

document.addEventListener(
  "contextmenu",
  function (event) {
    clickedElement = event.target;
  },
  true
);

browser.runtime.onMessage.addListener((message: EventMessage<any>, sender) => {
  if (message.Type === GetClickedElementEventMessage.TYPE) {
    browser.runtime.sendMessage(
      sender.id,
      new SendClickedElementEventMessage(
        `HTML/${getXPath(clickedElement)}`,
        clickedElement
      )
    );
  } else if (message.Type === ElementFocusEventMessage.TYPE) {
    var element = getElementByXPath(
      (message as ElementFocusEventMessage).Data.XPath ?? ""
    );
    if (element === undefined) {
      return;
    }
    element.style.background = "yellow";
    element.scrollIntoView();
  }
});
