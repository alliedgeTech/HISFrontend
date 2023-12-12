import React from 'react'
import noData from '../../Assets/no-data.svg'
import './EmptyData.css'
function EmptyData() {
  return (
    <img
              className={`withPagination__img empty-image-css`}
              src={noData}
              alt="No data image"
            />
  )
}

export default EmptyData