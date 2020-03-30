"use strict"

import { WebGLRenderer, PerspectiveCamera, Scene, PCFSoftShadowMap, sRGBEncoding, Color, PlaneBufferGeometry, MeshPhongMaterial, Mesh, AxesHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import lights from './light'
import KlaskTable from './klask-table'

class KlaskScene {

    constructor() {
        this.ball = null
        this.stickPlayer1 = null
        this.stickPlayer2 = null
        this.positions = null
    }

    createScene() {
        // Renderer
        const container = document.getElementById('klask-container')
        const renderer = new WebGLRenderer({ alpha: true, antialias: true })
        container.appendChild(renderer.domElement)

        if (window.devicePixelRatio > 1) {
            renderer.setPixelRatio(window.devicePixelRatio * 0.5)
        }
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap
		renderer.outputEncoding = sRGBEncoding

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
        })

        // Scene
        const scene = new Scene()
        scene.background = new Color( 0xb0b0b0 )

        // Add the light(s)
        scene.add(...lights)

        // Camera
        const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 18
        camera.position.y = 9

        // Rendering function
        const render = () => {
            renderer.render(scene, camera)
        }

        // Add the orbital control to move the camera
        var controls = new OrbitControls(camera, renderer.domElement)
        controls.addEventListener('change', render)
        controls.minDistance = 5
        controls.maxDistance = 500
        controls.enablePan = false

        // Table
        const table = new KlaskTable()
        table.createTable(scene)
        this.ball = table.createBall(scene)
        this.stickPlayer1 = table.createStick(scene)

        // Plan
        var planMaterial = new MeshPhongMaterial({ color: 0x808080, dithering: true })
        var planGeometry = new PlaneBufferGeometry(50, 50)
        var planMesh = new Mesh(planGeometry, planMaterial)
        planMesh.position.set(0, -1, 0)
        planMesh.rotation.x = -Math.PI * 0.5
        planMesh.receiveShadow = true
        scene.add(planMesh)

        var axes = new AxesHelper(5)
        scene.add(axes)

        // TODO: Share a constant with the back
        const factor = 2

        const animate = () => {
            requestAnimationFrame(animate)

            if (this.positions) {
                this.ball.position.x = this.positions.ball.x / factor
                this.ball.position.z = this.positions.ball.y / factor

                this.stickPlayer1.position.x = this.positions.stick1.x / factor
                this.stickPlayer1.position.z = this.positions.stick1.y / factor
            }

            render()
        }

        animate()
    }

    setPositions(data) {
        this.positions = data
    }
}

export default KlaskScene