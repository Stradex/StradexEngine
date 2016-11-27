var Gf_FPS = 120; //Fragmentos por segundo de nuestras funciones... fps, variable global.
Gf_FPS = Math.round(1000/Gf_FPS);
var navegador = navigator.appName;
var NUMERO_GIGANTE = 99999999.0;

 function myStrICmp(a, b) {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
 }


 function getObjectTypeName(obj)
 {
	 //Metodo A
	//return Object.prototype.toString.call(obj).slice(8, -1);
	//Metodo B
	//return obj.constructor.name;
	//Metodo C
	return obj.name;
 }
 
 function isValidJSONString(strJson)
 {
	 if (/^[\],:{}\s]*$/.strJson(text.replace(/\\["\\\/bfnrtu]/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

  return true;

}else{

  return false;

}
 }
 
function getDigits(number)
{
	var digits = 0;
	number = parseFloat(number);
	while(number >= 1.0)
	{
		digits++;
		number = number/10.0;
	}
	return digits;
}

function numberToString(currentNumber, maxnumber)
{
	var strNmb = String(currentNumber);
	if (currentNumber > maxnumber)
		maxnumber = currentNumber;
	
	var extraZeros = getDigits(maxnumber) - getDigits(currentNumber);
	
	while(extraZeros > 0)
	{
		strNmb = "0" + strNmb;
		extraZeros--;
	}
	
	return strNmb;
}

//Para ajax
function createXHR(){
	if (typeof XMLHttpRequest != "undefined"){
		createXHR = function() {
			return new XMLHttpRequest();
		}
	} else if (typeof ActiveXObject != "undefined"){
		createXHR = function() {
			if (typeof arguments.callee.activeXString != "string"){
				var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
				for (var i=0,len=versions.length; i < len; i++){
					try {
						var xhr = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return xhr;
					} catch (ex){
						//skip
					}
				}
				return new ActiveXObject(arguments.callee.activeXString);
			}
		}
	} else {
		createXHR = function() {
			throw new Error("No XHR object available.");
		}
	}
	return createXHR();
}

function addURLParam(url, name, value) {
	url += (url.indexOf("?") == -1 ? "?" : "&");
	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
}

function getVectorAngle(x1, y1, x2, y2)
{
	var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI-90;
	if (angle < 0)
		angle += 360;
	return angle;
}

function getVelocityAngle(vx, vy)
{
	return getVectorAngle(0, 0, vx, vy)+180;
}

function serialize(form){
	var parts = new Array();
	var field = null;
	for (var i=0, len=form.elements.length; i < len; i++){
		field = form.elements[i];
		switch(field.type){
			case "select-one":
			case "select-multiple":
				for (var j=0, optLen = field.options.length; j < optLen; j++){
					var option = field.options[j];
					if (option.selected){
						var optValue = "";
						if (option.hasAttribute){
							optValue = (option.hasAttribute("value") ? option.value : option.text);
						} else {
							optValue = (option.attributes["value"].specified ? option.value : option.text);
						}
					parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
					}
				}
			break;
			
			case undefined: //fieldset
			case "file": //file input
			case "submit": //submit button
			case "reset": //reset button
			case "button": //custom button
			break;
			
			case "radio": //radio button
			case "checkbox": //checkbox
			if (!field.checked){
				break;
			}
			/* falls through */
			default:
				parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
		}
	}
return parts.join("&");
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


//Creando funciones de herencia
function fCloneObj(o)
{
	function F(){}
	F.prototype = o;
	return new F();
}

function fHeredarProto(padre, hijo)
{
	var prototype = fCloneObj(padre.prototype);
	prototype.constructor = hijo;
	hijo.prototype = prototype;
}

function getBrowserVersion()
{
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
		if (ieversion>=9)
			return ">=9";
		else if (ieversion>=8)
			return ">=8";
		else if (ieversion>=6)
			return ">=6";
			else if (ieversion<=5)
		return "<=5"
	} else
 		return "no";
}

function set_opac(elem, opac)
{

	if (navegador == 'Microsoft Internet Explorer')
	{
		switch (getBrowserVersion())
		{
			case ">=9":
				elem.style.opacity = opac;
			break;
			case ">=8":
				//elem.filters.item("DXImageTransform.Microsoft.Alpha").opacity = Math.round(100*opac);
				elem.style.filter ="progid:DXImageTransform.Microsoft.Alpha(enable=true, opacity=" + Math.round(100*opac) + ")";
			break;
			case ">=6":
				elem.style.filter='alpha(opacity='+(opac*100)+')';
			break;
			default:
				elem.style.opacity = opac;			
			break;
		}
	} else {
		elem.style.opacity = opac;
	}
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function AbsoluteVal(val)
{
	if (val < 0)
		return -val;
	return val;
}

//Funcion para saber si objeto es Nodo DOM
function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

//Funcion para saber si objeto es Elemento DOM
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}
function setBackImg(obj, src)
{
	if (!obj)
		return;
	obj.style.backgroundImage = "url('" + src + ")";
}
function getStyle(elem,styleProp)
{
     if (window.getComputedStyle)
    {
        var y = document.defaultView.getComputedStyle(elem,null).getPropertyValue(styleProp);
    }  
    else if (elem.currentStyle)
    {
        var y = elem.currentStyle[styleProp];
    }                     

    return y;
}

function getRStyle(elem)
{
	var style = 0;
     if (window.getComputedStyle)
    {
       style = document.defaultView.getComputedStyle(elem,null);
    }  
    else if (elem.currentStyle)
    {
       style = elem.currentStyle;
    }              

	return style;
}


/*Funciones de compatibilidad para html_decode_entities de php a javascript
	- Diseño y programación: php.js
*/
function get_html_translation_table(table, quote_style) {
  //  discuss at: http://phpjs.org/functions/get_html_translation_table/
  // original by: Philip Peterson
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: noname
  // bugfixed by: Alex
  // bugfixed by: Marco
  // bugfixed by: madipta
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: T.Wild
  // improved by: KELAN
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: Frank Forte
  //    input by: Ratheous
  //        note: It has been decided that we're not going to add global
  //        note: dependencies to php.js, meaning the constants are not
  //        note: real constants, but strings instead. Integers are also supported if someone
  //        note: chooses to create the constants themselves.
  //   example 1: get_html_translation_table('HTML_SPECIALCHARS');
  //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

  var entities = {},
    hash_map = {},
    decimal;
  var constMappingTable = {},
    constMappingQuoteStyle = {};
  var useTable = {},
    useQuoteStyle = {};

  // Translate arguments
  constMappingTable[0] = 'HTML_SPECIALCHARS';
  constMappingTable[1] = 'HTML_ENTITIES';
  constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
  constMappingQuoteStyle[2] = 'ENT_COMPAT';
  constMappingQuoteStyle[3] = 'ENT_QUOTES';

  useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
  useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() :
    'ENT_COMPAT';

  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
    throw new Error('Table: ' + useTable + ' not supported');
    // return false;
  }

  entities['38'] = '&amp;';
  if (useTable === 'HTML_ENTITIES') {
    entities['160'] = '&nbsp;';
    entities['161'] = '&iexcl;';
    entities['162'] = '&cent;';
    entities['163'] = '&pound;';
    entities['164'] = '&curren;';
    entities['165'] = '&yen;';
    entities['166'] = '&brvbar;';
    entities['167'] = '&sect;';
    entities['168'] = '&uml;';
    entities['169'] = '&copy;';
    entities['170'] = '&ordf;';
    entities['171'] = '&laquo;';
    entities['172'] = '&not;';
    entities['173'] = '&shy;';
    entities['174'] = '&reg;';
    entities['175'] = '&macr;';
    entities['176'] = '&deg;';
    entities['177'] = '&plusmn;';
    entities['178'] = '&sup2;';
    entities['179'] = '&sup3;';
    entities['180'] = '&acute;';
    entities['181'] = '&micro;';
    entities['182'] = '&para;';
    entities['183'] = '&middot;';
    entities['184'] = '&cedil;';
    entities['185'] = '&sup1;';
    entities['186'] = '&ordm;';
    entities['187'] = '&raquo;';
    entities['188'] = '&frac14;';
    entities['189'] = '&frac12;';
    entities['190'] = '&frac34;';
    entities['191'] = '&iquest;';
    entities['192'] = '&Agrave;';
    entities['193'] = '&Aacute;';
    entities['194'] = '&Acirc;';
    entities['195'] = '&Atilde;';
    entities['196'] = '&Auml;';
    entities['197'] = '&Aring;';
    entities['198'] = '&AElig;';
    entities['199'] = '&Ccedil;';
    entities['200'] = '&Egrave;';
    entities['201'] = '&Eacute;';
    entities['202'] = '&Ecirc;';
    entities['203'] = '&Euml;';
    entities['204'] = '&Igrave;';
    entities['205'] = '&Iacute;';
    entities['206'] = '&Icirc;';
    entities['207'] = '&Iuml;';
    entities['208'] = '&ETH;';
    entities['209'] = '&Ntilde;';
    entities['210'] = '&Ograve;';
    entities['211'] = '&Oacute;';
    entities['212'] = '&Ocirc;';
    entities['213'] = '&Otilde;';
    entities['214'] = '&Ouml;';
    entities['215'] = '&times;';
    entities['216'] = '&Oslash;';
    entities['217'] = '&Ugrave;';
    entities['218'] = '&Uacute;';
    entities['219'] = '&Ucirc;';
    entities['220'] = '&Uuml;';
    entities['221'] = '&Yacute;';
    entities['222'] = '&THORN;';
    entities['223'] = '&szlig;';
    entities['224'] = '&agrave;';
    entities['225'] = '&aacute;';
    entities['226'] = '&acirc;';
    entities['227'] = '&atilde;';
    entities['228'] = '&auml;';
    entities['229'] = '&aring;';
    entities['230'] = '&aelig;';
    entities['231'] = '&ccedil;';
    entities['232'] = '&egrave;';
    entities['233'] = '&eacute;';
    entities['234'] = '&ecirc;';
    entities['235'] = '&euml;';
    entities['236'] = '&igrave;';
    entities['237'] = '&iacute;';
    entities['238'] = '&icirc;';
    entities['239'] = '&iuml;';
    entities['240'] = '&eth;';
    entities['241'] = '&ntilde;';
    entities['242'] = '&ograve;';
    entities['243'] = '&oacute;';
    entities['244'] = '&ocirc;';
    entities['245'] = '&otilde;';
    entities['246'] = '&ouml;';
    entities['247'] = '&divide;';
    entities['248'] = '&oslash;';
    entities['249'] = '&ugrave;';
    entities['250'] = '&uacute;';
    entities['251'] = '&ucirc;';
    entities['252'] = '&uuml;';
    entities['253'] = '&yacute;';
    entities['254'] = '&thorn;';
    entities['255'] = '&yuml;';
  }

  if (useQuoteStyle !== 'ENT_NOQUOTES') {
    entities['34'] = '&quot;';
  }
  if (useQuoteStyle === 'ENT_QUOTES') {
    entities['39'] = '&#39;';
  }
  entities['60'] = '&lt;';
  entities['62'] = '&gt;';

  // ascii decimals to real symbols
  for (decimal in entities) {
    if (entities.hasOwnProperty(decimal)) {
      hash_map[String.fromCharCode(decimal)] = entities[decimal];
    }
  }

  return hash_map;
}

function html_entity_decode(string, quote_style) {
  //  discuss at: http://phpjs.org/functions/html_entity_decode/
  // original by: john (http://www.jd-tech.net)
  //    input by: ger
  //    input by: Ratheous
  //    input by: Nick Kolosov (http://sammy.ru)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: marc andreu
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Fox
  //  depends on: get_html_translation_table
  //   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
  //   returns 1: 'Kevin & van Zonneveld'
  //   example 2: html_entity_decode('&amp;lt;');
  //   returns 2: '&lt;'

  var hash_map = {},
    symbol = '',
    tmp_str = '',
    entity = '';
  tmp_str = string.toString();

  if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
    return false;
  }

  // fix &amp; problem
  // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
  delete(hash_map['&']);
  hash_map['&'] = '&amp;';

  for (symbol in hash_map) {
    entity = hash_map[symbol];
    tmp_str = tmp_str.split(entity)
      .join(symbol);
  }
  tmp_str = tmp_str.split('&#039;')
    .join("'");

  return tmp_str;
}


/*..::| 2) Funciones elementales para compatibilidad de navegadores |::..*/

//Crear funcion indexOf para navegadores que no lo posean
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
}


function traverseChildren(elem){
    var children = [];
    var q = [];
    q.push(elem);
    while (q.length > 0) {
      var elem = q.pop();
      children.push(elem);
      pushAll(elem.children);
    }
    function pushAll(elemArray){
      for(var i=0; i < elemArray.length; i++) {
        q.push(elemArray[i]);
      }
    }
    return children;
}

//Saber si un elemento es hijo de otro
function is_child_of(parent, child) {

	if( child != null ) {			
		while( child.parentNode ) {
			if( (child = child.parentNode) == parent ) {
				return true;
			}
		}
	}
	return false;
}


//Get pixel dimensions of screen
function getDimensions(){
    var winW = 630, winH = 460;
    if (document.body && document.body.offsetWidth) {
     winW = document.body.offsetWidth;
     winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
     winW = document.documentElement.offsetWidth;
     winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
     winW = window.innerWidth;
     winH = window.innerHeight;
    }
    return{"width":winW, "height":winH}
}
//Get the location of element
function getOffsetRight(elem){
    var width = elem.offsetWidth;
    var right = 0;
    while (elem.offsetParent) { 
        right += elem.offsetLeft; 
        elem = elem.offsetParent;
    }
    right += elem.offsetLeft;
    right = getDimensions()["width"]-right
    right -= width
    return right;
}

function getOffsetSum(elem) {
	var top=0, left=0;
	while(elem) {
		top = top + parseInt(elem.offsetTop);
		left = left + parseInt(elem.offsetLeft);
		elem = elem.offsetParent;
	}
	return {top: top, left: left};
}
function getRelativeRect(elem)
{
	var box = elem.getBoundingClientRect();
	var body = document.body;
	var docElem = document.documentElement;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var top  = box.top - clientTop;
	var left = box.left - clientLeft;
	return { top: Math.round(top), left: Math.round(left) }
}

function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect();
	var body = document.body;
	var docElem = document.documentElement;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var top  = box.top +  scrollTop - clientTop;
	var left = box.left + scrollLeft - clientLeft;
	return { top: Math.round(top), left: Math.round(left) }
}
function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem);
	} else { // Navegador mas viejo que el pan
		return getOffsetSum(elem);
	}
}
function getRelativeOffset(elem) {
	if (!elem.parentNode)
	{
		return getOffset(elem);
	} else {
		alert(elem.parentNode);
		return { top: getOffset(elem).top - getOffset(elem.parentNode).top, left: getOffset(elem).left - getOffset(elem.parentNode).left};
	}
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

function isArray(elem)
{
	return !!(Object.prototype.toString.call(elem) === '[object Array]');
}

function nullElement(arrayElement)
{
	if (!isArray(arrayElement))
		return -1;
	for (var i=0; i < arrayElement.length; i++)
	{
		if ((typeof arrayElement[i] == 'undefined') || (arrayElement[i] == null))
			return i;
	}
	return -1;
}

//Event Util

var EventUtil = {

	addHandler : function(elem, type, handler)
	{
		if (elem.addEventListener)
		{
			elem.addEventListener(type, handler, false);
		} else if (Elem.attachEvent) {
			elem.attachEvent("on" + type, handler);
		} else {
			elem["on"+type] = handler;
		}
	},
	removeHandler : function(elem, type, handler)
	{
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handler, false);
		} else if (Elem.detachEvent) {
			elem.detachEvent("on" + type, handler);
		} else {
			elem["on" + type] = null;
		}
	},
	getEvent : function(event)
	{
		return event ? event : window.event;
	},
	getTarget : function(event)
	{
		if (event.target) {
			return event.target;
		} else if (event.srcElement) {
			return event.srcElement;
		} else {
			return null;
		}
	},
	preventDefault : function(event)
	{
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	stopPropagation : function(event)
	{
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},
	getRelatedTarget : function(event)
	{
		if (event.relatedTarget)
		{
			return event.relatedTarget;
		} else if (event.toElement) {
			return event.toElement;
		} else if (event.fromElement) {
			return event.fromElement;
		} else {
			return null;
		}
	}, 
	getButton : function(event)
	{
		if (document.implementation.hasFeature("MouseEvents", "2.0")) {
			return event.button;
		} else {
			switch (event.button)
			{
				default:
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				break;
				case 2:
				case 6:
					return 2;
				break;
				case 4:
					return 1;
				break;
			}
		
		}
	},
	getCharCode : function(event)
	{
		if (typeof event.which == "number") {
			return event.which; //Es más compatible :D
		} else {
			return event.charCode || event.keyCode;
		}
	},
	getWheelDelta : function(event)
	{
		if (event.wheelDelta)
		{
			var delta;
			try
			{
				delta = (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
			} catch (err) {
				delta = event.wheelDelta;
			}
			return delta;
		} else {
			return -event.detail *40;
		}
	},
	getClipboardText : function (event)
	{
		var clipboard = (event.clipboardData || window.clipboardData);
		return clipboard.getData("text");
	},
	setClipboardText : function (event, value)
	{
		if (event.clipboardData)
		{
			return event.clipboardData.setData("text/plain", value);
		} else if (window.clipboardData) {
			return window.clipboardData.setData("text", value);
		} else {
			return false;
		}
	}
};

function getSelectedText(textbox)
{
	if (document.selection)
	{
		return document.selection.createRange().text;
	} else {
		return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
	}
}
function selectText(textbox, start, end)
{
	if (textbox.setSelectionRange)
	{
		textbox.setSelectionRange(start, end);
	} else {
		var range = textbox.createTextRange();
		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end-start);
		range.select();
	}
	textbox.focus();
}

/*Tener observacion*/

function UrlExists(url)
{

    var http;
	try 
	{
		http = createXHR();
		http.open('HEAD', url, false);
		http.send();
	} catch (err) {
		return false;
	}
    return http.status!=404;
}
