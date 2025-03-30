import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './Experience'

const App = () => {
  return (
   <Canvas>
    <OrbitControls />
    <ambientLight />
    <directionalLight position={[1, 2, 3]} />
    <Experience />
   </Canvas>
  )
}

export default App