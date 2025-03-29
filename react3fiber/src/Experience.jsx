import { React, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Custom from './Custom'
const Experience = () => {

    const cubeRef = useRef()
    const sphereRef = useRef()
    const groupRef = useRef()
    useFrame((state, delta) => {
           cubeRef.current.rotation.y += delta
        //    sphereRef.current.rotation.z += delta
        // groupRef.current.rotation.y += delta
    })


    return (
        <>
            <group
                position={[1, 0, 0]}
                ref={groupRef}
            >
                <mesh
                    position={[-2, 0, 0]}
                    scale={1.5}
                    ref={sphereRef}
                >
                    <sphereGeometry
                        args={[1, 32, 32]}
                    />
                    <meshStandardMaterial
                        color={"#aafffda"}
                        wireframe={false}
                    />
                </mesh>
                <Custom />

                <mesh
                    ref={cubeRef}
                    position={[2, 0, 0]}
                    scale={2}
                >
                    <boxGeometry />
                    <meshStandardMaterial
                        color={"#ffaaff"} />
                </mesh>
            </group>
            <mesh
                position={[0, -1.5, 0]}
                scale={1.5}
                rotation={[-Math.PI * 0.5, 0, 0]}
            >
                <planeGeometry
                    args={[10, 10, 56, 56]}
                />
                <meshStandardMaterial
                    color={"lime"}
                   
                     />
            </mesh>
        </>
    )
}

export default Experience