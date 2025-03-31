import React from 'react'

const Experience = () => {
    return (
        <>
           <group position={[0, 0, 0]}>
           <mesh position={[-2, 0, 0]} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial 
                color="cornflowerblue"
                />
            </mesh>
            <mesh position={[2, 0, 0]}>
                <icosahedronGeometry />
                <meshStandardMaterial
                color="palevioletred"
                />
            </mesh>
           </group>
           
        </>
    )
}

export default Experience