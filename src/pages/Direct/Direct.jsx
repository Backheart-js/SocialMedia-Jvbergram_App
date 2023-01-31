import React from 'react';
import "./Direct.scss"
import DirectRoom from './DirectRoom/DirectRoom';
import DirectSidebar from './DirectSidebar/DirectSidebar';

function Direct() {
  return (
    <div className='direct__wrapper'>
      <div className="direct__box lg:max-w-[935px]">
        <DirectSidebar />
        <DirectRoom />
      </div>
    </div>
  )
}

export default Direct