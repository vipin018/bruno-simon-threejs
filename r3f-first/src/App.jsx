import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import Experience from './Experience'
const App = () => {
  return (
    <Canvas>

      <ambientLight intensity={1} />
      <directionalLight
        position={[1, 2, 3]}
        intensity={0.5}
      />

      <OrbitControls />
      <Stats />
      <Experience />
    </Canvas>
  )
}

export default App