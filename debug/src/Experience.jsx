import React from 'react'

const Experience = () => {
    return (
        <>
            <group>
                <mesh
                    scale={1.5}
                    position={[-2, 0, 0]}
                >
                    <boxGeometry />
                    <meshStandardMaterial
                        color="navy"
                    />
                </mesh>

                <mesh position={[2, 0, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial 
                    color="teal" />
                </mesh>
            </group>
            <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="mintcream"
                />
            </mesh>
        </>
    )
}

export default Experience