"use strict"

import { AmbientLight, SpotLight, SpotLightHelper } from 'three'

const light = new AmbientLight( 0x404040 )
light.position.set(0, 2, 0)

const spotLight = new SpotLight( 0xffffff, 1 )
spotLight.position.set( 0, 15, 0 )
spotLight.angle = Math.PI / 4
spotLight.penumbra = 0.05
spotLight.decay = 2
spotLight.distance = 200
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 256
spotLight.shadow.mapSize.height = 256
spotLight.shadow.camera.near = 10
spotLight.shadow.camera.far = 20

// Enable the helper to show light axis and add it to the export
//const lightHelper = new SpotLightHelper( spotLight );

export default [light, spotLight]