/* -*-java-*- */

function RestoreAssistant() {
    try {
	this.register = "/media/internal/www/backup/register.json";
    }
    catch (err) {
        Mojo.Log.error("RestoreAssistant()", err);
        Mojo.Controller.errorDialog(err);
    }
}

RestoreAssistant.prototype.setup = function() {
    try {

	this.listAttributes = { 
            itemTemplate:     "restore/itemTemplate",
            listTemplate:     "restore/listTemplate",
            swipeToDelete:    false,
            fixedHeightItems: true,
            reorderable:      false
	};
	this.listModel = {
            listTitle: $L("Backups"),
	    items: []
	}

	this.controller.setupWidget('BackupList', this.listAttributes, this.listModel);
        this.backupHandler = this.ShowBackup.bindAsEventListener(this)
        this.controller.listen('BackupList', Mojo.Event.listTap, this.backupHandler);

	new Ajax.Request(this.register, {
	    requestHeaders: {Accept: 'application/json'},
	    method:     'get',
	    onComplete: {},
	    onSuccess:  this.DisplayBackupList.bind(this),
	    onFailure:  this.FailedToReadRegister.bind(this)
	});
    }
    catch (err) {
        Mojo.Log.error("RestoreAssistant.setup", err);
        Mojo.Controller.errorDialog(err);
    }
}

RestoreAssistant.prototype.ShowBackup = function (event) {
    try {
	this.controller.stageController.pushScene(
	    {  name:"main", transition:Mojo.Transition.crossFade },
	       this.listModel.items[event.index].backupfile
	    );
    }
    catch (err) {
        Mojo.Log.error("RestoreAssistant.ShowBackup()", err);
        Mojo.Controller.errorDialog(err);
    }
}


RestoreAssistant.prototype.DisplayBackupList = function(transport) {
    try {
	if (transport.responseText === "") {
            Mojo.Controller.errorDialog("No backups registered so far");
            return;
        }

	var json  = transport.responseText.evalJSON(true);
	var backups = new Array();

	for (var i=0; i<json.backups.length; i++) {
	    backups.push( { "backupfile": json.backups[i].file } );
	}
	this.listModel.items = backups;
        this.controller.modelChanged(this.listModel);
    }
    catch (err) {
        Mojo.Log.error("RestoreAssistant.DisplayBackupList", err);
        Mojo.Controller.errorDialog(err);
    }
}

RestoreAssistant.prototype.FailedToReadRegister = function() {
    try {
	Mojo.Log.error("RestoreAssistant.prototype.FailedToReadRegister()");
	var items = new Array();
	items.push( { "backupfile": "No backups registered so far" } );
	this.listModel.items = items;
        this.controller.modelChanged(this.listModel);
    }
    catch (err) {
        Mojo.Log.error("RestoreAssistant.FailedToReadRegister", err);
        Mojo.Controller.errorDialog(err);
    }
}

RestoreAssistant.prototype.activate = function(event) {
}


RestoreAssistant.prototype.deactivate = function(event) {
}

RestoreAssistant.prototype.cleanup = function(event) {
}
