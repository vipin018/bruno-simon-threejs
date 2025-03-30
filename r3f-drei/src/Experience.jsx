import React, { useRef } from 'react'
import { MeshReflectorMaterial, MeshRefractionMaterial, Html, PivotControls, TransformControls } from '@react-three/drei'
const Experience = () => {

    const cuberef = useRef();
    const sphereref = useRef();
    return (
        <>
            <group
                position={[0, 0, 0]}
            >
                <mesh
                    position={[-2, 0, 0]}
                    scale={1.5}
                    ref={cuberef}
                >
                    <boxGeometry />
                    <meshStandardMaterial
                        color={"mediumpurple"}
                    />
                </mesh>
                <TransformControls
                    object={cuberef}
                    mode='rotate'
                    scale={0.5}
                />

                <PivotControls
                    anchor={[0, 0, 0]}
                    depthTest={false}
                    axisColors={["red", "yellow", "blue"]}
                    scale={1.2}
                    lineWidth={1}
                >

                    <mesh
                        position={[2, 0, 0]}
                        ref={sphereref}
                    >
                        <sphereGeometry />
                        <meshStandardMaterial
                            color={"lime"}
                        />
                        <Html
                            wrapperClass='sphere-html'
                            position={[1, 1, 0]}
                            center
                            occlude={sphereref}

                        >
                            sphere
                        </Html>
                    </mesh>
                </PivotControls>

            </group >

            <mesh
                position={[0, -1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[10, 10]} />
                <MeshReflectorMaterial
                    color={"white"}
                    resolution={512}
                    blur={[1000, 1000]}
                    mixBlur={1}
                    mixStrength={2}
                    metalness={0.5}
                    roughness={0.2}
                    mirror={0.5}
                />
            </mesh>
        </>
    )
}

export default Experience