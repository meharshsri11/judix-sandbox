import React from 'react'
import Spinner from './spinner'

const FullScreenSpinner = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
        <Spinner />
        <span>
            {/* TODO: Add Facts */}
        </span>
    </div>
  )
}

export default FullScreenSpinner