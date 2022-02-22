

function showDialog(target, key){
  var text;
  new Ajax.Request('ajax/dialog.ajax', {
      method: 'get',
      parameters: {
      key: key,
      target: target
      },
      requestHeaders: [ "Pragma", "no-cache", "Cache-Control", "must-revalidate", "If-Modified-Since", document.lastModified],
      onSuccess: function(transport){
    	  
    	  var doc = transport.responseXML;
    	  text = doc.getElementsByTagName('content')[0].firstChild.nodeValue;

    	  var node = document.getElementById('content');
    	  node.innerHTML = text;
   
          var dialog = dojo.widget.byId("dialog");

          var close = document.getElementById("closeIcon"); 
 	      dialog.setCloseControl(close);		

 	      dialog.show();

     },
     onFailure: function(transport){
  	      alert('Something went wrong...');
     }
   });
 }