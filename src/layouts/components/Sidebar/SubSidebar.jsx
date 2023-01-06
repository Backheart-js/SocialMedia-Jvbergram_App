import React from 'react'
import PropTypes from 'prop-types';
import SearchSubSidebar from './SearchSubSidebar';
import NotiSubSidebar from './NotiSubSidebar';

function SubSidebar({ type }) {
  return (
    <aside id="subSidebar">
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

export default SubSidebar