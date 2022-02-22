var currentField = null;
function checkKey(event, element) {
	if (!event) {		//ie? => special treatment, as ususal
		var event = window.event;
	}
	switch(event.type) {
		case 'keydown':
			if (event.keyCode == 13 || event.keyCode == 9) {  //enter or tab
				if ((event.modifiers && event.modifiers & Event.SHIFT_MASK) || window.event && window.event.shiftKey) {
					focusPrevious(element);
				} else {
					focusNext(element);						
				}
				event.cancelBubble = true;	//stop propagation of event to avoid submit on enter
				if (event.stopPropagation) {
					event.stopPropagation();
				}
				return false;
			} 
			return true;
			break;
		case 'keypress':
			if (!(event.keyCode == 13 || event.keyCode == 9)) {  //enter or tab
				currentField = element;
			} 
			break
		case 'keyup':
			if (currentField == element && element.maxLength > 0 && element.value.length >= element.maxLength) {
				focusNext(element);
			}
			break;
	}
}

function selectElement(element) {
	currentField = null;
	if (element.select) {
		element.select();		
	}
}

//workaround because when focussing a button, the last input field is not deselected
function deselectElement(element) {
	element.value = element.value;
}

function pad(element, char) {
	if (char && char.length == 1 && element.value && element.value.length > 0) {
		while (element.value.length < element.maxLength) {
			element.value = char + element.value;
		}
	}
}

function focusFirst(form) {
	fields = getFieldsSortedByTabIndex(form);
	focusElement(fields[0]);
}

//sets focus on next input-field (by tabindex). 
function focusNext(element) {
	fields = getFieldsSortedByTabIndex(element.form);
	targetIndex = element.tabIndex-1; 			//current field
	focused = false;
	while (!focused) {
		targetIndex = targetIndex < fields.length-1 ? targetIndex+1 : 0;
		if (!fields[targetIndex].disabled) {
			focusElement(fields[targetIndex]);
			focused = true;
		} 
	}
}

//sets focus on previous input-field (by tabindex). 
function focusPrevious(element) {
	fields = getFieldsSortedByTabIndex(element.form);
	targetIndex = element.tabIndex-1; 			//current field
	focused = false;
	while (!focused) {
		targetIndex = targetIndex > 0 ? targetIndex-1 : fields.length-1;
		if (!fields[targetIndex].disabled) {
			focusElement(fields[targetIndex]);
			focused = true;
		} 
	}
}

function focusElement(element) {
	if (element && element.focus && !element.disabled) {
		window.focus();
		element.focus();
	}
}

function getFieldsSortedByTabIndex(form) {
	var fields = form.elements;
	var indexedFields = [];
	for (var i=0,j=0; i<fields.length; i++) {
		if (fields[i].tabIndex > 0) {
			indexedFields[j++] = fields[i];
		}
	}
	indexedFields.sort(
		function(a, b) {
			return a.tabIndex > b.tabIndex ? 1 : -1;
		}
	);
	return indexedFields;
}

function addItemToDropDown(dropDown, optionText, optionValue) {
	if (dropDown != null) {
		dropDown.options[dropDown.options.length] = new Option(optionText, optionValue);
	}
}
