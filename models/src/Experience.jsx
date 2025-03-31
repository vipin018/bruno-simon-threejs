import React from 'react'
import { Suspense } from 'react'
import Model from './Model'
import { Hamburger } from './Hamburger'
const Experience = () => {

    return (
        <>
            <Suspense>
                <Hamburger 
                scale={0.5}
                />
            </Suspense>

        </>
    )
}

export default Experience