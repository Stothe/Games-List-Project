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

  //add logic to fire off a new function if a .txt file is uploaded
  let onlyAM = document.getElementById("amlist").checked;
  console.log("onlyAM = " + onlyAM);
  if(onlyAM){
    alert("AM button works!");
  } else {
   gamesListParser();
  }

  $("#upload").hide();
  updateStatus('Please Wait.  This may take several minutes. <br/> Your computer fan may spin up and sound like it is going to blast off');
});
