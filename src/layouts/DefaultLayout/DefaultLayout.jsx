import React from "react";
import PropTypes from "prop-types";
import "./DefaultLayout.scss";
import Sidebar from "../components/Sidebar";

function DefaultLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main id="content">
        <div className="pt-8 mx-auto w-[820px]">{children}</div>
      </main>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
