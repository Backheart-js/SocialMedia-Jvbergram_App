import React from "react";
import Tippy from "@tippyjs/react/headless"; // different import path!

import { Wrapper as DropdownWrapper } from "~/components/Dropdown/Wrapper";

function Dropdown({ children, content, ...props }) {
  return (
    <Tippy
      {...props}
      render={(attrs) => (
        <div tabIndex="-1" {...attrs}>
          <DropdownWrapper>{content}</DropdownWrapper>
        </div>
      )}
    >
      {children}
    </Tippy>
  );
}

export default Dropdown;
