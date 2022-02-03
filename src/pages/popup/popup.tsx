import React, { useState } from "react";
import AppConfig from "../../utils/appConfig";
import Header from "../../components/header";
import { Tabs, Tab } from "react-bootstrap";

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
        id="status"
        checked={redirectStatus}
      />
      <label className="form-check-label" htmlFor="status">
        Redirect is active
      </label>
    </div>
  );
}

export default Popup;
