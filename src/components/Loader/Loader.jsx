import React from 'react'
import './Loader.scss'

function Loader({ Type, display, ...props }) {
  return display && (
    <div className="loader-overlay absolute flex justify-center items-center inset-0">
        <Type
            {...props}
        />
    </div>
  )
}

export default Loader