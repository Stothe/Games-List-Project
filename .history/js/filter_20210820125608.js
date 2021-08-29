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
        if(element.checked){
            controlArray.push(element.name);
        }
    });
    return(controlArray);
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
        indexOf2dArray(nplayerArray, "gepoker");   
    });

    //test for array
    //h/t https://lage.us/Javascript-Item-in-2d-Array-Using-indexOf.html
    function indexOf2dArray(nplayerArray, itemtofind) {
        index = [].concat.apply([], ([].concat.apply([], nplayerArray))).indexOf(itemtofind);
                    
        // return "false" if the item is not found
        if (index === -1) { return false; }
        
        // Use any row to get the rows' array length
        // Note, this assumes the rows are arrays of the same length
        numColumns = nplayerArray[0].length;
        
        // row = the index in the 1d array divided by the row length (number of columns)
        row = parseInt(index / numColumns);
        
        // col = index modulus the number of columns
        col = index % numColumns;
        console.log("item to find is at " + row +", " + col)
        return [row, col]; 
    }