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
    filterHeading.innerText(controls);
    console.log(filterHeading);
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
 * create array of selected filters for game list creation
 * @param {*} div 
 * @returns array of checked boxes in selected div
 */
function filterControls(){
    let games2 = [];
    for (let i = 0; i < filterProperties.length; i++) {
        const controlArray = [];
        const controlFilters = document.querySelectorAll(filterDivs[i]);
        // console.log(filterDivs[i]);
        // controlFilters = controlFilters.find
        controlFilters.forEach(element => {
            if(element.checked){
                controlArray.push(element.name);
                }
        });
        console.log(controlArray);
        console.log(games2.length);

        // if this is the first filter add items to games2 array.  Subsequent filters will remove from Games2
        if(games2.length === 0){
            games2 = games.filter(game => controlArray.includes(game[filterProperties[i]]));
            
        } else {
            games2 = games2.filter(game => controlArray.includes(game[filterProperties[i]]));
            
        }
        
    }

    console.log(games2.length);   
    return(games2);
}

// grab nplayer metadata
fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/nplayers.json')
    .then(data => {          
        const nplayerSet = new Set();
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            nplayerSet.add(element[1]);     
            nplayerArray.push(element);       
        }
        addControlFilter(nplayerSet, "nplayerFilter", "nplayer");    
         
    });

    