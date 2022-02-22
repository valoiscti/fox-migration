function calculateTotal(frm) {
	var nachErfassungtotal = 0

	// Run through all the form fields
	for ( var i = 0; i < frm.elements.length; ++i) {

		// Get the current field
		form_field = frm.elements[i]

		// Get the field's name
		form_name = form_field.name

		// Is it a "pool" field?
		if (form_name.substring(0, 23) == "quickNacherfassung.pool") {

			// If so, extract the amount from the name
			amount = Number(form_field.value)

			// Update the  total
			if (amount >= 0) {
				nachErfassungtotal += amount
			}
		}
	}

	// Display the total 
	frm.TOTAL.value = nachErfassungtotal.toFixed(2)
}
