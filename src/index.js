import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FontFaceObserver from 'fontfaceobserver';
import App from './App';
import Creature from './stages/game/scripts/core/creature'
import Scenery from './stages/game/scripts/core/scenery'
import SceneryLoader from './stages/game/scripts/core/sceneryLoader'
import World from './stages/game/scripts/core/world'
import { Dispatchers } from './store/ducks/user';
import Sound from './stages/game/scripts/core/sound';
import _ from "underscore";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

//console.log = function() {};


Sentry.init({
  dsn: 'https://f4b931eded8949138fa9fb840cddbca6@o481912.ingest.sentry.io/5531310',
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});


const PIXI = require("pixi.js"),
  { Application } = PIXI;

var FBInstant = window.FBInstant;

if (!window.fbEnv) {
  loadResources().then(function () {
    setup();
  });
} else {
  var loading = loadResources();
  FBInstant.initializeAsync().then(function () {
    Promise.resolve(loading).then(function () {
      
      FBInstant.startGameAsync().then(async () => {
        
        let signature = '';
        var playerName = FBInstant.player.getName();
        var playerPic = FBInstant.player.getPhoto();
        var playerId = FBInstant.player.getID();

        Sentry.configureScope(function(scope) {
          scope.setUser({
            id: playerId,
            name: playerName,
          });
        });

        Dispatchers.setUserInfo(signature, playerPic, playerName, playerId);
        setup();
      });
    });
  });
}

function loadResources() {
  window.loadingProgress = 0;

  console.log("Loading resources...")

  let MarketDeco_font = new FontFaceObserver("MarketDeco");
  let sugar_font = new FontFaceObserver("sugar");

  var loadingFonts = Promise.race([ timeout(5000) ,Promise.all([MarketDeco_font.load(null,6000), sugar_font.load(null,6000)])])
  let loadingFunctions = [Creature.loadResources(),loadingFonts, Sound.loadResources(), loadTextures()]
  let progress = 0;


  function timeout(ms) {
    return new Promise((resolve,reject) => setTimeout(resolve, ms));
  }


  return new Promise((resolve, fail)=>{
    loadingFunctions.forEach(p => p.then(() => {
      progress++;
      let percentage = progress / loadingFunctions.length * 100;
      FBInstant.setLoadingProgress(percentage);
      console.log(percentage + "%");
      if (percentage === 100) resolve(true)
    }).catch((err)=> fail(err)) );


  });
}

function loadTextures() {
  return new Promise((resolve) => {
    let resourcesURI = _.union(["gameplay/textures.json","gameplay/LastItemIcons/textures.json"], _.pluck(SceneryLoader.maps, "baseSceneryImage"));
    PIXI.Loader.shared.add(resourcesURI)
      .load(function (a, b) {
        initCanvas().then(() => {
          resolve();
        })
      });
  });
}


function initCanvas() {

  return new Promise((resolve) => {
    window.gameApp = new Application({
      antialias: true,
      width: window.innerWidth,
      height: window.innerHeight
    });

    window.gameApp.renderer.textureGC.mode = PIXI.GC_MODES.MANUAL;

    document.getElementById("canvas").appendChild(window.gameApp.view);
    window.gameWorld = new World();
    window.gameApp.stage.addChild(window.gameWorld);

    Scenery.preLoad().then(() => {
      resolve()
    });

  });
}

function setup() {

  console.log("Setup initialized...");
  console.log("SDK Version: " + FBInstant.getSDKVersion());

  // var entry_data = FBInstant.getEntryPointData();
  // console.log("ENTRY DATA:" + entry_data);
  // document.querySelector("footer").innerHTML = "ENTRY DATA:" + entry_data;

  //escolher/convidar amigos para jogar
  // FBInstant.context
  // .chooseAsync()
  // .then(function() {
  //   console.log(FBInstant.context.getID());
  //   // 1234567890
  // });

  // FBInstant.context
  // .switchAsync('3566868966725525')
  // .then(function() {
  //   console.log(FBInstant.context.getID());
  //   // 1234567890
  //   var entry_data = FBInstant.getEntryPointData();
  //     console.log("RECEBI DATA X:" + entry_data);
  // });


  // FBInstant.context
  //           .createAsync('3566868966725525')
  //           .then(function () {
  //             var entry_data = FBInstant.getEntryPointData();
  //             console.log("RECEBI DATA3:" + entry_data);
  //           });

  // var entry_data = FBInstant.getEntryPointData();
  //     console.log("RECEBI DATA:" + entry_data);

  // setTimeout(() => {
  //   FBInstant.getEntryPointAsync()
  //   .then((entrypoint) => {
  //     console.log("ENTRYPOINT:"+entrypoint);
  //     var entry_data = FBInstant.getEntryPointData();
  //     console.log("ENTRY DATA:" + entry_data);
  //     //alert(entry_data);
  //     document.querySelector("footer").innerHTML = "ENTRY DATA:" + entry_data;
  //   }).catch(function (error) {
  //     console.log('ENTRY ERRO:' + error.message);
  //   });

  //   FBInstant.context
  //     .switchAsync('3566868966725525')
  //     .then(function() {
  //       console.log(FBInstant.context.getID());
  //       // 1234567890
  //       var entry_data = FBInstant.getEntryPointData();
  //         console.log("RECEBI DATA X:" + entry_data);
  //     });
  // }, 3000);

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}