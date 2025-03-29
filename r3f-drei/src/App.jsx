import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from './Experience'
import { OrbitControls } from '@react-three/drei'

const App = () => {
  return (
    <>
      <Canvas>
        <OrbitControls makeDefault/>
        <ambientLight intensity={0.5} />  
        <directionalLight
          position={[1, 2, 3]}
          intensity={1.5}
        />
        <Experience />
      </Canvas>
    </>
  )
}

export default App