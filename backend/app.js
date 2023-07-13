const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstall = require('@ffmpeg-installer/ffmpeg');

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
const server = app.listen(port);

ffmpeg.setFfmpegPath(ffmpegInstall.path);

const videosDir = path.join(path.resolve('.'), 'videos');
app.use(express.static(videosDir));


app.get('/', (req, res) => {
    res.status(200).send(
        fs.readdirSync(videosDir, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(directory => directory.name)
    );
});


app.get('/:videoId', (req, res) => {
    const hlsPath = path.join(videosDir, req.params.videoId, 'master.m3u8');
    res.appendHeader('Content-Type', 'application/x-mpegURL');
    res.appendHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const stream = fs.createReadStream(hlsPath);
    stream.pipe(res);
});


app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();

    form.uploadDir = videosDir;
    
    form.parse(req, (e, fields, files) => {
        if (e) {
            console.log("Error parsing the files");
            return res.status(400).json({
                message: "There was an error parsing the files",
                error: e,
            });
        }
        
        // The file data
        const file = files.vid[0];
        // The file name with spaces replaced by dashes
        const fileName = file.originalFilename.replace(/\s+/g, '-');
        // full path of new file
        const newPath = path.join(videosDir, fileName);
        // fileName without extension
        const rawFileName = path.parse(newPath).name;

        fs.renameSync(file.filepath, newPath);

        const newDir = path.join(videosDir, path.parse(newPath).name);
        if (fs.existsSync(newDir)) {
            fs.rmSync(newPath);
            return res.status(500).json({
                status: "failure",
                message: "File already exists",
            });
        }

        fs.mkdir(newDir, (e) => {
            e && console.log(e);
        });

        ffmpeg(newPath)
        .addOptions([
            "-profile:v baseline",
            "-c:v libx264",
            "-level 3.0",
            "-start_number 0",
            "-hls_time 10",
            "-hls_list_size 0",
            "-master_pl_name master.m3u8",
            "-f hls"
        ])
        .output(`${path.join(newDir, rawFileName)}.m3u8`)
        .on('end', () => {
            console.log('ffmpeg done.');
            fs.rmSync(newPath);
            return res.status(200).json({
                status: "success",
                message: "File created successfully",
            });
        })
        .run();
    });
});


app.use((e, req, res, next) => {
    res.status = e.status || 500;
    res.json({
        type: 'error',
        message: e.message
    });
});

module.exports = app;