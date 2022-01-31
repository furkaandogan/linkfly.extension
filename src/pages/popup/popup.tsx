import { browser } from "webextension-polyfill-ts";
import React from "react";

import "./popup.scss";

function Popup() {
  return (
    <div className="Popup mt-5 mx-4 text-center">
      Popup!
      <div className="mb-3">
        <SettingsButton />
      </div>
      <button
        type="button"
        className="btn btn-link btn-sm"
        onClick={(e) => {
          browser.tabs.getCurrent().then((tab) => {
            browser.tabs
              .executeScript(tab.id, {
                code: "window.getSelection().toString();",
              })
              .then((selection) => {
                document.getElementById("output").innerHTML = selection[0];
              });
          });
        }}
      >
        Get Selected
      </button>
      <div id="output"></div>
    </div>
  );
}

function SettingsButton() {
  return (
    <button
      type="button"
      className="btn btn-link btn-sm"
      onClick={(e) => {
        e.preventDefault();
        browser.runtime.openOptionsPage();
      }}
    >
      Settings
    </button>
  );
}

export default Popup;
