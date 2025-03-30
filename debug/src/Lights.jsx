import React from 'react'

const Lights = () => {
    return (
        <>
        <ambientLight />
      <directionalLight position={[0, 2, 3]} />
      </>
    )
}

export default Lights