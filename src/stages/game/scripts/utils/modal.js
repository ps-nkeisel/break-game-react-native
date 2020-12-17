const PIXI = require("pixi.js"),
    { Text,Application, TextStyle, Container, Loader, Sprite, utils, AnimatedSprite } = PIXI;

import { ease } from 'pixi-ease';


export default class Modal {
    /**
     * @type {PIXI.Application} 
     */
    static app;

    static EFFECTS = {
        slide: {
            start: (content)=>{
                let screen_width = Modal.app.screen.width;
                let screen_height = Modal.app.screen.height;


                content.pivot.set(0.5);

                return {x: screen_width/2, y: content.height * -1  };
            },
            end: (content)=>{
                let screen_width = Modal.app.screen.width;
                let screen_height = Modal.app.screen.height;
                content.pivot.set(0.5);
                return {x:screen_width/2  , y: screen_height /2 };
            },
            exit: (content)=>{
                let screen_width = Modal.app.screen.width;
                let screen_height = Modal.app.screen.height;
                //content.pivot.set(content.width/2,content.height/2);
                return {x: content.x, y: screen_height + content.height  };
            }
        }
    }
/**
 * 
 * @param {Container} target 
 */
    constructor(content, effect = "slide"){
        
        this.container = new Container();
        this.container.on("pointertap", (evt)=>{
            evt.stopPropagation();
        });
        
        this.content = content;
        this.showed = false;
        this.effect = effect;
    }

    setContent(content){
        this.content = content;
    }

    init(){
        this.wrapper = new Container();
        this.wrapper.removeChildren();
        this.bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.bg.alpha = 0;
        this.bg.width = Modal.app.screen.width;
        this.bg.height = Modal.app.screen.height;
        this.bg.tint = "#808080";
        this.bg.interactive = true;
        this.bg.on("pointertap", (evt)=>{
            this.hide();
            evt.stopPropagation();
        });
        this.wrapper.addChild(this.bg);
        this.container.addChild(this.content);
        
        this.wrapper.addChild(this.container);
        
        this.container.interactive = true;

        let startPos = Modal.EFFECTS[this.effect].start(this.content);
        this.container.position.set(startPos.x, startPos.y);

    }

    show(){
        if (this.showed == false){
            this.init();
            Modal.app.stage.addChild(this.wrapper);
            var endPos = Modal.EFFECTS[this.effect].end(this.container);
            ease.add(this.bg, {alpha: 0.65}, { duration: 800, ease: 'linear' });
            ease.add(this.container, endPos, { duration: 1300, ease: 'easeOutBack' });
            this.showed = true;
        }
    }

    hide(){
        if (this.showed == true){
            var endPos = Modal.EFFECTS[this.effect].exit(this.container);
            ease.add(this.bg, {alpha: 0},{ duration: 400, ease: 'linear' });
            let movement = ease.add(this.container, endPos, { duration: 400, ease: 'easeOutQuad' });
            movement.once('complete',()=>{
                this.wrapper.destroy();
            });
            this.showed = false;
        }
    }
}