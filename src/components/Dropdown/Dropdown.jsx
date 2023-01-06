import React from "react";
import Tippy from "@tippyjs/react/headless"; // different import path!
import PropTypes from 'prop-types';

import { Wrapper as DropdownWrapper } from "~/components/Dropdown/Wrapper";

function Dropdown({ children, className, content, ...props }) {
  return (
    <Tippy
      {...props}
      render={(attrs) => (
        <div tabIndex="-1" className={className} {...attrs}>
          <DropdownWrapper>{content}</DropdownWrapper>
        </div>
      )}
    >
      {children}
    </Tippy>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  content: PropTypes.node.isRequired
}

export default Dropdown;
