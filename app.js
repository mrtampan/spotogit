const fs = require('fs-extra');
const { exec } = require('child_process');

async function runningApp() {
  let musicMeta = '';
  let title = '';
  let musicData = await fs.readFile('musiclist.json');

  musicMeta = fs.readFileSync('./spotdl_data/data.spotdl');
  musicMeta = JSON.parse(musicMeta);
  for (let i = 0; i < musicMeta[0].artists.length; i++) {
    title += musicMeta[0].artists[i];
    title += i == musicMeta[0].artists.length - 1 ? '' : ', ';
  }
  title += ' - ' + musicMeta[0].name;

  if (!fs.existsSync('./music/' + title + '.mp3')) {
    process.exit(1); // Menutup program dengan status 1 (error)
  }
  musicData = JSON.parse(musicData);
  musicData.music.push({
    name: title,
    source: './music/' + title + '.mp3',
  });

  fs.writeFileSync('musiclist.json', JSON.stringify(musicData));

  exec('rm -rf ./spotdl_data/data.spotdl');
}

runningApp();
