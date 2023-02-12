import React, { forwardRef } from 'react'
import PropTypes from 'prop-types';
import SearchSubSidebar from './SearchSubSidebar';
import NotiSubSidebar from './NotiSubSidebar';

function SubSidebar({ subRef, type }) {
  return (
    <aside ref={subRef} id="subSidebar" className='bg-white dark:bg-black'>
        {
          type === 'search' ? 
          <>
            <SearchSubSidebar />
          </> 
          :
          <>
            <NotiSubSidebar />
          </>
        }
    </aside>
  )
}

SubSidebar.propTypes = {
  type: PropTypes.string.isRequired
}

export default forwardRef(SubSidebar)