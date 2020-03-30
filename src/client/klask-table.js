"use strict"

import { BoxGeometry, MeshPhongMaterial, Mesh, Vector2, Shape, ExtrudeBufferGeometry, MeshLambertMaterial, Path, SphereGeometry, CylinderGeometry } from 'three'

const wallColor = 0xf7f3c1,
      tableColor = 0x1313cf

const width = 14,
      height = 0.2,
      depth = 20

const wallHeight = 1,
      wallWidth = 0.5

const holeRadius = 0.6

const ballRadius = holeRadius / 2

const stickRadius = ballRadius,
      stickHeight = wallHeight

class KlaskTable {

    createTable(scene) {
        // Table
        var tableGeometry = new BoxGeometry(width, height, depth)
        var tableMaterial = new MeshPhongMaterial({ color: tableColor, dithering: true, wireframe: false })
        var table = new Mesh(tableGeometry, tableMaterial)
        table.position.x = 0
        table.position.y = - height / 2
        
        // Left wall
        var leftWallGeometry = new BoxGeometry(wallWidth, wallHeight, depth)
        var leftWallMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false })
        var leftWall = new Mesh(leftWallGeometry, leftWallMaterial)
        leftWall.position.x = - width / 2 - wallWidth / 2
        leftWall.position.y = wallHeight / 2
        leftWall.position.z = 0

        // Right wall
        var rightWallGeometry = new BoxGeometry(wallWidth, wallHeight, depth)
        var rightMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false })
        var rightWall = new Mesh(rightWallGeometry, rightMaterial)
        rightWall.position.x = width / 2 + wallWidth / 2
        rightWall.position.y = wallHeight / 2
        rightWall.position.z = 0

        // Front wall
        var frontWallGeometry = new BoxGeometry(width, wallHeight, wallWidth)
        var frontWallMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false })
        var frontWall = new Mesh(frontWallGeometry, frontWallMaterial)
        frontWall.position.x = 0
        frontWall.position.y = wallHeight / 2
        frontWall.position.z = depth / 2 + wallWidth / 2

        // Rear wall
        var rearWallGeometry = new BoxGeometry(width, wallHeight, wallWidth)
        var rearWallMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false })
        var rearWall = new Mesh(rearWallGeometry, rearWallMaterial)
        rearWall.position.x = 0
        rearWall.position.y = wallHeight / 2
        rearWall.position.z = -depth / 2 - wallWidth / 2

        this.createExtrudedTable(scene)

        scene.add(table, leftWall, rightWall, frontWall, rearWall);
    }

    createExtrudedTable(scene) {
        var extrudedFloorPts = [];
        extrudedFloorPts.push(new Vector2(-width / 2, -depth / 2))
        extrudedFloorPts.push(new Vector2(width / 2, -depth / 2))
        extrudedFloorPts.push(new Vector2(width / 2, depth / 2))
        extrudedFloorPts.push(new Vector2(-width / 2, depth / 2))
        var extrudedFloorShape = new Shape(extrudedFloorPts);

        var rearHole = new Path();
        rearHole.absellipse(0, depth / 2 - 2, holeRadius, holeRadius, 0, Math.PI * 2, false);
        var rearHoleShape = new Shape(rearHole.getPoints());

        var frontHole = new Path();
        frontHole.absellipse(0, -depth / 2 + 2, holeRadius, holeRadius, 0, Math.PI * 2, false);
        var frontHoleShape = new Shape(frontHole.getPoints());

        extrudedFloorShape.holes.push(rearHoleShape, frontHoleShape);

        var extrudedFloorGeometry = new ExtrudeBufferGeometry(extrudedFloorShape, {
            amount: 0.3,
            steps : 1,
            bevelEnabled: false,
        })
        var extrudedFloorMaterial = new MeshLambertMaterial({ color: tableColor, wireframe: false })
        var extrudedFloorMesh = new Mesh(extrudedFloorGeometry, extrudedFloorMaterial)

        // Smooth the edges (doesn't work, don't know why)
        extrudedFloorMesh.geometry.computeVertexNormals()
        extrudedFloorMesh.rotation.x = -Math.PI / 2
        
        scene.add(extrudedFloorMesh)
    }

    createBall(scene) {
        var geometry = new SphereGeometry(ballRadius, 32, 32)
        var material = new MeshPhongMaterial({color: 0xffffff, dithering: true})
        var sphere = new Mesh(geometry, material)
        sphere.position.y = ballRadius * 2
        scene.add(sphere)
        return sphere
    }

    createStick(scene) {
        var geometry = new CylinderGeometry(stickRadius, stickRadius, stickHeight, 24)
        var material = new MeshPhongMaterial({color: 0x202020, dithering: true})
        var cylinder = new Mesh(geometry, material)
        cylinder.position.z = depth / 4
        cylinder.position.y = stickHeight
        scene.add(cylinder)
        return cylinder
    }
}

export default KlaskTable