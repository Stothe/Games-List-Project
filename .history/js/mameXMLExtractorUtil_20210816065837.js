/**
 * Extracts metadata objects and loads them as an array of objects
 */

//TO DO:

// I want to get a good default scrape of AM to see how much wheel re-inventing there is here.

//array to hold objects
const metadataArray = [];

// update html while metadata is gathered
updateStatus("Please wait, gathering metadata, this may take a minute");

// hide the upload form while the metadata loads
$('#upload-form').hide();

// Metadata object constructor
class Metadata{
    constructor(rom, cloneOf, rotation, control, status, displayType, altRomName, buttons, players){
        this.rom = rom; // name
        this.cloneof = cloneOf; // cloneof
        this.rotation = rotation; //video.orientation
        this.control = control; // input.controls
        this.status = status; // driver.status
        this.displayType = displayType; //video.screen
        this.altRomname = altRomName; //romof
        this.buttons = buttons; // input.buttons
        this.players = players; // input.players
    }
}

fetcher('https://raw.githubusercontent.com/Stothe/Games-List-Project/main/mame2003.xml')
    .then(xml => {

        //update the web page status indicator
        

      $(xml).find('game').each(function(){
        let $romname = $(this).attr('name');
        let $cloneOf = $(this).attr('cloneof');
        let $rotation = $(this).find('video').attr('orientation');
        let $control = $(this).find('input').attr('control');
        let $status = $(this).find('driver').attr('status');
        let $displayType = $(this).find('video').attr('screen');
        let $altRomName = $(this).attr('romof');
        let $buttons = $(this).find('input').attr('buttons');
        let $players = $(this).find('input').attr('players');

        metadataArray.push(new Metadata($romname, $cloneOf, $rotation, $control, $status, $displayType, $altRomName, $buttons, $players));
        
      });
         
      updateStatus('metadata for ' + metadataArray.length + ' roms successfully loaded!');
      $('#upload-form').show();
      const uniqueControls = metadataArray.map(value => value.control);
      console.log(uniqueControls);

    });
