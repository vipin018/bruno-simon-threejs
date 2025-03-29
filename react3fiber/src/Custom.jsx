import React from 'react'
import * as THREE from 'three'
const Custom = () => {

    const vertexCount = 10 * 3;
    const position = new Float32Array(vertexCount * 3)

    for (let i = 0; i < vertexCount * 3; i++) {
        position[i] = (Math.random() - 0.5) * 3
    }

    return (

        <>
            {/* CUSTOM GEOMETRY */}
            <mesh>
                <bufferGeometry>
                    <bufferAttribute
                        attach={"attributes.position"}
                        count={vertexCount}
                        itemSize={3}
                        array={position}
                        usage={THREE.DynamicDrawUsage}
                    />
                </bufferGeometry>
                <meshBasicMaterial 
                color={"hotpink"}
                />
            </mesh>
        </>
    )
}

export default Custom