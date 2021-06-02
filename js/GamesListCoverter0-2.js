/** this script will covert an EmulationStation games.xml file to
* an attract mode.txt file
* This script also incorporates the latest controls.xml I could find, which is sadly lacking
* there are some important differences between
*/

//variables
let heading = document.getElementById('heading');
let status = document.getElementById('status');
let stat = document.getElementById('stat');
let gamesList = document.querySelector('.gamesList');
let controls = [];
let games = [];
var gamesTxt = `#Name;Title;Emulator;CloneOf;Year;Manufacturer;Category;Players;Rotation;Control;Status;DisplayCount;DisplayType;AltRomname;AltTitle;Extra;Buttons \n`
let paths = [];

// Objects
class Controls{
  constructor(rom, controls, buttons){
    this.rom = rom;
    this.controls = controls;
    this.buttons = buttons;
  }

}

class Game{ //I'm convinced I can build this with amHeaders, but I can't figure it out yet
  constructor(name, title, emulator, cloneof, year, manufacturer, category, players, control, buttons){
    this.name = name;
    this.title = title;
    this.emulator = emulator;
    this.cloneof = cloneof;
    this.year = year;
    this.manufacturer = manufacturer;
    this.category = category;
    this.players = players;
    this.rotation = " ";
    this.control = control;
    this.status = " ";
    this.displaycount = " ";
    this.displaytype = " ";
    this.altromname = " ";
    this.alttitle = " ";
    this.buttons = buttons;

  }

}

// Main FUNCTIONS

/** Downloads XML file for controls.xml and pushes desired fields to controls[]
* @argument url to controls.xml
*/
fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/controls.xml')
  .then(xml => {
    $('.stat').text("Please wait, adding controls");
    console.log("fetching controls xml");
     $(xml).find('game').each(function(){
      let $romname = $(this).attr('romname');
      let $control = $(this).find('control').attr('name');
      let $buttons = $(this).find('player').attr('numButtons');
        //console.log($romname +": " + $control);
        controls.push(new Controls($romname, $control, $buttons));
     });

    $('.stat').text("Controls data loaded!"); //update status <p>
//  console.log(controls);
  });

/*
* Parses XML gameslist provided by user
* Loads values into games objects in games array
* adds data from controls Objects
*
*/
function gamesListParser(){
  console.log("gamesListParser executing");
  const file = document.getElementById("odfxml").files[0];
  const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
    var xmlData = $.parseXML(reader.result);

    //search for paths for media
         let test = $(xmlData).find('game');

           for (let i=0; i<test.length; i += 1) {
             let image;
             let marquee;
             let video;
             try {
               image = test[i].querySelector("image").innerHTML;
               marquee = test[i].querySelector("marquee").innerHTML;
               video = test[i].querySelector("video").innerHTML;
             } catch {console.log("not all folders matched")}


             if(image && marquee && video){ // need to make sure it found all fields
               let paths = [image, marquee, video];

                 for (let j=0; j < paths.length; j += 1) {
                   paths[j] = paths[j].substring(0, paths[j].lastIndexOf("/"));
                   $(".pathNotes").append(`<li>${paths[j]}</li>`)
                  }

              break; // we don't need to enumare the paths for every game. we assume all games use the same paths

                }
                $('.stat').text("Meda paths discovered.");
            }

    //loop through all games and parse data into Game objects
    $(xmlData).find('game').each(function(){
      let path = $(this).find("path").text(); //gets the path, we need the filename this is incredibly messy
        path = path.split("/");
        let pathNode = path.length - 1;
        path = path[pathNode];
        path = path.split(".");
        let amName = path[0];
      $('.currentgame').text("Processing " + amName);

      let title = $(this).find("name").text();
      // let emulator = "Arcade"; //no emulator in xml gamelist but required for AM. Will add a required field
      let clone = " "; //I could find no instances for CloneOf
      let year = $(this).find("releasedate").text().substring(0, 4);
      let manufacturer = $(this).find("publisher").text();
      let category = $(this).find("genre").text();
      let players = $(this).find("players").text();
      let myControl;
      let myButtons;
      let emulator = document.getElementById("emulator").value;


      //pull in matching data from controls array
      let controllerData = controls.find(x => x.rom === amName);

      if(controllerData){ //a null entry will break the script
      myControl = controllerData.controls;
      myButtons = controllerData.buttons;

      } else {
      myControl = "n/a";
      myButtons = "n/a"
      }
      //add shiny new object to Games
      games.push(new Game(amName, title, emulator, clone, year, manufacturer, category, players, myControl, myButtons));

   });

    $('.stat').text(games.length + " games processed");

    console.log(games[5]);

    // launch the file builder
  buildTXTList();
  }
}

/* File Builder.  Creates downloadable txt file
*
*/
/* File Builder.  Creates downloadable txt file
*
*/
function buildTXTList(){
    for (let i=0; i < games.length; i += 1) {
    for (const property in games[i]){
      gamesTxt = gamesTxt + `${games[i][property]};`;

    }
    let gamesTxtFix = gamesTxt.slice(0, -1);
    gamesTxt = gamesTxtFix + "\n";
  }
  downloadToFile(gamesTxt, 'Arcade.txt', 'text/plain' );
}

// Helper Functions

/** fetch helper to return data via fetch()
* loop returns response as txt if XML or as JSON
* @argument URL to fetch
* @returns data from response
*/
async function fetcher(url){

  try {
    let response = await fetch(url);

    if(url.includes("xml")){
      let data = await response.text();
      return await data;

    } else {
      let data = await response.json();
      return await data;
    }

  } catch (error) {
    console.log("error happened " + error);
  }

}

/** Function to download Attract Mode games lists
* @arguements {string} content, file name, content type
* No @return but prompts user to save file
*/
function downloadToFile(content, filename, contentType){
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};


// Event Listeners

//When a file is uploaded via the button, kick off all the action and hide the form
document.querySelector('#odfxml').addEventListener('change', () => {
  event.preventDefault();
  gamesListParser();
  $("#upload").hide();
});
