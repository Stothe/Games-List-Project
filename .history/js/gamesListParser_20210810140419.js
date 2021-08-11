
/**
 * Main function to convert the user-provided XML (EmulationStation) gamelist, convert it and push entries to the games object.
 * 
 * Functionality added to simply take data from an attract mode list .txt and push those to games objects.
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

        // add game to object array
        pushGame($amName, $title, $year, $manufacturer, $category);

    });

    // these last two commands exist within the function, possibly should be their own helper
    $('.stat').text(games.length + " games processed "); //updates DOM
  
    // launch the file builder
    buildTXTList();
  }


  /**
   * Update existing Attract mode meta data list
   * 
   */
async function amMetaDataBuild() {
  console.log("AM button works!");
  console.log("gamesListParser (AM edition) executing");
  const file = document.getElementById("odfxml").files[0];
  const fileData = await readFileAsync(file);

  // console.log(fileData);

  // split into 2d array /n by ;

  // line
  let amListSplit = fileData.split("\n");
  let amListSplitGames = [];
  console.log(amListSplit[2]);

  // split each line, push into array
  for (let index = 1; index < amListSplit.length; index++) {
    const element = amListSplit[index].split(";");
    amListSplitGames.push(element);    
  }
 console.log(amListSplitGames[2]);
}


/**
 * Push a rom as a new Game object based on extracted data from appropriate game list functions
 * 
 * @param {string} name 
 * @param {string} title 
 * @param {string} year 
 * @param {string} manufacturer 
 * @param {string} category 
 */
function pushGame(name, title, year, manufacturer, category) {

  // sometimes bad metadata can slip through, this skips games in that case
  if(title.length < 128) { 
    games.push(new Game(name, title,  year, manufacturer, category));
  } else {
      console.log("skipping " + name + " bad metadata detected" );
  }  
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

