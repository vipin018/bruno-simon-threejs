import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './Experience' 

const App = () => {
  return (
    <Canvas 
    camera={{
      position: [2, 3, 3],
      fov: 75,
      near: 0.1,
      far: 1000,
    }}  
    shadows
    >
      <OrbitControls /> 
      <ambientLight />
      <directionalLight position={[1,2,3]}
       castShadow 
       shadow-mapSize={[1024, 1024]}
       shadow-radius={10}
      />
        <Experience />
    </Canvas>
  )
}

export default App