// function to iterate through values and create a series of check boxes in the DOM


/**
 * Renders filter checkboxes on DOM
 * @param {Array} controls list of filter items
 * @param {*} div div to place filter controls
 */
function addControlFilter(controls, div, className){

    //build Divs and headings on the fly
    const parentDiv = document.getElementById("filters");
    const eDiv = document.createElement("div");
    eDiv.id = div;
    const filterHeading = document.createElement("h3");
    filterHeading.innerText = className;
    parentDiv.append(filterHeading, eDiv); 

    for (let item of controls) {
        //let eDiv = document.getElementById(div);
        let checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("checked", true);
        checkbox.setAttribute("class", className);
        checkbox.setAttribute("name", item);
        
        const label = document.createElement("label");
        label.setAttribute("for", checkbox);
        label.innerHTML = item +"<br/>";
        eDiv.append(checkbox, label);
    }
}


/**
 * Builds a list of filters based on the checkboxes and the array filterProperties and then compares
 * the game list to the selected properties to filter selected games
  * @returns {array} games2 a list of games that match the selected filters
 */
function filterControls(){
    let games2 = games; //initialize this to games so we can remove the if statement that resets the filters
    for (let i = 0; i < filterProperties.length; i++) {
        const controlArray = [];
        const controlFilters = document.querySelectorAll(filterDivs[i]);

        controlFilters.forEach(element => {
            if(element.checked){
                controlArray.push(element.name);
                }
        });
        
        games2 = games2.filter(game => controlArray.includes(game[filterProperties[i]]));
    }

    //quick and dirty buttons filter
    const maxButtons = document.getElementbyID("numButtons")
    games2 = games2.filter(game => game.buttons <= maxButtons.value);
    console.log(games2.length);   
    // Add logic here to generate an error message if there are no results
    return(games2);
}

// grab nplayer metadata
fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/nplayers.json')
    .then(data => {          
        const nplayerSet = new Set();
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            nplayerSet.add(element[1]);     
            nplayerArray.push(element);   //this is used by the Game object constructor to add data to game objects    
        }
        addControlFilter(nplayerSet, "nplayerFilter", "nplayer");    
         
    });

    