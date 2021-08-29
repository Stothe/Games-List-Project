// this is the main constructor where the game objects are created and stored. 
class Game{ 
    constructor(name, title, year, manufacturer, category){
  
        this.name = name;
        this.title = title;
        this.emulator = document.getElementById('emulator').value;
        this.cloneof = this.getAttribute('cloneof');
        this.year = year;
        this.manufacturer = manufacturer;
        this.category = category;
        //this.players = this.getAttribute('players');
        this.players = this.getPlayers(this.name);
        this.rotation = this.getAttribute('rotation');
        this.control = this.getAttribute('control');
        this.status = this.getAttribute('status');
        this.displaycount = '';
        this.displaytype = this.getAttribute('displayType');
        this.altromname = this.getAttribute('altRomName');
        this.alttitle = '';
        this.buttons = this.getAttribute('buttons');
    }
      
    /**
     * Creates attributes from MAME.xml array object
     * @param {string} field - field to lookup
     * @return {string} value - value from returned object
     */
     getAttribute(field){
  
      try{
        const lookup = metadataArray.find( mame => mame.rom === this.name );
        
        // when you need to access a variable attribute, use bracket notation.
        let value = lookup[field];
  
        //add loop to replace undefined with empty string here
        if (value) {
          return value;
        } else {
          return '';
        }
  
      } catch {
        //console.log('lookup failed for ' + field);
        return '';
      }
  
    }

    //test for array
    //h/t https://lage.us/Javascript-Item-in-2d-Array-Using-indexOf.html
    getPlayers(itemtofind) {
      const index = [].concat.apply([], ([].concat.apply([], nplayerArray))).indexOf(itemtofind);
                  
      // return "false" if the item is not found
      if (index === -1) { return false; }
      
      // Use any row to get the rows' array length
      // Note, this assumes the rows are arrays of the same length
      const numColumns = nplayerArray[0].length;
      
      // row = the index in the 1d array divided by the row length (number of columns)
      const row = parseInt(index / numColumns);
      
      // col = index modulus the number of columns
      const col = index % numColumns;
      return nplayerArray[row][1]; 
  }
  
  }
  