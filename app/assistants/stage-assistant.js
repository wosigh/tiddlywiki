function StageAssistant () {

}

StageAssistant.prototype.setup = function() {
    this.controller.pushScene("main");
}
StageAssistant.prototype.handleCommand = function(event) {
      if(event.type == Mojo.Event.back) {
              event.preventDefault();              
      }  
}
