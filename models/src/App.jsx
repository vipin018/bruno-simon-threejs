import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import Experience from './Experience.jsx'
const App = () => {
  return (
    <Canvas>
      <OrbitControls />
      <Stage>
        <Experience />
      </Stage>
      {/* <Perf /> */}
    </Canvas>
  )
}

export default App