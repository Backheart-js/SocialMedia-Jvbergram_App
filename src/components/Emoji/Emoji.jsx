import React from "react";
import { EMOJI } from "~/constants/emoji";
import "./Emoji.scss";

function DropdownEmoji({ setValue }) {
  const handleOnclick = (icon) => {
    setValue((prev) => prev + icon);
  };
  return (
    <div className="emoji__wrapper">
      {EMOJI.map((emoji, index) => (
        <div className="emoji-box" key={index}>
          <p className="mb-2 text-[13px] font-semibold text-gray-600">
            {emoji.label}
          </p>
          <div className="grid md:grid-cols-7 grid-cols-5 gap-1">
            {emoji.icons.map((icon, index) => (
              <button
                className="emoji-btn col-span-1 dark:hover:bg-[#121212]"
                key={index}
                onClick={() => handleOnclick(icon)}
              >
                <span className="text-3xl">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DropdownEmoji;
