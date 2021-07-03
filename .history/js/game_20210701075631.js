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
        this.players = this.getAttribute('players');
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
  
  }
  