import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import Experience from './Experience'
import Lights from './Lights'

const App = () => {
  return (
    <Canvas
      flat={true}
    >

      <OrbitControls />
      <Lights />
      <Experience />
      <Stats />
    </Canvas>
  )
}

export default App