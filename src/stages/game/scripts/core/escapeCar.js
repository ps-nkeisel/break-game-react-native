import { Emitter } from 'pixi-particles'
import { ease } from 'pixi-ease';
import Sounds from '@/stages/game/scripts/core/sound';
import GameService from '@/stages/game/scripts/core/services/GameService';

const PIXI = require("pixi.js"),
    { Container, AnimatedSprite } = PIXI;

export default class EscapeCar extends Container {

    /**
     * 
     * @param {Scenery} scenery 
     */
    constructor(sceneryManager) {
        super();

        this.sceneryManager = sceneryManager;
        this.init();
        this.carSpeed = 1800;

        this.sounds = {
            successful: new Sounds("successful"),
            car_door_open: new Sounds("car_door_open", {
                volume: 1
            }),
            car_door_close: new Sounds("car_door_close", {
                volume: 1
            }),
            carStopping: new Sounds("car-stopping", {
                volume: 0.2,
                rate: 1
            }),
        }

    }


    init() {
        let initPosition = this.sceneryManager.sceneryManifests.initPosition;

        var textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet
        //var car = new AnimatedSprite(textures.animations["maps/Shared Elements/carEntrance/robberEntranceAnimation"]);
        var car = new AnimatedSprite(textures.animations[ GameService.getCurrentPlayerEscapeCar().texture ]);
        this.finalX = (initPosition.x * 32) + 16;
        this.finalY = (initPosition.y * 32) + 16;

        this.initX = this.finalX - window.innerWidth;
        this.initY = this.finalY;

        this.endX = this.finalX + window.innerWidth;
        this.endY = this.finalY;



        car.rotation = PIXI.DEG_TO_RAD * 90
        car.scale.set(-1, 1);
        car.anchor.set(0.5)
        car.position.set(this.initX / 2, this.initY);
        car.animationSpeed = 0.6
        car.loop = false;

        let smoke = textures.textures["maps/Shared Elements/carEntrance/whiteSmokeParticle.png"]
        var particlesContainer = new PIXI.ParticleContainer()
        this.emitter = new Emitter(particlesContainer, [
            smoke
        ],
            {
                "alpha": {
                    "start": 1,
                    "end": 0
                },
                "scale": {
                    "start": 0.1,
                    "end": 0.5
                },
                "color": {
                    "start": "fffefe",
                    "end": "ffffff"
                },
                "speed": {
                    "start": 150,
                    "end": 20
                },
                "startRotation": {
                    "min": -45,
                    "max": 45
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.4,
                    "max": 0.8
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "this.emitterLifetime": -1,
                "maxParticles": 80,
                "pos": {
                    "x": this.initX - 60,
                    "y": this.initY
                },
                "addAtBack": true,
                "spawnType": "point"
            }
        )

        this.addChild(particlesContainer);
        this.addChild(car);

        this.car = car;
    }

    out() {
        var initPosition = this.sceneryManager.sceneryManifests.initPosition;

        return new Promise((resolve) => {
            this.emitter.autoUpdate = true;
            this.emitter.emit = true;
            setTimeout(() => {
                this.emitter.emit = false;
            }, 1000);
            this.sceneryManager.worldInstance.player.renderable = false;
            this.sceneryManager.worldInstance.playerReady = false;
            
            var lastX = this.sceneryManager.sceneries[0].SceneryLoader.tiled.mapJson.width - 1


            this.sceneryManager.worldInstance.player.gamePosition = { x: lastX, y: initPosition.y,z: this.sceneryManager.worldInstance.player.gamePosition.z  }

            this.car.animationSpeed = -Math.abs(this.car.animationSpeed);
            this.car.play();



            this.sounds.car_door_close.play()




            var animation = ease.add(this.car, { position: { x: this.endX, y: this.endY } }, { duration: 300, ease: "easeInCirc" })
            animation.on("each", (a, b) => {
                this.emitter.updateSpawnPos(this.car.position.x - 60, this.car.position.y);
            });
            animation.on("complete", (a, b) => {
                this.sounds.carStopping.stop();
                this.sounds.successful.play();
                resolve();
            });

        });
    }


    in() {
        var initPosition = this.sceneryManager.sceneryManifests.initPosition;
        
        this.sounds.carStopping.play();

        return new Promise((resolve) => {

            this.sceneryManager.updateMatrix(initPosition.x, initPosition.y,0, false)
            this.sceneryManager.updateMatrix(initPosition.x + 1, initPosition.y,0, false)

            this.sceneryManager.updateMatrix(initPosition.x, initPosition.y + 1,0, false)
            this.sceneryManager.updateMatrix(initPosition.x + 1, initPosition.y + 1,0, false)

            this.sceneryManager.updateMatrix(initPosition.x - 1, initPosition.y,0, false)
            this.sceneryManager.updateMatrix(initPosition.x - 1, initPosition.y + 1,0, false)

            this.emitter.autoUpdate = true;
            this.emitter.emit = true;

            setTimeout(() => {
                this.emitter.emit = false;
            }, this.carSpeed - 300);

            var animation = ease.add(this.car, { position: { x: this.finalX, y: this.finalY } }, { duration: this.carSpeed, ease: "easeOutCirc" })

            animation.on("each", (a, b) => {
                this.emitter.updateSpawnPos(this.car.position.x - 40, this.car.position.y)
            });
            animation.once("complete", () => {
                this.car.play();
                this.sounds.car_door_open.play()
                setTimeout(() => {
                    resolve();
                }, 250);
            });
        });
    }
}