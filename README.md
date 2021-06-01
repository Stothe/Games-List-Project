# Games-List-Project

This is a javascript project for use with RetroPi retrogaming projects.  It is designed to convert an EmulationStation style Games list .xml into an Attract Mode emulator.txt file.  The script also pulls the most recent controls.xml data (that I could find) and integrates it into the outputted games list.txt file.

This is focused on arcade games, it has not been designed or tested for use with consoles or other ROM sources.

There are some differences between EmulationStation and Attract Mode game lists.  The biggest one being that ES stores the media locations (screenshots, marquees and videos) in the games list XML where Attract Mode does not.  To help compensate for this, when the script runs and provides the converted file, the web page will display a list of locations as a "guess" as to where ES has stored your video files.  AM by default looks in the rom folders.  But certain scapers for ES will put the media in some sort of downloads file.  If your ES files are located in the rom folders, you shouldn't need to do anything.  But if it's using other folders you'll want to configure the emulator settings in AM's settings to point to the right folders (or copy the media files to the rom folders).

How to use it:

Since this is web-based you'll need to download your desired EmulationStation games list to the location where you'll be running this tool.  The default location for the ES games list is ~/.emulationstation/gamelists  Note .emulationstation is a hidden folder so you may need to show hidden files on your favorite SFTP tool. There will be a folder for your system (like Arcade) and inside of there you'll see the gamelist.xml file.  Download that file to your desktop.

There's 2 ways to run the script from here.  I have a version running on my site at https://tropicade.org/tools/convert-emulationstation-attract-mode/

Alternately, download index.html and the JS folder to a folder on your computer and then open index.html in your browser.

In the form on the web page, change the name of the Attract Mode emulator if need be (it's set to arcade by default) and then upload your .xml games list file.  

The script will then process your file along with the controls.xml file that's uploaded here and convert the results into a text file you'll be prompted to download.

Drop that file into your Attract Mode games list location the default location is ~/.attract/emulators  the file should be named the same as your emulator, so using arcade, it should be Arcade.txt (notice the upper case A).  You should probably make a backup of the file you'll be replacing to be safe.
