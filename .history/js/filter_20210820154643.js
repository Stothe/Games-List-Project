// function to iterate through values and create a series of check boxes in the DOM


/**
 * Renders filter checkboxes on DOM
 * @param {Array} controls list of filter items
 * @param {*} div div to place filter controls
 */
function addControlFilter(controls, div){
    for (let item of controls) {
        let eDiv = document.getElementById(div);
        let checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("checked", true);
        checkbox.setAttribute("class", "control");
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
function filterControls(div){

    const controlArray = [];
    const controlFilters = document.querySelectorAll(div);
    // controlFilters = controlFilters.find
    controlFilters.forEach(element => {
        if(element.checked == false){
            controlArray.push(element.name);
            }
    });
    return(controlArray);
    console.log(conrolArray);
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
        addControlFilter(nplayerSet, "nplayerFilter");    
         
    });

    