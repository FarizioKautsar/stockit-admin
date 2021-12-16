import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">StockIT</a>
        <span className="ml-1">&copy; 2021</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
