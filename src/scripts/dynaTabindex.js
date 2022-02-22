/*
 * Overrides all "tabindex" attributes to set them automatically in the most user-friendly order,
 * especially respecting "left side first, then right side" 2-column-tables.
 *
 * This script has been designed to solve two interconnected problems:
 * - We want tabindex to generally flow from page top to bottom, but in case of some tables presenting input fields
 *   on the left column and other input fields on the right column, we want tabindex to flow through the left side
 *   input fields first, then jump up again and flow through the right side input fields before returning to its
 *   normal flow.
 * - Although this could be achieved using manually put tabindex attributes, this approach is highly brittle: Often,
 *   we are required to change masks and put new input fields somewhere in between existing ones; moreover,
 *   many pages are actually split into multiple sub-pages which can in turn be included my many other pages. A system
 *   based on absolute tabindex numbers fails in all these cases.
 *
 * How to use:
 * - Include this script into the page in question.
 *   Note: It has to be included *after* the DOM tree, thus typically at the end of the page.
 *   (This has been done in the overall layout template already.)
 * - To use this script's functionality, add the style class "debolDynaTabindex" to the <ft:form-template> in question.
 * - All existing tabindex attributes in this page will now be overwritten by the script.
 * - In order to mark a table as "flow through left side first, then right side", set its tabindex="perColumn".
 * - Note: The table must have the same amount of <input> / <select> elements on the left side as on the right side;
 *   if there are open "gaps", fill them with a simple <input type="hidden"/> (typically encompassed in
 *   <td class="field"><input type="hidden"/></td>).
 */

// Only execute if the form marker is found
var marker = jQuery('form.debolDynaTabindex');
if (marker.length) {
    marker.removeClass("debolDynaTabindex");

    createDynaTabIndexes();

    /*
     * This is a workaround. Problem: Cocoon allows us to update / change the DOM (page elements) on-the-fly,
     * e.g. in a value change listener. After that, of course, createDynaTabIndexes() should be invoked again.
     * Unfortunately, Cocoon provides no way to hook into this process (callback): we cannot say when it happened,
     * therefore we don't know when to invoke the function again.
     *
     * To make sure tabindexes are always set correctly, we always invoke createDynaTabIndexes() onblur on any
     * input element.
     *
     * This may be detrimental to the (client-side) application performance, but on a modern system, impact should
     * be negligible.
     */
    jQuery("input, select").each(function() {
        jQuery(this).on('blur', createDynaTabIndexes)
    });
}

function createDynaTabIndexes() {
    // find all containers which require special 2 column handling
    var containers = jQuery("[tabindex=perColumn]");

    containers.each(function() {
        var childCount = jQuery(this).find('* input, * select').length;
        jQuery(this).find('* input, * select').each(function(index) {
            // mark elements as belonging of the left / right column
            if (index % 2 == 0) {
                jQuery(this).attr('tabindex', 'uneven');
            }
            else {
                // for the right column, also save the total number of elements on the left column.
                jQuery(this).attr('tabindex', 'even_' + Math.ceil(childCount / 2));
            }
        });
    });

    var tabi = 0; // the current absolute tabindex
    var stackedTabiUneven = 0; // the current absolute tabindex for "table left side" elements
    var stackedTabiEven = 0; // the current absolute tabindex for "table right side" elements
    jQuery("*").each(function(index) {
        var tempi = jQuery(this).attr('tabindex'); // the tabindex before modification
        // Note: we don't remove this "special marker" attribute since we need to keep it to enable above "re-run" workaround.

        if (jQuery(this).is('input, select')) {
            // elements outside of "special 2 column handling" tables without existing tabindex: set to the current absolute tabindex
            if (typeof tempi === "undefined") {
                jQuery(this).attr('tabindex', tabi);
            }
            // "left side" elements: increase their tabindex
            else if (tempi == 'uneven') {
                // if variables have been reset: set them to current absolute tabindex
                if (stackedTabiUneven == 0) {
                    stackedTabiUneven = tabi;
                    stackedTabiEven = tabi;
                }
                jQuery(this).attr('tabindex', stackedTabiUneven);
                stackedTabiUneven ++;
            }
            // "right side" elements: increase their tabindex
            else if (tempi.startsWith('even_')) {
                var offset = parseInt(tempi.substring('even_'.length, tempi.length));
                jQuery(this).attr('tabindex', stackedTabiEven + offset);
                stackedTabiEven++;
                // if the end of table is reached: reset variables
                if (tabi + 1 - stackedTabiEven == offset) {
                    stackedTabiUneven = 0;
                    stackedTabiEven = 0;
                }
            }
            // elements outside of "special 2 column handling" tables with existing tabindex: set to the current absolute tabindex
            else {
                jQuery(this).attr('tabindex', tabi);
            }
            tabi++;
        }
    })
}

