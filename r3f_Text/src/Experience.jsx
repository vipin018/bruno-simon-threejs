
const Experience = () => {
    return (
        <>
            <mesh
                scale={2}
            >
                <boxGeometry />
                <meshStandardMaterial 
                    color={"lime"}
                    castShadow
                />
            </mesh>

            <mesh
                rotation-x={-Math.PI / 2}
                position-y={-1}
                scale-x={10}
                scale-y={10}
            >
                <planeGeometry />
                <meshStandardMaterial
                    color={"ghostwhite"}
                    metalness={0.5}
                    roughness={0.2}
                    receiveShadow
                />
            </mesh>
        </>

    )
}

export default Experience