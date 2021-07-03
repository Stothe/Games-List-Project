/** this script will covert an EmulationStation games.xml file to
* an attract mode.txt file
* This script also incorporates the latest controls.xml I could find, which is sadly lacking
* there are some important differences between
*/

//variables

const heading = document.getElementById('heading');
const status = document.getElementById('status');
const stat = document.querySelector('.stat');
const gamesList = document.querySelector('.gamesList');
let games = [];
let gamesTxt = `#Name;Title;Emulator;CloneOf;Year;Manufacturer;Category;Players;Rotation;Control;Status;DisplayCount;DisplayType;AltRomname;AltTitle;Extra;Buttons \n`
let paths = [];
let pathSearch = 0;

// Main FUNCTIONS

/** 
* File Builder.  Creates the text file for user to download
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
      return data;

    } else {
      let data = await response.json();
      return await data;
    }

  } catch (error) {
    console.log("error happened " + error);
  }

}

/** Function to download Attract Mode games lists
 * creates a blob from completed game objects
* @arguements {string} content, file name, content type
* prompts user to save file
*/
function downloadToFile(content, filename, contentType){
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

/**
 * This function will update the status element on the page
 * @arguements {string} message (the message to display on the page)
 */
function updateStatus(message){
  document.querySelector('.stat').innerHTML = message;
}

 /**
   * Function to read user-provided XML and return it to the game list parser
   * @arguments {file} gamelist.xml file
   * wrapping the local file XML fetching into a promise
   * h/t https://simon-schraeder.de/posts/filereader-async/
   */
  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
        };
  
      reader.onerror = reject;
  
      reader.readAsBinaryString(file);
    })
  }
 


// Event Listeners

//When a file is uploaded via the button, kick off all the action and hide the form
document.querySelector('#odfxml').addEventListener('change', () => {
  event.preventDefault();

    gamesListParser();

  $("#upload").hide();
  updateStatus('Please Wait.  This may take several minutes. <br/> Your computer fan may spin up and sound like it is going to blast off');
});
// this is the main constructor where the game objects are created and stored. 
class Game{ 
    constructor(name, title, year, manufacturer, category){
  
        this.name = name;
        this.title = title;
        this.emulator = document.getElementById('emulator').value;
        this.cloneof = this.getAttribute('cloneof');
        this.year = year;
        this.manufacturer = manufacturer;
        this.category = category;
        this.players = this.getAttribute('players');
        this.rotation = this.getAttribute('rotation');
        this.control = this.getAttribute('control');
        this.status = this.getAttribute('status');
        this.displaycount = '';
        this.displaytype = this.getAttribute('displayType');
        this.altromname = this.getAttribute('altRomName');
        this.alttitle = '';
        this.buttons = this.getAttribute('buttons');
    }
      
    /**
     * Creates attributes from MAME.xml array object
     * @param {string} field - field to lookup
     * @return {string} value - value from returned object
     */
     getAttribute(field){
  
      try{
        const lookup = metadataArray.find( mame => mame.rom === this.name );
        
        // when you need to access a variable attribute, use bracket notation.
        let value = lookup[field];
  
        //add loop to replace undefined with empty string here
        if (value) {
          return value;
        } else {
          return '';
        }
  
      } catch {
        //console.log('lookup failed for ' + field);
        return '';
      }
  
    }
  
  }
  
/**
 * Main function to convert the user-provided XML gamelist, convert it and push entries to the games object.
 */
async function gamesListParser(){

    // fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/gamelist.xml')
    // .then(xml => {
    console.log("gamesListParser executing");
    const file = document.getElementById("odfxml").files[0];
    const fileData = await readFileAsync(file);

    //jQuery parser to convert text string from file to JSON-like objects
    let xmlData = $.parseXML(fileData);
    // special characters seem to be corrupting metadata.  Stripping those out fixes some but not all
    // https://www.w3schools.com/jsref/jsref_replace.asp
    // no, turns out $.parseXML jquery wasn't working on line 15.  Fixed that.
   
      //loop through all games and parse data into Game objects
      $(xmlData).find('game').each(function(){

        //ES lists contain romname within a path, we need to extract the rom
        let path = $(this).find("path").text(); 
          path = path.split("/");
          let pathNode = path.length - 1;
          path = path[pathNode];
          path = path.split(".");
          let $amName = path[0];
        
        let $title = $(this).find("name").text();
        // let $title = "placeholder";
        let $year = $(this).find("releasedate").text().substring(0, 4);
        let $manufacturer = $(this).find("publisher").text();
        let $category = $(this).find("genre").text();

        //Pulling out media paths in this function removes duplicate parsing from the findPaths function
        // wrapping in an IF statement so it can be set to only run until it gets a full path set.
        if(pathSearch === 0){
          let $marquee = $(this).find("marquee").text();
          let $video = $(this).find("video").text();
          let $image = $(this).find("image").text();

          // pushes the found paths to the renderPaths function and sets the counter to stop the loop  
          if($marquee && $video && $image){
              pathSearch = 1;
              renderPaths($image, $marquee, $video);
            }   
        }

        //create new Game object using the fields and add it to array
        // malformed entries seem to crap all over the list. Putting a check in
        if($title.length < 128) {
            
            games.push(new Game($amName, $title,  $year, $manufacturer, $category));
        } else {

            console.log("skipping " + $amName + " bad metadata detected" );
        }  
     });
  
      $('.stat').text(games.length + " games processed ");
  
      // launch the file builder
    buildTXTList();
  }

  // Helper Functions

 /**
 * Renders paths pulled from the game list as text on the index page
 * @arguements {string} (image, marquee, video)
 */
function renderPaths(image, marquee, video) {
  let paths = [image, marquee, video];

  for (let j=0; j < paths.length; j += 1) {
    paths[j] = paths[j].substring(0, paths[j].lastIndexOf("/"));
    $(".pathNotes").append(`<li>${paths[j]}</li>`)
   }
}
/**
 * Extracts metadata objects and loads them as an array of objects
 */

//TO DO:

// I want to get a good default scrape of AM to see how much wheel re-inventing there is here.
//array to hold objects
const metadataArray = [];

// update html while metadata is gathered
updateStatus("Please wait, gathering metadata, this may take a minute");

// hide the upload form while the metadata loads
$('#upload-form').hide();

// Metadata object constructor
class Metadata{
    constructor(rom, cloneOf, rotation, control, status, displayType, altRomName, buttons, players){
        this.rom = rom; // name
        this.cloneof = cloneOf; // cloneof
        this.rotation = rotation; //video.orientation
        this.control = control; // input.controls
        this.status = status; // driver.status
        this.displayType = displayType; //video.screen
        this.altRomname = altRomName; //romof
        this.buttons = buttons; // input.buttons
        this.players = players; // input.players
    }
}

fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/mame2003.xml')
    .then(xml => {

        //update the web page status indicator
        

      $(xml).find('game').each(function(){
        let $romname = $(this).attr('name');
        let $cloneOf = $(this).attr('cloneof');
        let $rotation = $(this).find('video').attr('orientation');
        let $control = $(this).find('input').attr('control');
        let $status = $(this).find('driver').attr('status');
        let $displayType = $(this).find('video').attr('screen');
        let $altRomName = $(this).attr('romof');
        let $buttons = $(this).find('input').attr('buttons');
        let $players = $(this).find('input').attr('players');

        metadataArray.push(new Metadata($romname, $cloneOf, $rotation, $control, $status, $displayType, $altRomName, $buttons, $players));
        
      });
         
      updateStatus('metadata for ' + metadataArray.length + ' roms successfully loaded!');
      $('#upload-form').show();

    });
