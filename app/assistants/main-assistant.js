/* -*-java-*- */

function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
    try {
	this.wiki    = "itw.html";
	this.wikidir = "/media/internal/www";
	this.wikiurl = "file:///media/internal/www/itw.html";
	Mojo.Log.error("URI: " + this.wikiurl);
	/* setup the menu */
	this.appMenuModel = {
            visible: true,
            items: [
		Mojo.Menu.editItem,
                {
		    label: "About",
		    command: 'do-about'
                }
            ]
        };
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: false}, this.appMenuModel);

	Mojo.Log.error(this.wikiurl);
	
	//  Setup up the WebView widget 
        this.controller.setupWidget('storyWeb', { 
               url: this.wikiurl
          }, 
          this.storyViewModel = { 
          } 
        ); 

	if (this.controller.stageController.setWindowOrientation) {
	    this.controller.stageController.setWindowOrientation("free");
	}

	var stageDocument = this.controller.stageController.document; 
	Mojo.Event.listen(stageDocument, Mojo.Event.stageActivate,   this.activateWindow.bindAsEventListener(this) );
	Mojo.Event.listen(stageDocument, Mojo.Event.stageDeactivate, this.deactivateWindow.bindAsEventListener(this) );	
	}
    catch (err) {
        Mojo.Log.error("MainAssistant.setup()", err);
        Mojo.Controller.errorDialog(err);
    }
}

MainAssistant.prototype.handleCommand = function (event) {
    try {
	this.controller=Mojo.Controller.stageController.activeScene();
	if(event.type == Mojo.Event.command) {      
            switch (event.command) {
            case 'do-about':
		this.controller.stageController.pushScene( { name:"showabout",   transition:Mojo.Transition.crossFade} );
		break;
	    }
	}
    }
    catch (err) {
        Mojo.Log.error("MainAssistant.handleCommand()", err);
        Mojo.Controller.errorDialog(err);
    }
}

    
MainAssistant.prototype.deactivate = function(event) {
}

MainAssistant.prototype.activate = function(event) {
}

MainAssistant.prototype.deactivateWindow = function(event) {
  this.active = false;
}

MainAssistant.prototype.activateWindow = function(event) {
  this.active = true;
}

MainAssistant.prototype.cleanup = function(event) {
}

