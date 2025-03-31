import React from 'react'
import {useLoader} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
const Model = () => {
    const modell = useLoader(GLTFLoader, './FlightHelmet/glTF/FlightHelmet.gltf',
        (loader) => {
            const dracoLoader = new DRACOLoader()
            dracoLoader.setDecoderPath('./draco/')
            loader.setDRACOLoader(dracoLoader)
        }
    )


    return (
        <primitive object={modell.scene}
        scale={1}
        position={[0, 0, 0]}
        />
    )
}

export default Model