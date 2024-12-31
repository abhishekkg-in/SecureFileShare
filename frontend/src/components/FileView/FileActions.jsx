import React from 'react'

const FileActions = ( {user, file}) => {
  if(user && (user.role === 'admin' || user.role === 'regular')){
    return (
        <div>FileActions</div>
    )
  }  
  return (
    <div>FileActions</div>
  )
}

export default FileActions