const { spawn } = require('child_process');
const fs = require('fs-extra');

async function runningApp() {
  const url = process.argv[2];

  let musicMeta = '';
  let title = '';
  let musicData = await fs.readFile('musiclist.json');

  const spotdlmeta = spawn('spotdl', [
    'save',
    url,
    '--save-file',
    './spotdl_data/data.spotdl',
  ]);
  spotdlmeta.on('close', (code) => {
    console.log(`Proses title meta selesai dengan kode: ${code}`);
    musicMeta = fs.readFileSync('./spotdl_data/data.spotdl');
    musicMeta = JSON.parse(musicMeta);
    for (let i = 0; i < musicMeta[0].artists.length; i++) {
      title += musicMeta[0].artists[i];
      title += i == musicMeta[0].artists.length - 1 ? '' : ', ';
    }
    title += ' - ' + musicMeta[0].name;
  });

  const spotdlfile = spawn('spotdl', [url, '--output', './music']);
  spotdlfile.on('close', (code) => {
    console.log(`Proses download file selesai dengan kode: ${code}`);
    if (!fs.existsSync('./music/' + title + '.mp3')) {
      setTimeout(() => {
        console.log('tunggu');
      }, 6000);
    }
    if (!fs.existsSync('./music/' + title + '.mp3')) {
      process.exit(1); // Menutup program dengan status 1 (error)
    }
    musicData = JSON.parse(musicData);
    musicData.music.push({
      name: title,
      source: './music/' + title + '.mp3',
    });

    fs.writeFileSync('musiclist.json', JSON.stringify(musicData));
  });
}

runningApp();
