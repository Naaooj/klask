"use strict"

import { WebGLRenderer, PerspectiveCamera, Scene, PCFSoftShadowMap, sRGBEncoding, Color, PlaneBufferGeometry, MeshPhongMaterial, Mesh, AxesHelper, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as constants from './constants'
import lights from './light'
import KlaskTable from './klask-table'

const cameraZPosition = 18

class KlaskScene {

    constructor() {
        this.ball = null
        this.stickPlayer1 = null
        this.stickPlayer2 = null
        this.positions = null
        this.camera = null
    }

    createScene() {
        // Renderer
        const container = document.getElementById('klask-container')
        const renderer = new WebGLRenderer({ alpha: true, antialias: true })
        while (container.firstChild) {
            container.removeChild(container.lastChild);
          }
        container.appendChild(renderer.domElement)

        if (window.devicePixelRatio > 1) {
            renderer.setPixelRatio(window.devicePixelRatio * 0.5)
        }
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap
        renderer.outputEncoding = sRGBEncoding


        const resize = () => {
            this.camera.aspect = container.clientWidth / container.clientHeight
            this.camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
        }
        window.addEventListener('resize', resize)

        // Scene
        const scene = new Scene()
        scene.background = new Color(0xb0b0b0)

        // Add the light(s)
        scene.add(...lights)

        // Camera
        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)        
        this.camera.position.z = cameraZPosition
        this.camera.position.y = 9
        this.camera.lookAt(new Vector3(0, 0, 0))
        resize()

        // Rendering function
        const render = () => {
            renderer.render(scene, this.camera)
        }

        if (constants.DEBUG) {
            // Add the orbital control to move the camera
            var controls = new OrbitControls(this.camera, renderer.domElement)
            controls.addEventListener('change', render)
            controls.minDistance = 5
            controls.maxDistance = 500
            controls.enablePan = false

            // Add the axis
            var axes = new AxesHelper(5)
            scene.add(axes)
        }

        // Table
        const table = new KlaskTable(scene)
        table.createTable()
        this.ball = table.createBall()
        this.stickPlayer1 = table.createStick(true)
        this.stickPlayer2 = table.createStick(false)

        // Plan
        var planMaterial = new MeshPhongMaterial({ color: 0x808080, dithering: true })
        var planGeometry = new PlaneBufferGeometry(50, 50)
        var planMesh = new Mesh(planGeometry, planMaterial)
        planMesh.position.set(0, -1, 0)
        planMesh.rotation.x = -Math.PI * 0.5
        planMesh.receiveShadow = true
        scene.add(planMesh)

        // TODO: Share a constant with the back
        const factor = 2

        const animate = () => {
            requestAnimationFrame(animate)

            if (this.positions) {
                this.ball.position.x = this.positions.ball.x / factor
                this.ball.position.z = this.positions.ball.y / factor

                this.stickPlayer1.position.x = this.positions.stick1.x / factor
                this.stickPlayer1.position.z = this.positions.stick1.y / factor

                this.stickPlayer2.position.x = this.positions.stick2.x / factor
                this.stickPlayer2.position.z = this.positions.stick2.y / factor
            }

            render()
        }

        animate()
    }

    setPositions(data) {
        this.positions = data
    }

    setCameraPosition(playerNumber) {
        this.camera.position.set(0, 8, playerNumber === 1 ? cameraZPosition : -cameraZPosition)
        this.camera.lookAt(new Vector3(0, 0, 0))
    }
}

export default KlaskScene