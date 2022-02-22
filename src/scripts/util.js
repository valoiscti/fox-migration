//can be used as javascript-debugging-helper, instead of alert-boxes... 
function print(text) {
	document.getElementById("console").innerHTML = document.getElementById("console").innerHTML + "<br />\n" + text;
}

function compareOptionText(a, b){
    return a.text != b.text ? a.text < b.text ? -1 : 1 : 0;
}

function sortOptions(list){
	
	if (list == null) {
		return;
	}
	
    var items = list.options.length;
    var tmpArray = new Array(items);

    for (i = 0; i < items; i++) {
        tmpArray[i] = list.options[i];
	}

    // sort options using given function
    tmpArray.sort(compareOptionText);
    
    // make copies of sorted options back to list
    var selectedValue = list.options[list.selectedIndex].value;
    var index = 0;
    for (i = 0; i < items; i++) {
        list.options[i] = new Option(tmpArray[i].text, tmpArray[i].value, false, false);
        if (tmpArray[i].value == selectedValue) {
        	index = i;
        }
	}
	list.selectedIndex = index;
}

function autocompleteDateTime(dateTimeField, toAppend) {
	if (dateTimeField != null && dateTimeField.value != null) {
		var objRegExp = /^\d{1,2}(\.)\d{1,2}\1\d{2,4}$/
		var dateString = "";
		if (objRegExp.test(dateTimeField.value)) {
			var dateArray = dateTimeField.value.split("."); 
			if (dateArray[0].length == 1) {
				dateString += "0";
			}
			dateString += dateArray[0] + ".";
			if (dateArray[1].length == 1) {
				dateString += "0";
			}
			dateString += dateArray[1];
			dateString += ".";
			if (dateArray[2].length == 2) {
				dateString += "20";
			} else if (dateArray[2].length == 3) {
				dateString += "2";
			}
			dateString += dateArray[2];
			dateString += toAppend;
			dateTimeField.value = dateString;
		}
	}
}

function scaleNumber(field, scale) {
	if (field && field.value) {
		field.value = Number(field.value).toFixed(scale);
	}
}

function padNumber(field, char, length) {
	var objRegExp = /^\d+$/
	if (field && field.value && objRegExp.test(field.value)) {
		pad(field, char, length);
	}
}

function pad(field, char, length) {
	if (field && field.value) {
		var val = field.value;
		while (val.length < length) {
			val = char + val;
		}
		field.value = val;
	}
}

function hideElement(elementId) {
	var element = document.getElementById(elementId);
	if (element) { 
		element.style.visibility = "hidden";
	}
}

function formatIsoDate(input) {
	var parts = input.split('-');
	return parts[2]+'.'+parts[1]+'.'+parts[0];
}
