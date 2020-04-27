import { AmbientLight, DirectionalLight, OrthographicCamera } from 'three';

const light = new AmbientLight( 0x3D4143 );
//light.position.set(0, 200, 0)

const spotLight = new DirectionalLight( 0xffffff, 0.5 );
spotLight.position.set( 0, 1500, 0 );
spotLight.target.position.set(0, 0, 0);
//spotLight.angle = Math.PI / 4
//spotLight.penumbra = 0.05
//spotLight.decay = 2
//spotLight.distance = 2000
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024
// spotLight.shadow.mapSize.height = 2014
// spotLight.shadow.camera.near = 1000
// spotLight.shadow.camera.far = 2000
let d = 300;
spotLight.shadow.camera = new OrthographicCamera( -d, d, d, -d,  500, 1600 );
spotLight.shadow.bias = 0.0001;
spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 512;

// Enable the helper to show light axis and add it to the export
//const lightHelper = new SpotLightHelper( spotLight );

export default [light, spotLight]