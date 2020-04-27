import { WIDTH, HEIGHT, DEPTH, WALL_WIDTH, WALL_HEIGHT, HOLE_RADIUS, BALL_RADIUS, STICK_RADIUS, STICK_HEIGHT, MAGNET_HEIGHT, MAGNET_RADIUS, EXTRUSION_DEPTH } from './../config/constants';
import { BoxGeometry, MeshPhongMaterial, Mesh, Vector2, Shape, ExtrudeBufferGeometry, MeshLambertMaterial, Path, SphereGeometry, CylinderGeometry, Scene, Object3D, TextureLoader, MeshBasicMaterial } from 'three'

const wallColor = 0xf7f3c1,
      tableColor = 0x1313cf;

export class KlaskTable {

    constructor(private scene: Scene) {
    }

    createTable(): Object3D {
        let group = new Object3D();

        // Table
        var tableGeometry = new BoxGeometry(WIDTH, HEIGHT, DEPTH);
        var tableMaterial = new MeshPhongMaterial({ color: tableColor, dithering: true, wireframe: false });
        var table = new Mesh(tableGeometry, tableMaterial);
        table.position.x = 0;
        table.position.y = 0;
        table.name = "underground";
        
        let wallYPosition = WALL_HEIGHT / 2 - EXTRUSION_DEPTH / 2;

        // Left wall
        var leftWallGeometry = new BoxGeometry(WALL_WIDTH, WALL_HEIGHT, DEPTH);
        var leftWallMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false });
        var leftWall = new Mesh(leftWallGeometry, leftWallMaterial);
        leftWall.position.x = - WIDTH / 2 - WALL_WIDTH / 2;
        leftWall.position.y = wallYPosition;
        leftWall.position.z = 0;

        // Right wall
        var rightWallGeometry = new BoxGeometry(WALL_WIDTH, WALL_HEIGHT, DEPTH);
        var rightMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false });
        var rightWall = new Mesh(rightWallGeometry, rightMaterial);
        rightWall.position.x = WIDTH / 2 + WALL_WIDTH / 2;
        rightWall.position.y = wallYPosition;
        rightWall.position.z = 0;

        // Front wall
        var frontWallGeometry = new BoxGeometry(WIDTH + WALL_WIDTH * 2, WALL_HEIGHT, WALL_WIDTH);
        var frontWallMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false });
        var frontWall = new Mesh(frontWallGeometry, frontWallMaterial);
        frontWall.position.x = 0;
        frontWall.position.y = wallYPosition;
        frontWall.position.z = DEPTH / 2 + WALL_WIDTH / 2;

        // Rear wall
        var rearWallGeometry = new BoxGeometry(WIDTH + WALL_WIDTH * 2, WALL_HEIGHT, WALL_WIDTH);
        var rearWallMaterial = new MeshPhongMaterial({ color: wallColor, dithering: true, wireframe: false });
        var rearWall = new Mesh(rearWallGeometry, rearWallMaterial);
        rearWall.position.x = 0;
        rearWall.position.y = wallYPosition;
        rearWall.position.z = -frontWall.position.z;

        let extrudedTable = this.createExtrudedTable();
        extrudedTable.position.y = EXTRUSION_DEPTH / 2;

        group.add(table, extrudedTable, leftWall, rightWall, frontWall, rearWall);

        this.scene.add(group);
        
        return group;
    }

    createExtrudedTable(): Mesh {
        var extrudedFloorPts = [];
        extrudedFloorPts.push(new Vector2(-WIDTH / 2, -DEPTH / 2));
        extrudedFloorPts.push(new Vector2(WIDTH / 2, -DEPTH / 2));
        extrudedFloorPts.push(new Vector2(WIDTH / 2, DEPTH / 2));
        extrudedFloorPts.push(new Vector2(-WIDTH / 2, DEPTH / 2));
        var extrudedFloorShape = new Shape(extrudedFloorPts);

        var rearHole = new Path();
        rearHole.absellipse(0, DEPTH / 2 - STICK_RADIUS * 8, HOLE_RADIUS, HOLE_RADIUS, 0, Math.PI * 2, false, 0);
        var rearHoleShape = new Shape(rearHole.getPoints());

        var frontHole = new Path();
        frontHole.absellipse(0, -DEPTH / 2 + STICK_RADIUS * 8, HOLE_RADIUS, HOLE_RADIUS, 0, Math.PI * 2, false, 0);
        var frontHoleShape = new Shape(frontHole.getPoints());

        extrudedFloorShape.holes.push(rearHoleShape, frontHoleShape);

        var extrudedFloorGeometry = new ExtrudeBufferGeometry(extrudedFloorShape, {
            depth: EXTRUSION_DEPTH,
            steps : 1,
            bevelEnabled: false,
        })
        var extrudedFloorMaterial = new MeshLambertMaterial({ color: tableColor, wireframe: true });
        extrudedFloorMaterial.wireframe = false;
        var extrudedFloorMesh = new Mesh(extrudedFloorGeometry, extrudedFloorMaterial);

        // Smooth the edges (doesn't work, don't know why)
        extrudedFloorMesh.geometry.computeVertexNormals();
        extrudedFloorMesh.rotation.x = -Math.PI / 2;
        extrudedFloorMesh.name = "ground";

        return extrudedFloorMesh;
    }

    createBall(): Mesh {
        var texture = new TextureLoader().load('asset/ball-texture.png');
        var geometry = new SphereGeometry(BALL_RADIUS, 32, 32);
        //var material = new MeshPhongMaterial({color: 0xffffff, dithering: true});
        var material = new MeshBasicMaterial({map: texture});
        var sphere = new Mesh(geometry, material);
        sphere.position.y = BALL_RADIUS * 2 + EXTRUSION_DEPTH;
        this.scene.add(sphere);
        return sphere;
    }

    createStick(front: boolean): Mesh {
        var geometry = new CylinderGeometry(STICK_RADIUS, STICK_RADIUS, STICK_HEIGHT, 24);
        var material = new MeshPhongMaterial({color: 0x202020, dithering: true});
        var cylinder = new Mesh(geometry, material);
        cylinder.position.z = (front === true ? 1 : -1) * DEPTH / 4;
        cylinder.position.y = STICK_HEIGHT * 2;
        this.scene.add(cylinder);
        return cylinder;
    }

    createMagnet(): Mesh {
        var geometry = new CylinderGeometry(MAGNET_RADIUS, MAGNET_RADIUS, MAGNET_HEIGHT, 24);
        var material = new MeshPhongMaterial({color: 0xffffff, dithering: true});
        var magnet = new Mesh(geometry, material);
        magnet.position.z = 0;
        magnet.position.y = MAGNET_HEIGHT;
        this.scene.add(magnet);
        return magnet;
    }
}