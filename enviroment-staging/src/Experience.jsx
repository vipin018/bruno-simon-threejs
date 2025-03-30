import { useFrame } from '@react-three/fiber'
import { OrbitControls, useHelper, BakeShadows } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
export default function Experience() {
    const directionalLight = useRef()
    const helper = useHelper(directionalLight, THREE.DirectionalLightHelper, 1, 'red')


    const cube = useRef()
    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
    })

    return <>

        <BakeShadows />
        <Perf
            position="top-left"
        />

        <OrbitControls makeDefault />

        <directionalLight
            ref={directionalLight}
            position={[1, 2, 3]}
            intensity={4.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5 * 2}
            shadow-camera-far={10}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}


        />
        <ambientLight intensity={1.5} />

        <mesh position={[- 2, 0, 0]} castShadow>
            <icosahedronGeometry />
            <meshStandardMaterial
                color="gold" />
        </mesh>

        <mesh ref={cube}
            position-x={2}
            scale={1.5}
            castShadow>
            <boxGeometry />
            <meshStandardMaterial
                color="lime" />
        </mesh>

        <mesh position-y={- 1}
            rotation-x={- Math.PI * 0.5}
            scale={10}
            receiveShadow>
            <planeGeometry />
            <meshStandardMaterial
                side={THREE.DoubleSide}
                color="powderblue" />
        </mesh>

    </>
}