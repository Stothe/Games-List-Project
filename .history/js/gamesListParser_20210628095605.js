async function gamesListParser(){



    // fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/gamelist.xml')
    // .then(xml => {
    console.log("gamesListParser executing");
    const file = document.getElementById("odfxml").files[0];
    let xmlData = await readFileAsync(file);
    // findPaths(xmlData);
      
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
        let $year = $(this).find("releasedate").text().substring(0, 4);
        let $manufacturer = $(this).find("publisher").text();
        let $category = $(this).find("genre").text();
        let $image = $(this).find("image").text();
        console.log($image);
  
        //create new Game object using the fields and add it to array
        games.push(new Game($amName, $title,  $year, $manufacturer, $category));
     });
  
      $('.stat').text(games.length + " games processed");
  
      // launch the file builder
    buildTXTList();
  }

  /**
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

// function findPaths(xmlData){
//     //this is very broken still

//     //search for paths for media


//     $(xmlData).find('game').each(function(){
      
//       try {
//         let $image = $this.find('image').text();
//         // marquee = test[i].querySelector("marquee").innerHTML;
//         // video = test[i].querySelector("video").innerHTML;
//         console.log($image);
//       } catch {console.log('error', Error.message);}


//     //   if(image && marquee && video){ // need to make sure it found all fields
//     //     let paths = [image, marquee, video];

//     //       for (let j=0; j < paths.length; j += 1) {
//     //         paths[j] = paths[j].substring(0, paths[j].lastIndexOf("/"));
//     //         $(".pathNotes").append(`<li>${paths[j]}</li>`)
//     //        }

       

//     //      }
//          $('.stat').text("Meda paths discovered.");
//      })
//     }
