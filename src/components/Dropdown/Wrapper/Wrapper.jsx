import React from 'react'
import PropTypes from 'prop-types'

import './Wrapper.scss'

function Wrapper({ children }) {
  return (
    <div className="dropdown__wrapper dark:bg-[#262626]">
        {children}
    </div>
  )
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired
}

export default Wrapper