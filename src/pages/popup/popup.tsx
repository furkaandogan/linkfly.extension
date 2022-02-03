import React, { useState } from "react";
import AppConfig from "../../utils/appConfig";
import Header from "../../components/header";
import { Tabs, Tab } from "react-bootstrap";
import ContextMenu from "../../components/contexMenu";

import "./popup.scss";

function Popup() {
  return (
    <div className="Popup">
      <Header />

      <Tabs
        defaultActiveKey="collections"
        id="uncontrolled-tab-example"
        className="nav-fill"
      >
        <Tab eventKey="collections" title="Collections">
          Collections
        </Tab>
        <Tab eventKey="setting" title="Settings" className="mt-2 mx-4">
          <form>
            <div className="mb-3">
              <RedirectStatusButton />
              <ContextMenuStatusButton />
            </div>
          </form>
        </Tab>
      </Tabs>
    </div>
  );
}

function RedirectStatusButton() {
  const [redirectStatus, setredirectStatus] = useState(
    AppConfig.RedirectStatus
  );

  return (
    <div className="form-check form-switch">
      <input
        onClick={(e) => setredirectStatus(AppConfig.ChangeRedirectStatus())}
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="redirect-status"
        checked={redirectStatus}
      />
      <label className="form-check-label" htmlFor="redirect-status">
        Redirect is active
      </label>
    </div>
  );
}

function ContextMenuStatusButton() {
  const [contextMenuStatus, setContextMenuStatus] = useState(
    AppConfig.ContextMenuStatus
  );

  return (
    <div className="form-check form-switch">
      <input
        onClick={(e) => {
          setContextMenuStatus(AppConfig.ChangeContextMenuStatus());
          ContextMenu();
        }}
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="context-menu-status"
        checked={contextMenuStatus}
      />
      <label className="form-check-label" htmlFor="context-menu-status">
        Context Menu is active
      </label>
    </div>
  );
}

export default Popup;
