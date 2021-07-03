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

// Objects

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
    
    //setter
    //set emulator(value) { document.getElementById('emulator').value};
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

// Main FUNCTIONS



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

// Event Listeners


//When a file is uploaded via the button, kick off all the action and hide the form
document.querySelector('#odfxml').addEventListener('change', () => {
  event.preventDefault();

    gamesListParser();

  $("#upload").hide();
  updateStatus('Please Wait.  This may take several minutes. \n Your computer fan may spin up and sound like it is going to blast off');
});


