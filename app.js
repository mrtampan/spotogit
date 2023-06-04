async function runningApp() {
  const env = require("dotenv").config();
  const _ = require("lodash");

  // Initialization and Authentication
  const Spotify = require("spotifydl-core").default; // Import the library
  const spotify = new Spotify({
    // Authentication

    clientId: env.parsed.CLIENT_ID_SPOTIFY, // <-- add your own clientId
    clientSecret: env.parsed.CLIENT_SECRET_SPOTIFY, // <-- add your own clientSecret
  });

  // Declaring the respective url in 'links' object
  const links = {
    song: process.argv[2], // Url of the album you want to gather info about
  };
  const fs = require("fs-extra");

  // Engine

  let songname = "";
  let musicList = [];
  const data = await spotify.getTrack(links.song); // Waiting for the data 🥱
  console.log("Downloading: ", data.name, "by:", data.artists.join(" ")); // Keep an eye on the progress
  const song = await spotify.downloadTrack(links.song); // Downloading goes brr brr
  console.log("Downloading skuyyy: ", song); // Keep an eye on the progress
  await fs.writeFile("music/" + data.name + ".mp3", song); // Let's write the buffer to the woofer (i mean file, hehehe)
  console.log("Berhasil Download: ", data.name);
  songname = data.name + " by:" + data.artists.join(" ");
  sourcename = "music/" + data.name + ".mp3";

  console.log(sourcename);
  console.log(songname);

  let musicData = await fs.readFile("musiclist.json");

  musicData = JSON.parse(musicData);
  musicData.music.push({ name: songname, source: sourcename });

  await fs.writeFileSync(
    "musiclist.json",
    JSON.stringify(musicData),
    function (error) {
      console.log("Written file 'musiclist.json'... ");
    }
  );
}
runningApp();
