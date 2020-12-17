const fs = require('fs');
const path = require('path');
var audiosprite = require("../node_modules/audiosprite");


var files = ['../public/sounds/raw/*'];
var opts = { format: "howler", output: '../public/sounds/compiled' }

console.log("Starting to compile audio ");
audiosprite(files, opts, function (err, obj) {
    if (err) return console.error(err)

    var pathTo = path.join(__dirname, "../src/processed/audios/");


    fs.writeFile(pathTo + "compiled.js", "export default " + JSON.stringify(obj.sprite), function (err) {
        if (err) return console.log(err);

        console.log("Audio compiled successfully at " + pathTo);

        if (process.platform != "win32"){
            console.log("Compressing audio...");
            
            try {
                fs.rename('../public/sounds/compiled.mp3', '../public/sounds/compiled-temp.mp3', function (err) {
                    if (err) console.log('Rename ERROR: ' + err);
                });
    
                fs.rename('../public/sounds/compiled.ogg', '../public/sounds/compiled-temp.ogg', function (err) {
                    if (err) console.log('Rename ERROR: ' + err);
                });
    
                var SoxCommand = require('../node_modules/sox-audio');
    
                var command = SoxCommand('../public/sounds/compiled-temp.mp3');
                command.output('../public/sounds/compiled.mp3')
                    .outputSampleRate(32000)
                    .outputChannels(1)
                    .outputFileType('mp3');
                command.run();
    
                var command = SoxCommand('../public/sounds/compiled-temp.ogg');
                command.output('../public/sounds/compiled.ogg')
                    .outputSampleRate(32000)
                    .outputChannels(1)
                    .outputFileType('ogg');
                command.run();
    
                // var command = SoxCommand('../public/sounds/compiled.m4a');
                // command.output('../public/sounds/compiledX.m4a')
                //     .outputSampleRate(32000)
                //     .outputChannels(1)
                //     .outputFileType('m4a');
                // command.run();
    
                // var command = SoxCommand('../public/sounds/compiled.ac3');
                // command.output('../public/sounds/compiledX.ac3')
                //     .outputSampleRate(32000)
                //     .outputChannels(1)
                //     .outputFileType('ac3');
                // command.run();
            } catch (error) {
                console.log(error.message);
            }
        }

        // console.log("Compressing textures...");
        // const imagemin = require('imagemin');
        // const imageminPngquant = require('imagemin-pngquant');

        // if (fs.existsSync('../public/gameplay/textures-original.png')) {
        //     fs.copyFile("../public/gameplay/textures-original.png", "../public/gameplay/textures.png", (err) => {
        //         if (err) {
        //             console.log("Error Found:", err);
        //         }
        //     });
        // }

        // (async () => {
        //     await imagemin(['../public/gameplay/textures.png'], {
        //         destination: '../public/gameplay/',
        //         plugins: [
        //             imageminPngquant({
        //                 speed: 2,
        //                 quality: [0.40, 0.80], //0.30, 0.80
        //                 //dithering: 0.5, //0..1 or false
        //                 strip: true
        //             })
        //         ]
        //     });

        //     console.log('Images optimized');
        // })();
    });

})


