var fdTabs = {
  
  addEvent: function(obj, type, fn, tmp) {
    tmp || (tmp = true);
    if( obj.attachEvent ) {
      obj["e"+type+fn] = fn;
      obj[type+fn] = function(){obj["e"+type+fn]( window.event );};
      obj.attachEvent( "on"+type, obj[type+fn] );
    } else {
      obj.addEventListener( type, fn, true );
    };
  },
  
  removeEvent: function(obj, type, fn, tmp) {
    tmp || (tmp = true);
    if( obj.detachEvent ) {
      obj.detachEvent( "on"+type, obj[type+fn] );
      obj[type+fn] = null;
    } else {
      obj.removeEventListener( type, fn, true );
    };
  },
  
  stopEvent: function(e) {
    e = e || window.event;

    if(e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    };
    return false;
  },
  
  initEvt: function(e) {
    var tabs = document.getElementById("tabs");
    var anchorArray = tabs.getElementsByTagName('a');
    for(var i = 0, a; a = anchorArray[i]; i++) {
      var s1 = a.href.slice(0, a.href.lastIndexOf('/'));
      var s2 = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
      if(s1 == s2) {
        fdTabs.addClass(a.parentNode, "current");
      }
      else {
        fdTabs.removeClass(a.parentNode, "current");
      }
    }
  },
  
  addClass: function(e,c) {
    if(new RegExp("(^|\\s)" + c + "(\\s|$)").test(e.className)) return;
    e.className += ( e.className ? " " : "" ) + c;
  },

  removeClass: function(e,c) {
    e.className = !c ? "" : e.className.replace(new RegExp("(^|\\s*\\b[^-])"+c+"($|\\b(?=[^-]))", "g"), "");
  },

  onUnload: function() {
    fdTabs.removeEvent(window, "load", fdTabs.initEvt);
    fdTabs.removeEvent(window, "unload", fdTabs.onUnload);
  }
};

fdTabs.addEvent(window, "load", fdTabs.initEvt);
fdTabs.addEvent(window, "unload", fdTabs.onUnload);


