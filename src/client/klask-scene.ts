import { DEPTH, WIDTH, WALL_WIDTH, WALL_HEIGHT, EXTRUSION_DEPTH, CAMERA_Z, CAMERA_Y, SCALE, HOLE_RADIUS, BALL_RADIUS, STICK_HEIGHT } from './../config/constants';
import { WebGLRenderer, PerspectiveCamera, Scene, PCFSoftShadowMap, sRGBEncoding, Color, PlaneBufferGeometry, MeshPhongMaterial, Mesh, AxesHelper, Vector3, Vector2, Raycaster, Object3D, Intersection, SphereGeometry, CylinderGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as constants from './constants';
import lights from './light';
import { KlaskTable } from './klask-table';
import * as OIMO from 'oimo';


export class KlaskScene {

    private table: Object3D;
    private ball: Mesh;
    private stickPlayer1: Mesh;
    private stickPlayer2: Mesh;
    private positions;
    private camera: PerspectiveCamera;
    private magnet1: Mesh;
    private magnet2: Mesh;
    private magnet3: Mesh;
    private world;

    private ray: Raycaster;
    private mouse;

    private stickBody;
    private ballBody;

    constructor() {
        this.ball = null;
        this.stickPlayer1 = null;
        this.stickPlayer2 = null;
        this.positions = null;
        this.camera = null;
        this.magnet1 = null;
        this.magnet2 = null;
        this.magnet3 = null;

        this.ray = new Raycaster();
        this.mouse = new Vector2();
    }

    createScene() {
        // Renderer
        let container = document.getElementById('klask-container');
        container.addEventListener('mousemove', e => this.rayTest(e, container.offsetTop), false);

        let renderer = new WebGLRenderer({ alpha: true, antialias: true });
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
        container.appendChild(renderer.domElement);

        if (window.devicePixelRatio > 1) {
            renderer.setPixelRatio(window.devicePixelRatio * 0.5);
        }
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.outputEncoding = sRGBEncoding;

        let resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', resize);

        // Scene
        let scene = new Scene();
        scene.background = new Color(0xb0b0b0);

        // Add the light(s)
        scene.add(...lights);

        // Camera
        this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100 * SCALE);
        this.camera.position.z = CAMERA_Z;
        this.camera.position.y = CAMERA_Y;
        this.camera.lookAt(new Vector3(0, 0, DEPTH / 10));
        resize();

        // Rendering function
        let render = () => {
            renderer.render(scene, this.camera);
        }

        if (constants.DEBUG) {
            // Add the orbital control to move the camera
            var controls = new OrbitControls(this.camera, renderer.domElement);
            controls.addEventListener('change', render);
            controls.minDistance = 5;
            controls.maxDistance = 500;
            controls.enablePan = false;

            // Add the axis
            var axes = new AxesHelper(5);
            scene.add(axes);
        }

        // Table
        const klastTable = new KlaskTable(scene);
        this.table = klastTable.createTable();
        this.ball = klastTable.createBall();
        this.stickPlayer1 = klastTable.createStick(true);
        this.stickPlayer2 = klastTable.createStick(false);
        //this.magnet1 = table.createMagnet();
        //this.magnet2 = table.createMagnet();
        //this.magnet3 = table.createMagnet();
        //this.resetMagnetsPositions();

        // Plan
        var planMaterial = new MeshPhongMaterial({ color: 0x808080, dithering: true });
        var planGeometry = new PlaneBufferGeometry(50, 50);
        var planMesh = new Mesh(planGeometry, planMaterial);
        planMesh.position.set(0, -1, 0);
        planMesh.rotation.x = -Math.PI * 0.5;
        planMesh.receiveShadow = true;
        scene.add(planMesh);

        // TODO: Share a constant with the back
        const factor = 2;

        // TODO: Move this to the backend
        this.initPhysics();

        const animate = () => {
            requestAnimationFrame(animate);

            // if (this.positions) {
            //     this.ball.position.x = this.positions.ball.x / factor;
            //     this.ball.position.z = this.positions.ball.y / factor;

            //     this.stickPlayer1.position.x = this.positions.stick1.x / factor;
            //     this.stickPlayer1.position.z = this.positions.stick1.y / factor;

            //     this.stickPlayer2.position.x = this.positions.stick2.x / factor;
            //     this.stickPlayer2.position.z = this.positions.stick2.y / factor;
            // }

            this.updatePhysics();
            render();
        }

        animate();
    }

    setPositions(data) {
        this.positions = data;
    }

    setCameraPosition(playerNumber) {
        this.camera.position.set(0, 8, playerNumber === 1 ? CAMERA_Z : -CAMERA_Z);
        this.camera.lookAt(new Vector3(0, 0, 0));
    }

    resetMagnetsPositions() {
        this.magnet1.position.x = - 14 / 4;
        this.magnet1.position.z = 0;
        this.magnet2.position.x = 0;
        this.magnet2.position.z = 0;
        this.magnet3.position.x = 14 / 4;
        this.magnet3.position.z = 0;
    }

    initPhysics() {
        // Create the Oimo world
        this.world = new OIMO.World({
            info: true,
            worldscale: 100
        });
        this.world.gravity = new OIMO.Vec3(0, -10, 0);

        // The Bit of a collision group
        let group1 = 1 << 0;  // 00000000 00000000 00000000 00000001
        let group2 = 1 << 1;  // 00000000 00000000 00000000 00000010
        let group3 = 1 << 2;  // 00000000 00000000 00000000 00000100
        let all = 0xffffffff; // 11111111 11111111 11111111 11111111

        // Is all the physics setting for rigidbody
        let physicsConfig = [
            1, // The density of the shape.
            0.2, // The coefficient of friction of the shape.
            0.2, // The coefficient of restitution of the shape.
            1, // The bits of the collision groups to which the shape belongs.
            all // The bits of the collision groups with which the shape collides.
        ];

        // Add the ground
        physicsConfig[2] = 0.8;
        this.world.add({ size: [WIDTH, EXTRUSION_DEPTH * 2, DEPTH], pos: [0,  EXTRUSION_DEPTH / 2, 0], config: physicsConfig });
        
        physicsConfig[2] = 0.5;
        // Left wall
        this.world.add({ size: [WALL_WIDTH, WALL_HEIGHT, DEPTH], pos: [- WIDTH / 2 - WALL_WIDTH / 2, WALL_HEIGHT / 2, 0], config: physicsConfig, name: 'left-wall' });
        // Right wall
        this.world.add({ size: [WALL_WIDTH, WALL_HEIGHT, DEPTH], pos: [WIDTH / 2 + WALL_WIDTH / 2, WALL_HEIGHT / 2, 0], config: physicsConfig, name: 'right-wall' });
        // Front wall
        this.world.add({ size: [WIDTH, WALL_HEIGHT, WALL_WIDTH], pos: [0, WALL_HEIGHT / 2, DEPTH / 2 + WALL_WIDTH / 2], config: physicsConfig, name: 'front-wall' });
        // Rear wall
        this.world.add({ size: [WIDTH, WALL_HEIGHT, WALL_WIDTH], pos: [0, WALL_HEIGHT / 2, -DEPTH / 2 - WALL_WIDTH / 2], config: physicsConfig, name: 'read-wall' });

        // Add the stick 0.3        
        let stick1Geometry = <CylinderGeometry>this.stickPlayer1.geometry;
        physicsConfig[2] = 0.5;
        physicsConfig[3] = group1;
        this.stickBody = this.world.add({
            type: 'cylinder',
            size: [stick1Geometry.parameters.radiusTop, stick1Geometry.parameters.height, stick1Geometry.parameters.radiusBottom],
            pos: [0, STICK_HEIGHT / 2 + EXTRUSION_DEPTH / 2, DEPTH / 4],
            rot: [0, 0, 0],
            move: true,
            noSleep: true,
            config: physicsConfig,
            name: 'stickPlayer1',
            kinematic: true
        });
        console.log('stick gemoetry', stick1Geometry.parameters);
        console.log('stick position', this.stickPlayer1.position);

        // Add the ball
        let sphereGeometry = <SphereGeometry>this.ball.geometry;
        physicsConfig[2] = 0.5;
        physicsConfig[3] = group2;
        this.ballBody = this.world.add({
            type: 'sphere',
            size: [sphereGeometry.parameters.radius],
            pos: [0, BALL_RADIUS + EXTRUSION_DEPTH, 0],
            move: true,
            config: physicsConfig,
            name: 'ball'
        });
        console.log('ball radius', sphereGeometry.parameters.radius);
        console.log('ball position', this.ball.position);
    }

    updatePhysics() {
        if (this.world === null) {
            return;
        }

        this.world.step();

        // apply new position on mesh
        //this.stickBody.setPosition(this.stickPlayer1.position);
        this.stickPlayer1.position.copy(this.stickBody.getPosition());

        this.ballBody.linearVelocity.y = 0;

        this.ball.position.copy(this.ballBody.getPosition());
        this.ball.quaternion.copy(this.ballBody.getQuaternion());

        if (this.world.checkContact('stickPlayer1', 'ball')) {
            console.log(this.ball.position);
        }
    }

    rayTest(e: any, top: number) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - ((e.clientY) / (window.innerHeight) + (top / window.innerHeight)) * 2 + 1;

        this.ray.setFromCamera(this.mouse, this.camera);
        var intersects: Intersection[] = this.ray.intersectObjects(this.table.children, true);
        if (intersects.length) {
            // The wall might be part of the intersection, only the ground is needed
            let ground = intersects.find(i => i.object.name === "ground" || i.object.name === "underground");
            if (ground) {
                let position = ground.point.add(new Vector3(0, STICK_HEIGHT / 2 + EXTRUSION_DEPTH / 2, 0));

                // Update stick position
                //this.stickPlayer1.position.copy(position);
                this.stickBody.setPosition(position);
            }
        }
    }
}