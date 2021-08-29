// function to iterate through values and create a series of check boxes in the DOM

function enumCategories(){
    // iterate games objects, find each unique metadata entry
    // ht: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    // categories are not in the mame 2k3 xml file
    
}




function addControlFilter(controls, div){
    for (let item of controls) {
        let checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("checked", true);
        checkbox.setAttribute("class", "control");
        checkbox.setAttribute("name", item);
        
        const label = document.createElement("label");
        label.setAttribute("for", checkbox);
        label.innerHTML = item +"<br/>";
        div.append(checkbox, label);
    }
}



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
    console.log("Selected filters: " + controlArray);
}