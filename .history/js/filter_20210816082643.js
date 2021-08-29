// function to iterate through values and create a series of check boxes in the DOM

function enumCategories(){
    // iterate games objects, find each unique metadata entry
    // ht: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    // categories are not in the mame 2k3 xml file
    
}



// trying sets
function enumControls(value) {
    const filterSet = new Set();
    filterSet.add(value);
    return filterSet;
}

function addControlFilter(controls){
    for (let item of controls) {
        let checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("checked", true);
        checkbox.setAttribute("id", item);
        
        const label = document.createElement("label");
        label.setAttribute("for", checkbox);
        label.innerText = item +"<br/>";
        gamesList.append(checkbox, label);
        

    }
}