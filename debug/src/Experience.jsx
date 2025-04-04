import React from 'react'
import { useControls } from 'leva'
const Experience = () => {

    const { position, scale, rotation } = useControls({
        position: {
            value: [-2, 0, 0],
            min: -10,
            max: 10,
            step: 0.1
        },
        scale: {
            value: 1.5,
            min: 0,
            max: 5,
            step: 0.01
        },
        rotation: {
            value: [Math.PI / 2, 0, 0],
            min: 0,
            max: Math.PI,
            step: 0.01
        },
        Boxcolor: {
            value: "#ff0000",

        },
        Spherecolor: {
            value: "#00ff00",
        }
    })

    return (
        <>
            
            <group>
                <mesh
                    scale={1.5}
                    position={[2, 0, 0]}
                    rotation={rotation}
                >
                    <boxGeometry />
                    <meshStandardMaterial
                        color="salmon"
                    />
                </mesh>

                <mesh
                    position={position}
                    scale={scale}
                >
                    <sphereGeometry />
                    <meshStandardMaterial
                        color="aquamarine" />
                </mesh>
            </group>
            <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="azure"
                />
            </mesh>
        </>
    )
}

export default Experience