import { browser } from "webextension-polyfill-ts";
import {
  ElementFocusEventMessage,
  EventMessage,
  GetClickedElementEventMessage,
  SendClickedElementEventMessage,
} from "../events";

console.log("🔥 Hello from linkfly Extension! 🔥");

var clickedElement: any = undefined;

function getPathTo(element: any): any {
  if (element.id !== "") return 'id("' + element.id + '")';
  if (element === document.body) return element.tagName;

  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element)
      return (
        getPathTo(element.parentNode) +
        "/" +
        element.tagName +
        "[" +
        (ix + 1) +
        "]"
      );
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}
function getElementByXpath(path: string): any {
  if (path === "") {
    return undefined;
  }
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

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
        `HTML/${getPathTo(clickedElement)}`,
        clickedElement
      )
    );
  } else if (message.Type === ElementFocusEventMessage.TYPE) {
    var element = getElementByXpath(
      (message as ElementFocusEventMessage).Data.XPath ?? ""
    );
    if (element === undefined) {
      return;
    }
    element.style.background = "yellow";
    element.scrollIntoView();
  }
});
