function toUperCase(element) {
	var start = element.selectionStart,
	end = element.selectionEnd;
	element.value=element.value.toUpperCase();
	element.setSelectionRange(start, end);

}