// import { Vec2, Edge, World, Circle } from 'planck-js';

// export class Physics {

//     private socket;
//     private player1;
//     private player2;
//     private playerNumberRandom;
//     private world;
//     private table;
//     private ball;
//     private stick1;
//     private stick2;
//     private magnet1;
//     private magnet2;
//     private magnet3;
//     private timer;

//     constructor(socket, player1, player2) {
//         this.socket = socket
//         this.player1 = player1
//         this.player2 = player2
//         this.playerNumberRandom = null
//         this.world = null
//         this.table = null
//         this.ball = null
//         this.stick1 = null
//         this.stick2 = null
//         this.magnet1 = null
//         this.magnet2 = null
//         this.magnet3 = null

//         this.timer = null
//     }

//     loadTable() {
//         // Bodies definition
//         const stickBodyDef = {
//             angularDamping: 2,
//             bullet: false,
//             linearDamping: 2,
//             position: Vec2(0, 0),
//             type: 'dynamic'
//         }

//         const ballBodyDef = {
//             angularDamping: 0.02,
//             bullet: true,
//             linearDamping: 0.01,
//             position: Vec2(0, 0),
//             type: 'dynamic'
//         }

//         const magnetBodyDef = {
//             angularDamping: 0.02,
//             bullet: true,
//             linearDamping: 0.01,
//             position: Vec2(0, 0),
//             type: 'dynamic'
//         }

//         // Fixtures definitions
//         const wallFixDef = {
//             restitution: 0.5
//         }

//         const stickFixDef = {
//             density: 0.5,
//             filterCategoryBits: 0x0002,
//             restitution: 0
//         }

//         const ballFixDef = {
//             density: 0.75,
//             filterCategoryBits: 0x0004,
//             restitution: 0.9
//         }

//         const magnetFixDef = {
//             density: 0.5,
//             filterCategoryBits: 0x0008,
//             restitution: 0.2
//         }

//         const stickBlockerFixDef = {
//             filterMaskBits: 0x0002
//         }

//         // Table
//         this.table = this.world.createBody()

//         // TODO: Share a constant with the front
//         const factor = 2

//         const tableDef = [
//             [{ "x": -7, "y": 10 }, { "x": 7, "y": 10 }],
//             [{ "x": 7, "y": 10 }, { "x": 7, "y": -10 }],
//             [{ "x": 7, "y": -10 }, { "x": -7, "y": -10 }],
//             [{ "x": -7, "y": -10 }, { "x": -7, "y": 10 }]
//         ]

//         tableDef.map(edge => {
//             this.table.createFixture(
//                 Edge(Vec2(edge[0].x * factor, edge[0].y * factor), Vec2(edge[1].x * factor, edge[1].y * factor)), wallFixDef
//             )
//         })

//         // Prevent the stick to cross half of the table
//         this.table.createFixture(
//             Edge(Vec2(-7 * factor, 0), Vec2(7 * factor, 0)),
//             stickBlockerFixDef
//         )

//         // TODO: Share the dimension with the frontend
//         this.ball = this.world.createBody(ballBodyDef)
//         this.ball.createFixture(Circle(0.6 / 2 * factor), ballFixDef)
//         this.ball.setPosition(Vec2(0, (this.playerNumberRandom === 0 ? -1 : 1) * 10 / 4 * factor))

//         this.stick1 = this.world.createBody(stickBodyDef)
//         this.stick1.setPosition(Vec2(0, 10 / 2 * factor))
//         this.stick1.createFixture(Circle(0.6 / 2 * factor), stickFixDef)

//         this.stick2 = this.world.createBody(stickBodyDef)
//         this.stick2.setPosition(Vec2(0, - 10 / 2 * factor))
//         this.stick2.createFixture(Circle(0.6 / 2 * factor), stickFixDef)

//         this.magnet1 = this.world.createBody(magnetBodyDef)
//         this.magnet1.setPosition(Vec2(-14 / 4 * factor, 0))
//         this.magnet1.createFixture(Circle(0.6 * 2 / 3 * factor), magnetFixDef)

//         this.magnet2 = this.world.createBody(magnetBodyDef)
//         this.magnet2.setPosition(Vec2(0, 0))
//         this.magnet2.createFixture(Circle(0.6 * 2 / 3 * factor), magnetFixDef)

//         this.magnet3 = this.world.createBody(magnetBodyDef)
//         this.magnet3.setPosition(Vec2(14 / 4 * factor, 0))
//         this.magnet3.createFixture(Circle(0.6 * 2 / 3 * factor), magnetFixDef)
//     }

//     updatePhysics() {
//         const force = 1

//         let stick1Vector = Vec2(
//             this.player1.movement.x * force,
//             this.player1.movement.y * force
//         )

//         let stick2Vector = Vec2(
//             -this.player2.movement.x * force,
//             -this.player2.movement.y * force
//         )

//         this.stick1.applyForce(
//             stick1Vector,
//             Vec2(this.stick1.getPosition()),
//             true
//         )

//         this.stick2.applyForce(
//             stick2Vector,
//             Vec2(this.stick2.getPosition()),
//             true
//         )

//         this.socket.emit('physics-updated', {
//             ball: this.ball.c_position.c,
//             stick1: this.stick1.c_position.c,
//             stick2: this.stick2.c_position.c
//         })
//     }

//     startPhysics(playerNumberRandom) {
//         this.playerNumberRandom = playerNumberRandom
//         this.world = World()
//         this.loadTable()
//         this.timer = setInterval(() => {
//             this.world.step(1.0 / 60.0, 10, 0)
//             this.updatePhysics()
//         }, 0)
//     }

//     resetPhysics() {
//         clearInterval(this.timer)
//         this.startPhysics(null);
//     }

//     stopPhysics() {
//         clearInterval(this.timer)
//     }
// }
