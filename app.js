const { exec } = require('child_process');
const fs = require('fs-extra');

async function runningApp() {
  const url = process.argv[2];

  let musicMeta = '';
  let title = '';
  let musicData = await fs.readFile('musiclist.json');

  execPromise('spotdl save ' + url + ' --save-file ./spotdl_data/data.spotdl')
    .then(() => {
      musicMeta = fs.readFileSync('./spotdl_data/data.spotdl');
      musicMeta = JSON.parse(musicMeta);
      for (let i = 0; i < musicMeta[0].artists.length; i++) {
        title += musicMeta[0].artists[i];
        title += i == musicMeta[0].artists.length - 1 ? '' : ', ';
      }
      title += ' - ' + musicMeta[0].name;
    })
    .catch((err) => console.log(err));

  execPromise('spotdl ' + url + ' --output ./music')
    .then(() => {
      musicData = JSON.parse(musicData);
      musicData.music.push({
        name: title,
        source: './music/' + title + '.mp3',
      });

      fs.writeFileSync('musiclist.json', JSON.stringify(musicData));
    })
    .catch((err) => console.log(err));

  setTimeout(() => {
    console.log('so sad');
    console.log('Success');
  }, 5000);
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout); // Mengembalikan hasil dari stdout
    });
  });
}

runningApp();
