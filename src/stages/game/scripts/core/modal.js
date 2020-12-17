import _ from 'underscore';
import { ease } from 'pixi-ease';
const PIXI = require("pixi.js"),
    { Container, AnimatedSprite } = PIXI;

export default class Modal extends Container {
  

    static MODAL_CONTENTS = {
        AVAILABLE_TOOLS: Modal.getAvailableToolsContent,
        STEAL_SOMETHING: Modal.getStealSomethingContent,
        SHOW_MAIN_ITEM: Modal.getShowMainItemContent
    }

    constructor(modalContent, onExitModal) {
        super();
        this.showed = false;
        if (!typeof modalContent === "function")
            throw new Error("Modal content must be a function that returns a PIXI.JS container");
        this.onExitModal = onExitModal;

        this.modalContent = modalContent(this.hide);
        this.modalOpened = false;
    }

    static getAvailableToolsContent(hideFunction) {
        var container = new PIXI.Container();

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.alpha = 0.5;
        graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
        container.addChild(graphics);

        var background = new PIXI.Graphics();
        background.beginFill(0x23142d);
        background.lineStyle(6, 0x422d52, 1);
        background.moveTo(0, 205);
        background.lineTo(window.innerWidth + 10, 185);
        background.lineTo(window.innerWidth + 10, 420);
        background.lineTo(0, 440);
        background.endFill();
        container.addChild(background);

        let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.animations;
        let texture = textures["maps/Shared Elements/highlight/highlight"];
        let highlight = new AnimatedSprite(texture);
        highlight.animationSpeed = 0.2;
        highlight.anchor.set(0.5);
        highlight.alpha = 0.3;
        highlight.scale.set(4.0);
        highlight.position.set(window.innerWidth / 2, 300);
        highlight.play();
        container.addChild(highlight);

        texture = PIXI.utils.TextureCache["maps/Shared Elements/ui/in_game_UI/pop_up_upgrades_available/arrow.png"];
        let arrow = new PIXI.Sprite(texture);
        arrow.position.set(180, 75);
        container.addChild(arrow);

        texture = PIXI.utils.TextureCache["maps/Shared Elements/ui/in_game_UI/pop_up_upgrades_available/icon.png"];
        let icon = new PIXI.Sprite(texture);
        icon.position.set(0, 245);
        container.addChild(icon);

        texture = PIXI.utils.TextureCache["maps/Shared Elements/ui/in_game_UI/pop_up_upgrades_available/labelupgrades.png"];
        let label = new PIXI.Sprite(texture);
        label.position.set(55, 220);
        container.addChild(label);


        container.y = 100;

        return container;
    }

    static getStealSomethingContent(hideFunction) {
        var container = new PIXI.Container();


        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.alpha = 0.5;
        graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
        container.addChild(graphics);

        var background = new PIXI.Graphics();
        background.beginFill(0x23142d);
        background.lineStyle(6, 0x422d52, 1);
        background.moveTo(0, 205);
        background.lineTo(window.innerWidth + 10, 185);
        background.lineTo(window.innerWidth + 10, 420);
        background.lineTo(0, 440);
        background.endFill();
        background.position.set(0, 0);
        background.height = 150
        container.addChild(background);

        var textureIcon = PIXI.utils.TextureCache["maps/Shared Elements/ui/in_game_UI/steal_something_alert/icon_stealSomething.png"];
        let icon = new PIXI.Sprite(textureIcon);
        icon.anchor.set(0.5);
        icon.position.set(window.innerWidth / 2, 260);
        container.addChild(icon);

        var specialLoot = window.gameWorld.sceneryManager.getAllItemsByAttributes({ lootable: true }, false).find((item) => (
            item.specialLoot
        ));

        var mainItems = require("@/stages/game/manifests/mainItems.json");
        let sourceImage = specialLoot.extraData.image.source;
        let mainItem = _.findWhere(mainItems, { texture: sourceImage });

        const style2 = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "Sugar",
            fontSize: 26,
            letterSpacing: 1,
            strokeThickness: 1,
            padding: 10,
            align: "center",
            lineHeight: 36,
            wordWrap: true,
            wordWrapWidth: window.innerWidth - 10
        });
        let textItemName = new PIXI.Text("STEAL THE " + mainItem.name + "\nBEFORE YOU GO!", style2);
        textItemName.anchor.set(0.5);
        textItemName.position.set(window.innerWidth / 2, 165);
        container.addChild(textItemName);

        container.y = 20;

        return container;
    }

    static getShowMainItemContent() {
        var container = new PIXI.Container();

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.alpha = 0.5;
        graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
        container.addChild(graphics);

        var background = new PIXI.Graphics();
        background.beginFill(0x23142d);
        background.lineStyle(6, 0x422d52, 1);
        background.moveTo(0, 205);
        background.lineTo(window.innerWidth + 10, 185);
        background.lineTo(window.innerWidth + 10, 420);
        background.lineTo(0, 440);
        background.endFill();
        container.addChild(background);

        let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.animations;
        let texture = textures["maps/Shared Elements/highlight/highlight"];
        let highlight = new AnimatedSprite(texture);
        highlight.animationSpeed = 0.2;
        highlight.anchor.set(0.5);
        highlight.alpha = 0.3;
        highlight.scale.set(4.0);
        highlight.position.set(window.innerWidth / 2, 300);
        highlight.play();
        container.addChild(highlight);

        const style = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "Sugar",
            fontSize: 36,
            fontWeight: "bold",
            letterSpacing: 1,
            strokeThickness: 1,
            padding: 10
        });
        let textTitle = new PIXI.Text("Mission: Steal the", style);
        textTitle.anchor.set(0.5, 0);
        textTitle.position.set(window.innerWidth / 2, 220);
        container.addChild(textTitle);

        var specialLoot = window.gameWorld.sceneryManager.getAllItemsByAttributes({ lootable: true }, false).find((item) => (
            item.specialLoot
        ));

        var mainItems = require("@/stages/game/manifests/mainItems.json");
        let sourceImage = specialLoot.extraData.image.source;
        let mainItem = _.findWhere(mainItems, { texture: sourceImage });
        texture = PIXI.utils.TextureCache[mainItem.texture_xl];
        let icon = new PIXI.Sprite(texture);
        icon.anchor.set(0.5);
        icon.position.set(window.innerWidth / 2, 305);
        icon.scale.set(0.25);
        container.addChild(icon);

        const style2 = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "Sugar",
            fontSize: 30,
            fontWeight: "bold",
            letterSpacing: 1,
            strokeThickness: 1,
            padding: 10
        });
        let textItemName = new PIXI.Text(mainItem.name, style2);
        textItemName.anchor.set(0.5);
        textItemName.position.set(window.innerWidth / 2, 390);
        container.addChild(textItemName);
        container.y = 100;

        return container;
    }

    show() {
        if (this.showed === false) {
            this.upgrade();
        }
    }

    hide() {
        if (this.showed === true) {
            let movement = ease.add(this.modalContent, { y: -100, alpha: 0.0 }, { duration: 300, ease: 'easeOutQuad' });
            movement.once('complete', () => {
                this.modalContent.destroy({ children: true });//, texture:true, baseTexture:true});

                if (typeof this.onExitModal === "function")
                    this.onExitModal()

                this.showed = false;
            });
        }
    }

    upgrade() {
        this.modalContent.alpha = 0.0;
        this.modalContent.interactive = true;
        this.modalContent.click = (ev) => {
            this.hide();
            ev.stopPropagation();
        }
        this.modalContent.tap = (ev) => {
            this.hide();
            ev.stopPropagation();
        }
        
        this.showed = true;

        window.gameApp.stage.addChild(this.modalContent);
        let movement = ease.add(this.modalContent, { y: 0, alpha: 1.0 }, { duration: 500, ease: 'easeOutQuad' });
        movement.once('complete', () => {
            setTimeout(() => {
                this.hide();
            }, 4000);
        });
    }

}