
/**
 * Main function to convert the user-provided XML (EmulationStation) gamelist, convert it and push entries to the games object.
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
        pushGame($amName, $title, $year, $manufacturer, $category);
    });

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

        //create new Game object using the fields and add it to array
        // malformed entries seem to crap all over the list. Putting a check in
        //TURN THIS INTO A  STANDALONE FUNCTION
        if($title.length < 128) {
            
          games.push(new Game($amName, $title,  $year, $manufacturer, $category));
      } else {

          console.log("skipping " + $amName + " bad metadata detected" );
      }  
    }


  
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
