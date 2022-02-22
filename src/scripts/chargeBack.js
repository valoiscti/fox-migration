  function prepareSelectedTransactions(listElementName) {
  	var hiddenWidget = document.getElementById(listElementName);
  	var chkGroup = document.getElementsByName('checkBoxGroup');
  	var len = chkGroup.length;
  	var isTrxChecked = false;
  	hiddenWidget.value = "";
  	for(i=0;i < len;i++) {
 		if(chkGroup[i].checked) {
 			if (hiddenWidget.value.length > 0) {
				hiddenWidget.value += ";";
 			}
			
 			hiddenWidget.value += document.getElementById('ckb_line_id_'+chkGroup[i].value).value;
 			isTrxChecked = true;
 		}
	}
  	return isTrxChecked;
  }
  
  function display(choice) {
    if (choice == 'terminal') {
       showAllClassElement('terminalView');
       hideAllClassElement('hostView');
    } else {
       showAllClassElement('hostView');
       hideAllClassElement('terminalView'); 
    }
 }
 
 function showAllClassElement(className) {
 	var classNameElements = document.getElementsByClassName(className);
	for (var i = 0; i < classNameElements.length; i ++) {
	    classNameElements[i].style.display = 'inline'; 
	}
 }
 
 function hideAllClassElement(className) {
 	var classNameElements = document.getElementsByClassName(className);
	for (var i = 0; i < classNameElements.length; i ++) {
	    classNameElements[i].style.display = 'none'; 
	}
 }