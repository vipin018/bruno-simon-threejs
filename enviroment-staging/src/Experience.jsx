import { useFrame } from '@react-three/fiber'
import { Sky, Clouds, Stars, ContactShadows, RandomizedLight, AccumulativeShadows, OrbitControls, useHelper, BakeShadows, Environment, Lightformer } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

export default function Experience() {

    const { shadowOpacity, shadowBlur, shadowResolution, far } = useControls("shadow", {
        shadowOpacity: { value: 1.0, min: 0, max: 1 },
        shadowBlur: { value: 6, min: 0, max: 10 },
        shadowResolution: { value: 2048, min: 128, max: 4096 },
        far: { value: 2.5, min: 0, max: 10 },
    })

    const { distance, sunPosition, inclination, azimuth } = useControls("sky", {
        distance: { value: 450, min: 0, max: 1000 },
        sunPosition: { value: [0, 1, 0], min: 0, max: 1000 },
        inclination: { value: 0, min: 0, max: 1000 },
        azimuth: { value: 0.25, min: 0, max: 1000 },
    })

    const directionalLight = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1, 'red')

    const cube = useRef()
    useFrame((state, delta) => {
        if (cube.current) {
            cube.current.rotation.y += (delta * 0.1)
        }
    })

    return <>
        <Perf position="top-left" />

        <ContactShadows
            position={[0, -0.99, 0]}
            scale={10}
            opacity={shadowOpacity}
            blur={shadowBlur}
            resolution={shadowResolution}
            far={far}
            frames={1}
        />

        <OrbitControls makeDefault />

        <Environment
            // background
            preset="lobby"
        />

        {/* Emissive red plane for glowing effect */}
        <mesh
            position={[0, 0, -5]}
            rotation={[0, 0, 0]}
            scale={10}
        >
            <planeGeometry />
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={10} />
        </mesh>

        <directionalLight
            ref={directionalLight}
            position={[4, 3, 3]}
            intensity={3}
            castShadow
        />

        <ambientLight intensity={0.5} />

        <mesh position={[-2, 0, 0]} castShadow>
            <icosahedronGeometry />
            <meshStandardMaterial
                color="gold"
            />
        </mesh>

        <mesh ref={cube} position-x={2} scale={1.5} castShadow>
            <boxGeometry />
            <meshStandardMaterial
                color="lime"
            />
        </mesh>

        <mesh
            position-y={-1}
            rotation-x={-Math.PI * 0.5}
            scale={10}
            receiveShadow>
            <planeGeometry />
            <meshStandardMaterial
                side={THREE.DoubleSide}
                color="powderblue" />
        </mesh>
    </>
}