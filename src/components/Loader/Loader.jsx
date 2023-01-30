import React from 'react'
import './Loader.scss'

function Loader({ type, display, ...props }) {
  const TypeLoader = type

  return display && (
    <div className="loader-overlay absolute flex justify-center items-center inset-0">
        <TypeLoader
            {...props}
        />
    </div>
  )
}

export default Loader