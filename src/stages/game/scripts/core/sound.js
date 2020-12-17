import { Howl } from 'howler';
import { isNumber } from 'underscore';
import sprite from "@/processed/audios/compiled"

const defaultConfig = {
  autoplay: false,
  loop: false,
  volume: 1,
  src: [
    "sounds/compiled.mp3",
    "sounds/compiled.ogg",
    "sounds/compiled.m4a",
    "sounds/compiled.ac3"
  ],
  sprite: sprite
}


class Sound {

  _className = 'SoundClass';

  static instance = null;

  static loadResources() {

    return new Promise(function (resolve, fail) {

      var instance = new Howl(defaultConfig);
      instance.load();

      instance.once('load', () => {
        Sound.instance = instance;
        resolve("LOADED");
      });

      instance.once("loaderror", (d,err) => {
        fail("It couldn't be loaded");
      });

    });
  }


  constructor(_sprite, custom_options = {}) {
    if (!_sprite)
      throw new Error("Sprite audio not defined.");

    if (!sprite[_sprite])
      throw new Error("Sprite "+ _sprite +" not found.");

    this.sprite = _sprite;

    
    let _options = { ...defaultConfig, ...custom_options };

    this._instanceSound = new Howl(_options);
  }

  play(force=false) {
    if (force === true || !this._instanceSound.playing()    )
      this._instanceSound.play(this.sprite);
  }

  pause() {
    this._instanceSound.pause();
  }
  stop() {
    this._instanceSound.stop();
  }

  mute(value) {
    this._instanceSound.mute(value);
  }

  changeVolume(volume) {

    if (volume && isNumber(volume)) {
      this._instanceSound.volume(volume);
    }

  }

}

export default Sound 