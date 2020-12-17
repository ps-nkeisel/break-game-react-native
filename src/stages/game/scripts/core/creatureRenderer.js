const PIXI = require("pixi.js"),
    { Container, AnimatedSprite } = PIXI;

const DANGER_SKINS = {
    "MainCharacterHolding": "maps/Characters/MainCharacterHolding/walk",
    "MainCharacter": "maps/Characters/MainCharacter/walk",
    "ChinaFoodWorker": "maps/Characters/ChinaFoodWorker/walk",
    "Guard": "maps/Characters/Guard/walk",
    "Guard_2": "maps/Characters/Guard_2/walk",
    "MexFoodWorker": "maps/Characters/MexFoodWorker/walk",
    "PrideauxWorker": "maps/Characters/PrideauxWorker/walk",
    "Shopper_1": "maps/Characters/Shopper_1/walk",
    "Shopper_2": "maps/Characters/Shopper_2/walk",
    "Storefront_Worker": "maps/Characters/Storefront_Worker/walk",
    "StrawberryComputersWorker": "maps/Characters/StrawberryComputersWorker/walk",
    "Worker_Bakery": "maps/Characters/Worker_Bakery/walk",
    "Worker_TGI": "maps/Characters/Worker_TGI/walk",
    "Worker_Wallmart": "maps/Characters/Worker_Wallmart/walk",
    "Worker_Yeezi": "maps/Characters/Worker_Yeezi/walk",
    "moveCamera": "maps/Shared Elements/dangers/moveCamera.png",
    "_0000_fixed-CCTV": "maps/Shared Elements/dangers/_0000_fixed-CCTV.png"
};

export default class CreatureRenderer extends Container {

    constructor(skin = "MainCharacter",hat= "_0000_SkiMask.png", backpack= "_0012_Petty-Pocket.png") {
        super();
        this.rotation = PIXI.DEG_TO_RAD * 90;

        this.body = null;
        this.skin = skin;
        this.folderSkin = "maps/Characters/"+ skin +"/"

        this.bodySheet = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet;

        this.bodyContainer = new Container();
        this.accessoriesContainer = new Container();
        this.handContainer = new Container();

        this.addChild(this.bodyContainer);
        this.addChild(this.handContainer);
        this.addChild(this.accessoriesContainer);
        
        this._renderBody(skin);
        this._renderAccessories(hat, backpack);
    }

    setWalkingState(value) {
        if (!value)
            this.body.gotoAndStop(0);
        else
            this.body.play();////ease.add(creature, { rotation: -0.05 * Math.PI }, { duration: this.speed, reverse: true, repeat: true, ease: 'linear' });
    }

    _renderItemOnHand(sprite){
        this.handContainer.removeChildren();
        sprite.position.set(0,-10)
        sprite.anchor.set(0.5)
        this.handContainer.addChild(sprite);
    }
    
    _renderBody(skin){
        this.bodyContainer.removeChildren();
        if (skin in DANGER_SKINS){
            skin = DANGER_SKINS[skin];
        }else{
            throw new Error("Skin '"+ skin +"' not found.");
        }

        if( this.bodySheet.animations[skin] != null && this.bodySheet.animations[skin] !== undefined ){
            this.body = new AnimatedSprite(this.bodySheet.animations[skin]);
        }else{
            this.body = new AnimatedSprite([this.bodySheet.textures[skin]]);
            this.body.rotation = PIXI.DEG_TO_RAD * -180;
        }
        
        this.body.animationSpeed = 0.15;

        this.body.anchor.set(0.5);
        this.bodyContainer.addChild(this.body);
    }

    _renderAccessories(hat, backpack ) {
        this.accessoriesContainer.removeChildren();
        if (backpack){
            backpack = new PIXI.Sprite(this.bodySheet.textures[this.folderSkin + "BACKPACKS/" + backpack]);
            backpack.pivot.set(backpack.width / 2, backpack.height / 2);
            this.accessoriesContainer.addChild(backpack);
        }

        if (hat){
            hat = new PIXI.Sprite(this.bodySheet.textures[this.folderSkin + "HATS/" + hat]);
            hat.pivot.set(hat.width / 2, hat.height / 2)
            this.accessoriesContainer.addChild(hat);
        }

    }

}