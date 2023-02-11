import React from 'react'
import { CHECK_URL_REGEX } from '~/constants/Regex';

function checklink(text) {
    return text.split(CHECK_URL_REGEX).map((word, i) =>
    CHECK_URL_REGEX.test(word) ? (
      <a className='font-medium text-blue-primary hover:text-blue-bold text-sm hover:underline' key={i} href={word.startsWith("http") ? word : `http://${word}`} target="_blank" rel="noopener noreferrer">
        {word}
      </a>
    ) : (
      word
    )
  );
}

export default checklink