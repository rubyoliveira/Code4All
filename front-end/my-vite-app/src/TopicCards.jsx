import { useState, useEffect } from 'react'



function TopicCards({title, description}) {

  return (
    <>
        <div className = "topic">
            <p>{title}</p>
            <p>{description}</p>
        </div>
    </>
  )
}

export default TopicCards
