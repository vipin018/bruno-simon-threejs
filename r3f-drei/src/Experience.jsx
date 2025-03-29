import React, { useRef } from 'react'
import { Html, PivotControls, TransformControls, } from '@react-three/drei'
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
                            occlude = {sphereref}
                            
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
                <meshStandardMaterial
                    color={"skyblue"}
                />
            </mesh>

        </>
    )
}

export default Experience