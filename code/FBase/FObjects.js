//Clase unicamente para funciones de carga de css y javascript
(function() {
	//Private c++
var version = "0.1";
var creation = "12/08/2015";
var autor = "Maximiliano Ruben Viamonte";
var company = "Firetech";
var loaded = false;
var executed = false;
var t_obj = null;
var waitloadCalled = false;
var callbacks = new Array();

FBase = function() {
	this.callback = null;
	t_obj = this;
 };

//Internal functions
//Private C++
function waitLoadAll()
{
	waitloadCalled = true;
	var i = 0;
	if (typeof t_obj.callback === 'function' && loaded)
	{
		//t_obj.callback();
		for (i=0; i < callbacks.length; i++)
			callbacks[i]();
	} else {
		setTimeout(arguments.callee, 10);
	}
}

/**
* Sirve para cagar un archivo CSS externo desde la propia funcion
*
* @param string cssFile - Direccion y nombre del archivo a cargar, ej: 'design/base.css'
* (opcional) @param function - La funcion que se va a llamar cuando se cargue el CSS
*
* @return bool - Si se pudo o no cargar el archivo [FALSE: no se pudo, TRUE: si se pudo]
**/
//Public C++
FBase.prototype.importCSS = function(cssFile)
{
	var link = document.createElement("link");
	var callback = (arguments.length > 1 && typeof arguments[1] == 'function') ? arguments[1] : 'undefined';
	link.href = cssFile;
	link.rel = "stylesheet";
	link.type = "text/css";
	var head;
	if (document.getElementsByTagName("head").length > 0)
	{
		head = document.getElementsByTagName("head")[0];
	} else {
		head = document.createElement("head");
		document.documentElement.appendChild(head);
	}
	if (typeof callback == 'function')
	{
		if (link.addEventListener)
		{
			link.addEventListener("load", callback, false);
		} else if (link.attachEvent) {
			link.attachEvent("onload", callback);
		} else {
			link["onload"] = callback;
		}
	}	
	head.appendChild(link);
	return true;

}
/**
* Sirve para cagar un archivo Javascript externo desde la propia funcion
*
* @param string javaFile - Direccion y nombre del archivo a cargar, ej: 'design/base.css'
* @param function callback - La funcion que se va a llamar cuando se cargue el javascript
*
* @return bool - Si se pudo o no cargar el archivo [FALSE: no se pudo, TRUE: si se pudo]
**/
FBase.prototype.importJS = function(javaFile, callback)
{
	var script = document.createElement("script");
	script.src = javaFile;
	script.type = "text/javascript";
	script.defer = "defer";
	
	var head;
	if (document.getElementsByTagName("head").length > 0)
	{
		head = document.getElementsByTagName("head")[0];
	} else {
		head = document.createElement("head");
		document.documentElement.appendChild(head);
	}

	if (typeof callback == 'function')
	{
		if (script.addEventListener)
		{
			script.addEventListener("load", callback, false);
		} else if (script.attachEvent) {
			script.attachEvent("onload", callback);
		} else {
			script["onload"] = callback;
		}
	}	
	head.appendChild(script);
}

FBase.prototype.onDOMLoad = function(callback)
{
	if (window.addEventListener)
	{
		window.addEventListener("DOMContentLoaded", callback, false);
	} else if (window.attachEvent) {
		window.attachEvent("onDOMContentLoaded", callback);
	} else {
		window["onDOMContentLoaded"] = callback;
	}
}
FBase.prototype.setCallback = function(callback)
{
	if (typeof callback !== 'function')
		return;
	callbacks[callbacks.length] = callback; //Para multiple execucion JIJIJIJI
	this.callback = callback;
	if (!waitloadCalled)
		waitLoadAll();
}
FBase.prototype.setExecuted = function()
{
	executed = true;
}
FBase.prototype.setLoaded = function()
{
	loaded = true;
}

/**
* Sirve para mostrar la informacion de FBase 
*
* @return string - La información para mostrar
**/
FBase.prototype.getInfo = function()
{
	var retorno = "<b>.:FBase:.</b> <br /> - Version: " + version + "<br /> - Fecha de Lanzamiento: " + creation + "<br /> - Autor: " + autor + "<br /> - Compañia desarrolladora: " + company;
	return retorno;
}

})();




var Base = new FBase();
var loads = 0;
function ScriptLoaded(event)
{
event = EventUtil.getEvent(event);
var target = EventUtil.getTarget(event);
//Evitar que se ejecute más de una vez este codigo
EventUtil.removeHandler(target, 'load', arguments.callee);
loads++;
if (loads != 2)
	return;
//Crear todas las clases y Objectos aquí adentro, tambien esta habiltiado JQuery
//Funciones propias de JQuery
(function($) {
    $.fn.forceOffset = function() {
	var RVal = 0;
        if (this.css('display') == 'none')
	{
		var InitialV = this.css('visibility');
		this.css('visibility', 'hidden');
		this.css('display', 'block');
		RVal = this.offset();
		this.css('visibility', InitialV);
		this.css('display', 'none');
	} else {
		RVal = this.offset();
	}
	return RVal;
    };
}(jQuery));

(function($) {
    $.fn.forcePosition = function() {
	var RVal = 0;
        if (this.css('display') == 'none')
	{
		var InitialV = this.css('visibility');
		this.css('visibility', 'hidden');
		this.css('display', 'block');
		RVal = this.position();
		this.css('visibility', InitialV);
		this.css('display', 'none');
	} else {
		RVal = this.position();
	}
	return RVal;
    };
}(jQuery));

(function($) {
    $.fn.forceWidth = function() {
	var RVal = 0;
        if (this.css('display') == 'none')
	{
		var InitialV = this.css('visibility');
		this.css('visibility', 'hidden');
		this.css('display', 'block');
		RVal = this.width();
		this.css('visibility', InitialV);
		this.css('display', 'none');
	} else {
		RVal = this.width();
	}
	return RVal;
    };
}(jQuery));

(function($) {
    $.fn.forceHeight = function() {
	var RVal = 0;
        if (this.css('display') == 'none')
	{
		var InitialV = this.css('visibility');
		this.css('visibility', 'hidden');
		this.css('display', 'block');
		RVal = this.height();
		this.css('visibility', InitialV);
		this.css('display', 'none');
	} else {
		RVal = this.height();
	}
	return RVal;
    };
}(jQuery));

(function($) {
    $.fn.forceOuterWidth = function() {
	var RVal = 0;
        if (this.css('display') == 'none')
	{
		var InitialV = this.css('visibility');
		this.css('visibility', 'hidden');
		this.css('display', 'block');
		RVal = this.outerWidth();
		this.css('visibility', InitialV);
		this.css('display', 'none');
	} else {
		RVal = this.outerWidth();
	}
	return RVal;
    };
}(jQuery));

(function($) {
    $.fn.forceOuterHeight = function() {
	var RVal = 0;
        if (this.css('display') == 'none')
	{
		var InitialV = this.css('visibility');
		this.css('visibility', 'hidden');
		this.css('display', 'block');
		RVal = this.outerHeight();
		this.css('visibility', InitialV);
		this.css('display', 'none');
	} else {
		RVal = this.outerHeight();
	}
	return RVal;
    };
}(jQuery));

//Funciones que necesitan JQuery
function getRealPosition(elem)
{
	var pos = $(elem).forcePosition();
	if (elem.parentNode && ($(elem).css('position') != 'absolute'))
	{
		pos.top -= parseInt($(elem.parentNode).css('padding-top'));
		pos.left -= parseInt($(elem.parentNode).css('padding-left'));
	}
	return { left: pos.left, top: pos.top };
}

//Clase FDinamicValue

(function()
{
	/**
	* Como no existen los valores por referencia en javascript, esto seria una 'variable dinamica'
	*
	**/
	var valores = new Array();
	FDinamicValue = function()
	{
		this.id = valores.length;
		valores[this.id] = (typeof arguments[0] !== 'undefined') ? arguments[0] : 0;
	}
	FDinamicValue.prototype.setValue = function(v)
	{
		valores[this.id] = v;
	}
	FDinamicValue.prototype.getValue = function()
	{
		return valores[this.id];
	}
	
})();



//Clase FCoord
(function() {

/*
var xdata = new Array();
var ydata = new Array();
var zdata = new Array();*/

FCoord = function(vx, vy, vz)
{
	/**
	* Glosario de datos
	*
	* this.mode es el modo de las coordenadas, si en porcentaje o pixeles, para mostrar en css
	* this.id es el ID de nuestro objeto, unico, para poder utilizar las variables privadas
	* x, y, z son las coordenadas y variables privadas
	**/
	this.mode=false;
	/*this.id = xdata.length;
	xdata[xdata.length] = 0;
	ydata[ydata.length] = 0;
	zdata[zdata.length] = 0;*/

	this.init(vx, vy, vz);
}

FCoord.prototype.x = 0;
FCoord.prototype.y = 0;
FCoord.prototype.z = 0;

FCoord.prototype.copy = function(newCoord)
{
	if (!(newCoord instanceof FCoord))
	{
		throw new Error('Solo se pueden ingresar Objetos FCOord como parametro a FCoord.copy');
		return;
	}
	this.setX(newCoord.getX());
	this.setY(newCoord.getY());
	this.mode = newCoord.mode;
}
FCoord.prototype.getX = function()
{
	return parseFloat(this.x);
}
FCoord.prototype.getY = function()
{
	return parseFloat(this.y);
}
FCoord.prototype.getZ = function()
{
	return parseFloat(this.z);
}
FCoord.prototype.setX = function(tx)
{
	//if (typeof tx == 'number')
	//{
		this.x = tx;
	//} else {
	//	throw new Error('Solo se pueden ingresar numeros');
	//}
}
FCoord.prototype.setY = function(ty)
{
	//if (typeof ty == 'number')
	//{
		this.y = ty;
	//} else {
	//	throw new Error('Solo se pueden ingresar numeros');
	//}
}
FCoord.prototype.setZ = function(tz)
{
	if (typeof tz == 'number')
	{
		this.z = tz;
	} else {
		throw new Error('Solo se pueden ingresar numeros');
	}
}
FCoord.prototype.getXCSS = function()
{
	if (this.mode)
	{
		return this.x + "%";
	} else {
		return this.x + "px";
	}
}

FCoord.prototype.getYCSS = function()
{
	if (this.mode)
	{
		return this.y + "%";
	} else {
		return this.y + "px";
	}
}
FCoord.prototype.getZCSS = function()
{
	if (this.mode)
	{
		return this.z + "%";
	} else {
		return this.z + "px";
	}
}

FCoord.prototype.init = function(tx, ty, tz)
{
	this.setX(tx);
	this.setY(ty);
	if (typeof tz == 'number')
		this.setZ(tz);
}
FCoord.prototype.distance = function(bcoord)
{
	if (!(bcoord instanceof FCoord))
	{
		throw new Error('Solo se pueden ingresar Objetos FCoord como parametro.');
		return 0.0;
	}
	var mode = (arguments.length > 1) ? arguments[1] : false;
	var dx = AbsoluteVal(this.x - bcoord.getX());
	var dy = AbsoluteVal(this.y - bcoord.getY());
	var dis;
	var disXY = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	if (!mode)
	{
		dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	} else {
		var dz = AbsoluteVal(this.z - bcoord.getZ());
		dis = Math.sqrt(Math.pow(disXY, 2) + Math.pow(dz, 2));
	}
	return dis;
}

//Pendiente de la recta creada por dos puntos (FCoord)
FCoord.prototype.slope = function(bcoord)
{
	if (!(bcoord instanceof FCoord))
	{
		throw new Error('Solo se pueden ingresar Objetos FCoord como parametro.');
		return 0.0;
	}
	var pend; //en espaniol XD Aguante el espaniol gato
	if (Math.abs(parseFloat(this.getX()-bcoord.getX())) < 0.01)
	{
			pend = NUMERO_GIGANTE;	//pendiente muy  grande que tiende a infinito
	} else {
			pend = (this.getY()-bcoord.getY())/(this.getX()-bcoord.getX()); 
	}
	return pend;
}
//Retorna un nuevo fcoord perpendicular a este, como si este fuera un vector
FCoord.prototype.getPerpendicular = function()
{
	var caso=0;
	var perpVec = new FCoord(0, 0);
	if (this.getX() != 0.0 && this.getY() != 0.0)
		caso =0;
	if (this.getX() != 0.0 && this.getY() == 0.0)
		caso = 1;
	if (this.getX() == 0.0 && this.getY() != 0.0)
		caso = 2;

	switch(caso)
	{
		case 0:
			perpVec.setX(1);
			perpVec.setY(-this.getX()/this.getY());
		break;
		case 1:
			perpVec.setX(0);
			perpVec.setY(1);
		break;
		case 2:
			perpVec.setX(1);
			perpVec.setY(0);
		break;
	}
	return perpVec;
}
FCoord.prototype.convertToUnitaryVector = function()
{
	var sizeMult;
	if ((this.getX()+this.getY()) == 0)
		return;
	sizeMult = Math.sqrt(1/(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2)));
	
	this.setX(this.getX()*sizeMult);
	this.setY(this.getY()*sizeMult);
}
//Transformacion lineal para rotar el vector
FCoord.prototype.rotar = function(angulo)
{
	var rotation;
	if (angulo >= 0) {
        rotation = Math.PI * angulo / 180;
    } else {
        rotation = Math.PI * (360+angulo) / 180;
    }
    var c = Math.cos(rotation),  s = Math.sin(rotation);
	this.setX(this.getX()*c - this.getY()*s);
	this.setY(this.getX()*s + this.getY()*c);
}
FCoord.prototype.getBackPosCSS = function()
{
	if (this.mode)
	{
		return this.x + "% " + this.y + "%";
	} else {
		return this.x + "px " + this.y + "px";
	}
}
/**
* Retorna el modulo de nuestro vector
*/
FCoord.prototype.Mod2D = function()
{
	return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
	
}
/**
* Funcion para obtener la posicion de un objeto
*
* @param DOMObj tObj - es el Objeto del cual queremos obtener la posicion x e y
* @param bool posMode - es si queremos obtener la posicion absoluta del objeto respecto al documento o respecto a su padre la posicion relativa [(D)FALSE: Posicion relativa - TRUE: Posicion absoluta]
**/
FCoord.prototype.getDOMObjPos = function(tObj)
{

	var posMode = (arguments.length > 1) ? arguments[1] : false;
	var Offset;
	if (posMode)
	{
		var pOffset = 0;
		if (tObj.parentNode)
		{
			pOffset = $(tObj.parentNode).forceOffset();
			if (tObj.parentNode === document.body)
			{
				pOffset.left = parseInt($(tObj).css("margin-left"));
				pOffset.top = parseInt($(tObj).css("margin-top"));
			}
		}
		if (pOffset)
		{
			var tpOffset = $(tObj).forcePosition();
			Offset = {left: pOffset.left + tpOffset.left, top: pOffset.top + tpOffset.top};
		} else {
			Offset = getRealPosition(tObj);
		}
		if (this.mode)
		{
			var dcHeight = $(document).height();
			var dcWidth = $(document).width();
			var pLeft, pTop;
			if (dcWidth == 0)
				pLeft = 0;
			else
				pLeft = (Offset.left*100)/$(document).width();
			if (dcHeight == 0)
				pTop = 0;
			else
				pTop = (Offset.top*100)/$(document).height();

			Offset.left = pLeft;
			Offset.top = pTop;
		}
	} else {
		Offset = getRealPosition(tObj);
		if (this.mode)
		{
			var pLeft;
			var pTop;
			if (tObj.parentNode)
			{
				var prHeight = $(tObj.parentNode).forceHeight();
				var prWidth = $(tObj.parentNode).forceWidth();
				if (prWidth == 0)
					pLeft = 0;
				else
					pLeft = (Offset.left*100)/$(tObj.parentNode).forceWidth();
				if (prHeight == 0)
					pTop = 0;
				else
					pTop = (Offset.top*100)/$(tObj.parentNode).forceHeight();
			} else {
				var dcHeight = $(document).height();
				var dcWidth = $(document).width();
				if (dcWidth == 0)
					pLeft = 0;
				else
					pLeft = (Offset.left*100)/$(document).width();
				if (dcHeight == 0)
					pTop = 0;
				else
					pTop = (Offset.top*100)/$(document).height();
			}
			Offset.left = pLeft;
			Offset.top = pTop;
		}
	}
	this.x = Math.round(Offset.left);
	this.y = Math.round(Offset.top);
}
})();



//FTimer (para temporizadores inteligentes)
(function() {

//var idCounter = 0;

FTimer = function(callback, delay)
{
	//this.myId = idCounter++;
	this.timerId = -1;
	this.start = 0;
	this.oDelay = delay;
	this.remaining = delay;
	this.func = callback;
	this.termino = false;
	
	//Init
	this.play();
};

FTimer.prototype.onTermino = function() { }

FTimer.prototype.play = function()
{
        this.start = new Date();
	this.termino = false;
	if (this.timerId != -1)
       		window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(function(t_obj) { return function() { t_obj.termino = true; t_obj.onTermino(); t_obj.func(); }; }(this), this.remaining);	
};
FTimer.prototype.resume = function()
{
	if (this.termino)
		return;
	this.play();
};
FTimer.prototype.pause =  function()
{
	if (this.timerId == -1)
		return;
	window.clearTimeout(this.timerId);
	this.remaining -= new Date() - this.start;
	this.timerId = -1;
};
FTimer.prototype.getRemaining = function()
{
	var remainTime = this.remaining - new Date() - this.start;
	return remainTime;
};
FTimer.prototype.stop = function()
{
	if (this.timerId == -1)
		return;
	this.termino = true;
	this.remaining = this.oDelay;
	window.clearTimeout(this.timerId);
	this.timerId = -1;
		
};

FTimer.prototype.destroy = function()
{
	this.stop();
	this.func = null; //adios referencia
};

})();
//FColor
(function() {

FColor = function(hexaColor)
{
	/*.:Propiedades.:*/	
	this.color = new Array(4);
	this.isDefined = false;

	/*.:Metodos.:*/
	//this.getHexaColor
	if (typeof this.getHexaColor != "function")
	{
		FColor.prototype.getHexaColor = function()
		{
			if (!this.isDefined)
				return "transparent";

			this.fixValues();
			var colorString = "#";
			for (var i=0; i < 3; i++)
			{
				var tmpColor = Math.round(this.color[i]);
				if (tmpColor < 16)
					colorString += "0";
				colorString += tmpColor.toString(16);
			}
			return colorString;
		};
	}
	//this.getHexaColorRGBA
	if (typeof this.getHexaColorRGBA != "function")
	{
		FColor.prototype.getHexaColorRGBA = function()
		{
			if (!this.isDefined)
				return "transparent";
			this.fixValues();
			var colorString = "#";
			for (var i=0; i < 3; i++)
			{
				var tmpColor = Math.round(this.color[i]);
				if (tmpColor < 16)
					colorString += "0";
				colorString += tmpColor.toString(16);
			}
			var tmpAlpha = Math.round(this.color[3]*255);
			if (tmpAlpha < 16)
				colorString += "0";
			colorString += tmpAlpha.toString(16);
			return colorString;
		};
	}
	if (typeof this.getHexaColorARGB != "function")
	{
		FColor.prototype.getHexaColorARGB = function()
		{
			if (!this.isDefined)
				return "transparent";
			this.fixValues();
			var colorString = "#";
			var tmpAlpha = Math.round(this.color[3]*255);
			if (tmpAlpha < 16)
				colorString += "0";
			colorString += tmpAlpha.toString(16);
			for (var i=0; i < 3; i++)
			{
				var tmpColor = Math.round(this.color[i]);
				if (tmpColor < 16)
					colorString += "0";
				colorString += tmpColor.toString(16);
			}

			return colorString;
		};
	}
	//this.setHexaColor
	if (typeof this.setHexaColor != "function")
	{
		FColor.prototype.setHexaColor = function(colorString)
		{
			colorString.length = 7;
			var z=1;
			if (!this.isDefined);
				this.isDefined = true;
			for (var i=0; i < 3; i++)
			{
				var tmpColor = "";
				tmpColor += colorString.charAt(z++) + colorString.charAt(z++);
				this.color[i] = parseInt(tmpColor, 16);
			}
			this.color[3] = 1.0;

		};
	}
	//this.setHexaColorRGBA
	if (typeof this.setHexaColorRGBA != "function")
	{
		FColor.prototype.setHexaColorRGBA = function(colorString)
		{
			colorString.length = 9;
			var z=1;
			if (!this.isDefined);
				this.isDefined = true;
			for (var i=0; i < 4; i++)
			{
				var tmpColor = "";
				tmpColor += colorString.charAt(z++) + colorString.charAt(z++);
				this.color[i] = parseInt(tmpColor, 16);
			}
			this.color[3] = this.color[3]/255;

		};
	}
	//this.getBackgroundColorRGBA
	if (typeof this.getBackgroundColorRGBA != "function")
	{
		FColor.prototype.getBackgroundColorRGBA = function()
		{
			if (!this.isDefined)
				return "transparent";

			this.fixValues();
			var txtCode = "";
			if (FWin.getNavigator() == 'Microsoft Internet Explorer')
			{
				txtCode = this.getHexaColorARGB();
			} else {
				txtCode = "rgba(" + Math.round(this.color[0]) + ", " + Math.round(this.color[1]) + ", " + Math.round(this.color[2]) + ", " + this.color[3] + ")";
			}
			return txtCode;
		};
	}

	//this.fixValues
	if (typeof this.fixValues != "function")
	{
		FColor.prototype.fixValues = function()
		{
			for (var i=0; i < 3; i++)
			{
				if (isNaN(this.color[i]) || (this.color[i] < 0))
				{
					this.color[i] = 0;
				} 
				if (this.color[i] > 255)
				{
					this.color = 255;
				}
			}
		};
	}
	//this.setColor
	if (typeof this.setColor != "function")
	{
		FColor.prototype.setColor = function(colorString)
		{
			colorString = (typeof colorString !== 'undefined') ? colorString : false;
			if (!colorString || colorString == "none" || colorString == "NONE")
			{
				if (this.isDefined);
					this.isDefined = false;
				return;
			}
			
			if ((colorString.length >= 7) && (colorString.length < 9))
			{
				this.setHexaColor(colorString);
			} else {
				this.setHexaColorRGBA(colorString);
			}			
		};
	}	

	/*.:Funcion de inicialización del constructor (Siempre al final, por si las moscas):.*/
	if (typeof this.init != "function")
	{
		FColor.prototype.init = function(colorCode)
		{
			this.setColor(colorCode);
		};
	}

	this.init(hexaColor); //Llamada a la inicialización

}
})();


//FImage

/**
* Esta es una clase muy personalizada,
* para si por ejemplo tenemos una imagen - MiImagen01.png
* la version de baja calidad deberia llamarse low_MiImagen01.png
* La version de calidad meedia deberia llamarse med_MiImage01.png
**/


//Terminar otro dia, falta la prueba y por ahora listo de FBase en esta semana
(function() {
var FullLoaded = new Array();
var MedLoaded = new Array();
var LowLoaded = new Array();
var tmpSA;
FImage = function(src)
{
	tmpSA = this;
	this.myImg = new Image();
	this.src = src;
	this.medQuality = 0;
	this.lowQuality = 0;
	this.id = FullLoaded.length;

	LowLoaded[LowLoaded.length] = false;
	MedLoaded[MedLoaded.length] = false;
	FullLoaded[FullLoaded.length] = false;

	this.init();
}
//Funciones internas
function loadImagen(etapa, func)
{
	var tmpThis = this;
	return function(event)
	{

		event = EventUtil.getEvent(event);
		switch (etapa)
		{
			case 0:
				EventUtil.removeHandler(tmpThis.lowQuality, "load", loadImagen(0, func));
				EventUtil.removeHandler(tmpThis.lowQuality, "error", loadImagen(0));
				LowLoaded[tmpThis.id] = true;
				if (tmpThis.medQuality instanceof Image)
				{
					var Filename = tmpThis.src.split("/").pop();
					var Pathname = "";
					if (tmpThis.src.indexOf("/") != -1)
					{
						Pathname = tmpThis.src.slice(0, tmpThis.src.lastIndexOf("/"));
						Pathname += "/";
					}
					EventUtil.addHandler(tmpThis.medQuality, "error", loadImagen.call(tmpThis, 1));
					EventUtil.addHandler(tmpThis.medQuality, "load", loadImagen.call(tmpThis, 1, func));
					tmpThis.medQuality.src = Pathname + "med_" + Filename;
				} else {
					EventUtil.addHandler(tmpThis.myImg, "error", loadImagen.call(tmpThis, 2));
					EventUtil.addHandler(tmpThis.myImg, "load", loadImagen.call(tmpThis, 2, func));
					tmpThis.myImg.src = tmpThis.src;
				}
				//$("#elem").css('background-image', "url('" + tmpThis.lowQuality.src + "')");
				func(tmpThis.lowQuality.src, 0);
			break;
			case 1:
				EventUtil.removeHandler(tmpThis.medQuality, "load", loadImagen(1, func));
				EventUtil.removeHandler(tmpThis.medQuality, "error", loadImagen(1));
				MedLoaded[tmpThis.id] = true; 

				EventUtil.addHandler(tmpThis.myImg, "error", loadImagen.call(tmpThis, 2));
				EventUtil.addHandler(tmpThis.myImg, "load", loadImagen.call(tmpThis, 2, func));
				tmpThis.myImg.src = tmpThis.src;
				func(tmpThis.medQuality.src, 1);
			break;
			case 2:
				EventUtil.removeHandler(tmpThis.myImg, "load", loadImagen(2, func));
				EventUtil.removeHandler(tmpThis.myImg, "error", loadImagen(2));
				FullLoaded[tmpThis.id] = true; 
				//$("#elem").css('background-image', "url('" + tmpThis.myImg.src + "')");
				func(tmpThis.myImg.src, 2);
			break;
		}
	};
}

FImage.prototype.load = function(callback)
{
	var Filename = this.src.split("/").pop();
	var Pathname = "";
	
	if (this.src.indexOf("/") != -1)
	{
		Pathname = this.src.slice(0, this.src.lastIndexOf("/"));
		Pathname += "/";
	}
	var lowQualImage = Pathname + "low_" + Filename;
	var medQualImage = Pathname + "med_" + Filename;
	//Chequear si existen las imagenes de media y baja calidad
	if (UrlExists(lowQualImage))
		this.lowQuality = new Image();
	if (UrlExists(medQualImage))
		this.medQuality = new Image();
	if (this.lowQuality instanceof Image) {
		EventUtil.addHandler(this.lowQuality, "error", loadImagen.call(this, 0));
		EventUtil.addHandler(this.lowQuality, "load", loadImagen.call(this, 0, callback));
		this.lowQuality.src = lowQualImage;

	} else if (this.medQuality instanceof Image) {
		EventUtil.addHandler(this.medQuality, "error", loadImagen.call(this, 1));
		EventUtil.addHandler(this.medQuality, "load", loadImagen.call(this, 1, callback));
		this.medQuality.src = medQualImage;
	} else {
		EventUtil.addHandler(this.myImg, "error", loadImagen.call(this, 2));
		EventUtil.addHandler(this.myImg, "load", loadImagen.call(this, 2, callback));
		this.myImg.src = this.src;
	}
}
FImage.prototype.init = function()
{
	//this.lowQuality = new Image();
	//this.load();
}
})();

//FPath (para la proxima version)
//FMain

(function() {
var defaultFPS = 60;
var FPS = new Array();
var estado = new Array();
var thisClassName = "FMain"; //IMPORTANTISIMO!!!
var TimeoutsData = new Array();
FMain = function()
{
	//TimeoutsData[this.id] = new Array();
	this.Events = new Array();
	this.maxTime = 60000;
	this.obj = 0;
	this.tspeed = 1.0;
	this.buttonState = false;
	this.MainID = FPS.length;
	FPS[this.MainID] = defaultFPS;
	TimeoutsData[this.MainID] = new Array();
	estado[this.MainID] = true;
	//timeoutCleaner.call(this);
}

//Funciones internas privadas
function eventCallback(id)
{
	var t_this = this;
	this.Events[id].rf = function(event)
	{
		if (!estado[t_this.MainID])
			return;
		event = EventUtil.getEvent(event);
		t_this.Events[id].func(t_this, event, t_this.Events[id].args, id);
	}
	switch (this.Events[id].type)
	{
		case 'FMouseOver':
			EventUtil.addHandler(this.Events[id].obj, 'mouseover', this.PerfectOnMouseOver(id));
		break;
		case 'FMouseOut':
			EventUtil.addHandler(this.Events[id].obj, 'mouseout', this.PerfectOnMouseOut(id));
		break;
		default:
			EventUtil.addHandler(this.Events[id].obj, this.Events[id].type, this.Events[id].rf);
	}
}
function reverseTimeout()
{
	var tmpTimeout;
	if (arguments.length <= 0)
		tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	var z=0;
	var limit=tmpTimeout.length;
	var finnish=false;
	for (var i=tmpTimeout.length-1; i > 0; i--)
	{
		if(isArray(tmpTimeout[i]))
		{
			reverseTimeout.call(this, tmpTimeout[i]);
		} else if (tmpTimeout[i])
		{
			if (tmpTimeout[i].termino)
			{
				tmpTimeout[i].stop();
				if (z>=i)
					finnish = true;
				if (!finnish)
				{
					var tDelay = tmpTimeout[i].oDelay;
					var tRemain = tmpTimeout[i].remaining; 
					tmpTimeout[i].oDelay = tmpTimeout[z].oDelay;
					tmpTimeout[i].remaining = tmpTimeout[z].remaining;
					tmpTimeout[z].oDelay = tDelay;
					tmpTimeout[z].remaining = tRemain;
					//alert("I: " + i + " - Z: " + z + " - Remmain F: " + tmpTimeout[z].oDelay + " - Remain I: " + tmpTimeout[i].oDelay);
				}
				tmpTimeout[i].play();
				z++;
			} else {
				tmpTimeout[i].stop();
				tmpTimeout[i] = 0;
				limit = i;
			}
		}
	}

	tmpTimeout.length = limit;
}

FMain.prototype.getClassTypeName = function()
{
	return thisClassName;
}

FMain.prototype.setState = function(mode)
{
	if (mode == estado[this.MainID])
		return;
	estado[this.MainID] = mode;
	if (!estado[this.MainID])
	{
		this.pauseAll();
	} else {
		this.playAll();
	}
}

FMain.prototype.getNonConvertedFPS = function()
{
	return FPS[this.MainID];
}
FMain.prototype.getFPS = function()
{
	return Math.round(1000/FPS[this.MainID]);
}
FMain.prototype.replayAll = function()
{
	if (arguments.length <= 0)
		var tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		var tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	for (var i=0; i < tmpTimeout.length; i++)
	{
		if(isArray(tmpTimeout[i]))
		{
			this.replayAll(tmpTimeout[i]);
		} else if (tmpTimeout[i])
		{
			tmpTimeout[i].stop();
			tmpTimeout[i].play();
		}
	}
}

FMain.prototype.loopAll = function()
{
	if (arguments.length <= 0)
		var tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		var tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	var maxDelay = -1;
	for (var i=0; i < tmpTimeout.length; i++)
	{
		if(isArray(tmpTimeout[i]))
		{
			for (var j=0; j < tmpTimeout[i].length; j++)
			{
				if(isArray(tmpTimeout[i][j]))
					continue;
				if (!tmpTimeout[i][j] || tmpTimeout[i][j].termino)
					continue;
				if (maxDelay < tmpTimeout[i][j].remaining)
					maxDelay = tmpTimeout[i][j].remaining;
			}
		} else if (tmpTimeout[i])
		{
			if (!tmpTimeout[i] || tmpTimeout[i].termino)
				continue;
			if (maxDelay < tmpTimeout[i].remaining)
				maxDelay = tmpTimeout[i].remaining;
		}
	}
	window.setTimeout(function(t_obj, tmpTime) { return function() { t_obj.replayAll(tmpTime); t_obj.loopAll(tmpTime);}; }(this, tmpTimeout), maxDelay);		
}

FMain.prototype.clearAllTimeouts = function()
{
	if (arguments.length <= 0)
		var tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		var tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	for (var i=0; i < tmpTimeout.length; i++)
	{
		if(isArray(tmpTimeout[i]))
		{
			this.clearAllTimeouts(tmpTimeout[i]);
		} else if (tmpTimeout[i])
		{
			tmpTimeout[i].destroy();
			tmpTimeout[i] = 0;
		}
	}
	tmpTimeout.length = 0;
}

FMain.prototype.pauseAll = function()
{
	if (arguments.length <= 0)
		var tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		var tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	for (var i=0; i < tmpTimeout.length; i++)
	{
		if(isArray(tmpTimeout[i]))
		{
			this.pauseAll(tmpTimeout[i]);
		} else if (tmpTimeout[i])
		{
			tmpTimeout[i].pause();
		}
	}
}

FMain.prototype.playAll = function()
{
	if (arguments.length <= 0)
		var tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		var tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	for (var i=0; i < tmpTimeout.length; i++)
	{
		if(isArray(tmpTimeout[i]))
		{
			this.playAll(tmpTimeout[i]);
		} else if (tmpTimeout[i])
		{
			tmpTimeout[i].play();
		}
	}	
}

FMain.prototype.resumeAll = function()
{
	if (arguments.length <= 0)
		var tmpTimeout = TimeoutsData[this.MainID]; //es una copia de referencia, por lo cual no hay problem
	else
		var tmpTimeout = arguments[0];
	if(!isArray(tmpTimeout))
		return;
	for (var i=0; i < tmpTimeout.length; i++)
	{
		if(isArray(tmpTimeout[i]))
		{
			this.resumeAll(tmpTimeout[i]);
		} else if (tmpTimeout[i])
		{
			tmpTimeout[i].resume();
		}
	}	
}

FMain.prototype.pause = function(i)
{
	this.pauseAll(TimeoutsData[this.MainID][i]);
}

FMain.prototype.play = function(i)
{
	this.playAll(TimeoutsData[this.MainID][i]);
}

FMain.prototype.resume = function(i)
{
	this.resumeAll(TimeoutsData[this.MainID][i]);
}

FMain.prototype.clearTimeouts = function(i)
{
	this.clearAllTimeouts(TimeoutsData[this.MainID][i]);
}

FMain.prototype.loop = function(i)
{
	this.loopAll(TimeoutsData[this.MainID][i]);
}

FMain.prototype.addTimeout = function(Func, delay, i)
{
	var index;
	if(!isArray(TimeoutsData[this.MainID][i]))
	{
		TimeoutsData[this.MainID][i] = 0;
		TimeoutsData[this.MainID][i] = new Array();
	}
	index = TimeoutsData[this.MainID][i].length;
	var tmpTimer = new FTimer(Func, delay);
	TimeoutsData[this.MainID][i].push(tmpTimer);
	
	tmpTimer.onTermino = function(tmainid, tid, tindex) { return function() {
		TimeoutsData[tmainid][tid].splice(tindex, 1);
	}; }(this.MainID, i, index);
	//this.clearTimeouts(i);


}
FMain.prototype.timePlayed = function(i)
{
	if(!isArray(TimeoutsData[this.MainID][i]) || TimeoutsData[this.MainID][i].length < 1)
		return -1;
	var acTime = new Date();
	var iniTime = TimeoutsData[this.MainID][i][0].start;
	var passTime = acTime - iniTime;
	passTime += TimeoutsData[this.MainID][i][0].remaining;
	if (passTime < 0)
		return 0;
	if (passTime > TimeoutsData[this.MainID][i][TimeoutsData[this.MainID][i].length-1].remaining)
		return TimeoutsData[this.MainID][i][TimeoutsData[this.MainID][i].length-1].remaining;
	return passTime;
}
FMain.prototype.timeLeft = function(i)
{
	if(!isArray(TimeoutsData[this.MainID][i])  || TimeoutsData[this.MainID][i].length < 1)
		return -1;
	var leftTime = TimeoutsData[this.MainID][i][TimeoutsData[this.MainID][i].length-1].remaining - this.timePlayed(i);
	if (leftTime < 0)
		return 0;
	if (leftTime > TimeoutsData[this.MainID][i][TimeoutsData[this.MainID][i].length-1].remaining)
		return TimeoutsData[this.MainID][i][TimeoutsData[this.MainID][i].length-1].remaining;
	return leftTime;
}
FMain.prototype.timeDuration = function(i)
{
	if(!isArray(TimeoutsData[this.MainID][i])  || TimeoutsData[this.MainID][i].length < 1)
		return -1;
	return TimeoutsData[this.MainID][i][TimeoutsData[this.MainID][i].length-1].remaining - TimeoutsData[this.MainID][i][0].remaining;
}
FMain.prototype.reverseAll = function()
{
	reverseTimeout.call(this);
}
FMain.prototype.reverseAnim = function(i)
{
	if(!isArray(TimeoutsData[this.MainID][i]))
		return false;
	reverseTimeout.call(this, TimeoutsData[this.MainID][i]);
}
FMain.prototype.fixTime = function(time)
{
	if (time > this.maxTime)
		time = this.maxTime;
	if (time < this.getFPS())
		time = this.getFPS();
	return time;
}

FMain.prototype.addEvent = function(evento, callback, params)
{
	if (!this.obj)
		return;
	var tmpId = nullElement(this.Events);
	var id;
	if (tmpId >= 0)
		id = tmpId;
	else
		id = this.Events.length;
	this.Events[id] = {obj: this.obj, type: evento, func: callback, args: params, rf: null};
	eventCallback.call(this, id);
	return id;
}
FMain.prototype.removeEvent = function(id)
{
	EventUtil.removeHandler(this.Events[id].obj, this.Events[id].type, this.Events[id].rf);
	this.Events[id] = null;
}
FMain.prototype.addCSS = function(str)
{
	if (!this.obj)
		return;
	try
	{
		this.obj.style.cssText += str;
	} catch (ex) {
		throw new Error("EL objeto no acepta CSSText");
	}
}
FMain.prototype.clearCSS = function()
{
	if (!this.obj)
		return;
	var mode = (arguments.length > 1) ? arguments[0] : false;
	try
	{
		this.obj.style.cssText = "";
		if (mode)
		{
			for (var i in this.obj.style)
				this.obj.style[i] = "";
		}
	} catch (ex) {
		throw new Error("El objeto no acepta estilos CSS");
	}
}

//Para perfect mouseOut y Perfect MouseOver
FMain.prototype.PerfectOnMouseOut = function(id)
{
	if (!this.obj)
		return;


	var temp_this = this;
	return function onMouseOut(event) {
	if (!estado[temp_this.MainID])
		return;

	event = EventUtil.getEvent(event);
 	var current_mouse_target = EventUtil.getRelatedTarget(event);

	if( !is_child_of(temp_this.obj, current_mouse_target) && temp_this.obj != current_mouse_target ) {
		if (temp_this.buttonState)
		{
			temp_this.buttonState = false;
			temp_this.Events[id].func(temp_this, event, temp_this.Events[id].args, id);

		}
	}
    };	
};

FMain.prototype.PerfectOnMouseOver = function(id)
{
	if (!this.obj)
		return;
	var temp_this = this;
	return function onMouseOver(event) {
	event = EventUtil.getEvent(event);
 	if (!temp_this.buttonState)
	{
		temp_this.buttonState = true;
		temp_this.Events[id].func(temp_this, event, temp_this.Events[id].args, id);
	}

    };
};
})();

//FWin
(function() {

var width = new Array();
var height = new Array();
var nativeWidth = new Array();
var nativeHeight = new Array();
var scrollPos = new Array();
var scrollHeight = new Array();
var scrollWidth = new Array();
var autoRefresh = new Array();
var thisClassName = "FWin"; //IMPORTANTISIMO!!!
FWin = function()
{
	FMain.call(this);
	//this.navegador = navigator.appName;
	this.id = width.length;
	width[width.length] = 0;
	height[height.length] = 0;
	nativeWidth[nativeWidth.length] = 0;
	nativeHeight[nativeHeight.length] = 0;

	scrollPos[scrollPos.length] = new FCoord(0, 0);

	scrollHeight[scrollHeight.length] = 0;
	scrollWidth[scrollWidth.length] = 0;
	autoRefresh[autoRefresh.length] = 0;
	this.init();
}

fHeredarProto(FMain, FWin);

//Internal function
function refreshAll()
{

	this.refreshData();
}

FWin.prototype.getClassTypeName = function()
{
	return thisClassName;
}

/**
* Funcion para actualizar las width y height acorde a las dimensiones de la ventana
* 
* @return void 
**/
FWin.prototype.refreshSize = function()
{
	var pageWidth = window.innerWidth, pageHeight = window.innerHeight;
	if (typeof pageWidth != 'number')
	{
		if (document.compatMode == 'CSS1Compat') {
			pageWidth = document.documentElement.clientWidth;
			pageHeight = document.documentElement.clientHeight;
		} else {
			pageWidth = document.body.clientWidth;
			pageHeight = document.body.clientHeight;
		}
	}
	width[this.id] = pageWidth;
	height[this.id] = pageHeight;
}

FWin.prototype.getWidth = function()
{
	return width[this.id];
}
FWin.prototype.getHeight = function()
{
	return height[this.id];
}

FWin.prototype.refreshScrollPos = function()
{
	if (document.compatMode == 'CSS1Compat' && document.documentElement.scrollTop) {
		scrollPos[this.id].setY(document.documentElement.scrollTop || window.pageYOffset);
		scrollPos[this.id].setX(document.documentElement.scrollLeft || window.pageXOffset);
	} else {
		scrollPos[this.id].setY(document.body.scrollTop);
		scrollPos[this.id].setX(document.body.scrollLeft);
	}
}
FWin.prototype.getScrollX = function()
{
	return scrollPos[this.id].getX();
}
FWin.prototype.getScrollY = function()
{
	return scrollPos[this.id].getY();
}
FWin.prototype.refreshData = function()
{
	this.refreshSize();
	this.refreshScrollPos();
}
/**
* Funcion que define si la informacion de window debe actualizarse constantemente o no
*
* @param bool mode - [FALSE: Eliminar autoRefresh - TRUE: Habilitar autoRefresh]
*
* @return void
**/
FWin.prototype.autoRefresh = function(mode)
{
	if (mode)
	{
		if (!autoRefresh[this.id])
		{
			EventUtil.addHandler(window, "resize", function(t_win) { return function() {
				 t_win.refreshSize();
			}; }(this));
			EventUtil.addHandler(window, "scroll", function(t_win) { return function() {
				 t_win.refreshScrollPos();
			}; }(this));

			autoRefresh[this.id] = true;
		}
	} else {
		if (autoRefresh[this.id])
		{
			EventUtil.removeHandler(window, "resize", function(t_win) { return function() {
				 t_win.refreshSize();
			}; }(this));
			EventUtil.addHandler(window, "scroll", function(t_win) { return function() {
				 t_win.refreshScrollPos();
			}; }(this));

			autoRefresh[this.id] = false;
		}
	}
}
/**
* Funcion que retorna informacion sobre el area visible de la pantalla
*
* @return Object [.x = pos x inicial, .y = pos y inicial, .width, .height]
**/
FWin.prototype.visibleArea = function()
{
	var endX = this.getScrollX() + this.getWidth(1);
	var endY = this.getScrollY() + this.getHeight(1);
	return {xi: this.getScrollX(), yi: this.getScrollY(), xf: endX, yf: endY };
}

FWin.prototype.init = function()
{
	this.refreshSize();
	this.refreshScrollPos();
}
})();

Ventana = new FWin(); //Variable global visible desde afuera

Ventana.autoRefresh(true);

//FObject
(function() {

var pos = new Array();
var absPos = new Array();
var oldPos = new Array();
var width = new Array();
var height = new Array();
var widthMode = new Array();
var heightMode = new Array();
var nativeWidth = new Array();
var nativeHeight = new Array();
var keyCharPressed = new Array();
var keyPressed = new Array();
var isDrag = new Array();
var pressed = new Array();
var fatherElem = new Array();
var tmpBackImgs = new Array(); //para fadeBackgroundImage

var thisClassName = "FObject"; //IMPORTANTISIMO!!!
FObject = function(tobj)
{

	FMain.call(this);
	this.id = pos.length;
	this.opacity = 1.0;
	this.posMode = false;
	this.aczoom = 1;
	this.backgroundColor = new FColor("#000000");
	this.TextColor = new FColor("#000000");
	this.angulo = 0;
	this.posMode = false;
	this.fixFontSize = -1;
	this.backgroundImage = "";
	this.nativeDisplay = "none";
	this.z = 0;
	widthMode[widthMode.length] = false;
	heightMode[heightMode.length] = false;
	pressed[pressed.length] = false;
	isDrag[isDrag.length] = false;
	tmpBackImgs[tmpBackImgs.length] = new Array();
	fatherElem[fatherElem.length] = 0;

	oldPos[oldPos.length] = new FCoord(0, 0);
	pos[pos.length] = new FCoord(0, 0);
	absPos[absPos.length] = new FCoord(0, 0);
	width[width.length] = 0;
	height[height.length] = 0;
	nativeWidth[nativeWidth.length] = 0;
	nativeHeight[nativeHeight.length] = 0;
	keyCharPressed[keyCharPressed.length] = new Array(); //pueden ser varias papu :D
	keyPressed[keyPressed.length] =  new Array(); //pueden ser varias papu :D

	this.obj = tobj;
	this.init();
}

fHeredarProto(FMain, FObject);

//Funciones internet
function autoRefreshCenter(mode)
{
	var tmpThis = this;
	return function(evento)
	{
		evento = EventUtil.getEvent(evento);
		tmpThis.center(mode);
	};
}

//Funciones internet
function dragFunction(mode, limit)
{
	var tmpThis = this;
	return function(event) {
	//alert(isDrag[tmpThis.id]);
	event = EventUtil.getEvent(event);
	if (!isDrag[tmpThis.id])
	{
		EventUtil.removeHandler(tmpThis.obj, 'mousedown', arguments.callee);
		EventUtil.removeHandler(tmpThis.obj, 'mousemove', arguments.callee);
		EventUtil.removeHandler(tmpThis.obj, 'mouseup', arguments.callee);
		EventUtil.removeHandler(tmpThis.obj, 'touchstart', arguments.callee);
		EventUtil.removeHandler(tmpThis.obj, 'touchmove', arguments.callee);
		EventUtil.removeHandler(tmpThis.obj, 'touchend', arguments.callee);
		return;
	}
	switch (event.type)
	{
		case 'touchstart':
		case 'mousedown':

			if (event.type == 'mousedown' && EventUtil.getButton(event) != 0 && mode)
				break;
			var posx, posy;
			pressed[tmpThis.id] = true;

			if (event.type == 'touchstart')
			{
				posx = Math.round(event.touches[0].clientX - (tmpThis.getWidth(1)/2));
				posy = Math.round(event.touches[0].clientY - (tmpThis.getHeight(1)/2));
			} else {
				posx = Math.round(event.clientX - (tmpThis.getWidth(1)/2));
				posy = Math.round(event.clientY - (tmpThis.getHeight(1)/2));
			}

			tmpThis.setPosX(posx, 2);
			tmpThis.setPosY(posy, 2);
			tmpThis.refreshPosition();
			tmpThis.refreshData();
			EventUtil.preventDefault(event);
		break;
		case 'touchmove':
		case 'mousemove':
			if (!pressed[tmpThis.id] && !mode)
				break;
			var posx, posy;
			if (event.type == 'touchmove')
			{
				posx = Math.round(event.changedTouches[0].clientX - (tmpThis.getWidth(1)/2));
				posy = Math.round(event.changedTouches[0].clientY - (tmpThis.getHeight(1)/2));
			} else {
				posx = Math.round(event.clientX - (tmpThis.getWidth(1)/2));
				posy = Math.round(event.clientY - (tmpThis.getHeight(1)/2));
			}

			var oldPosX = tmpThis.getPosX();
			var oldPosY = tmpThis.getPosY();
			tmpThis.setPosX(posx, 2);
			tmpThis.setPosY(posy, 2);
			tmpThis.refreshData();
			//tmpThis.refreshPosition();
			//Crear y eliminar clase instantaneamente
			if (!fatherElem[tmpThis.id])
				fatherElem[tmpThis.id] = new FObject(tmpThis.obj.parentNode);
			/*if (!tmpThis.isInside(fatherElem[tmpThis.id], true, true))
			{
				//alert(tmpThis.getPosXCSS());
				//tmpThis.setPosX(oldPosX);
				//tmpThis.setPosY(oldPosY);
				//alert("lol");
			}*/
			tmpThis.refreshPosition();
			//fatherC = null;
			//delete fatherC;

		break;
		case 'touchend':
		case 'mouseup':
			if (event.type == 'mouseup' && EventUtil.getButton(event) != 0 && mode)
				break;
			pressed[tmpThis.id] = false;
			EventUtil.preventDefault(event);
		break;
	}
	};
}
function setopac(opac)
{

	if (navegador == 'Microsoft Internet Explorer')
	{
		switch (getBrowserVersion())
		{
			case ">=9":
				this.obj.style.opacity = opac;
			break;
			case ">=8":
				//elem.filters.item("DXImageTransform.Microsoft.Alpha").opacity = Math.round(100*opac);
				this.obj.style.filter ="progid:DXImageTransform.Microsoft.Alpha(enable=true, opacity=" + Math.round(100*opac) + ")";
			break;
			case ">=6":
				this.obj.style.filter='alpha(opacity='+(opac*100)+')';
			break;
			default:
				this.obj.style.opacity = opac;			
			break;
		}
	} else {
		this.obj.style.opacity = opac;
	}
}

function keyCodeUpListen()
{
	var tmpThis = this;
	return function(event) {
		var keyCode = EventUtil.getCharCode(event);
		var keyChar = String.fromCharCode(keyCode);
		var index=-1;
		//aler
	
		for (i=0; i < keyPressed[tmpThis.id].length; i++)
		{
			if (keyPressed[tmpThis.id][i] == keyCode)
			{
				index = i;
				break;
			}
		}
		if (index != -1)
		{
			keyCharPressed[tmpThis.id].splice(index, 1);
			keyPressed[tmpThis.id].splice(index, 1);
		} else {
			keyCharPressed[tmpThis.id].length = 0;
			keyPressed[tmpThis.id].length = 0;
		}
	};
}

function keyCodeListen()
{

	var tmpThis = this;
	return function(event) {

		var keyCode = EventUtil.getCharCode(event);

		var keyChar = String.fromCharCode(keyCode);
		//alert(keyCode);
		var i;
		var index=-1;
		for (i=0; i < keyPressed[tmpThis.id].length; i++)
		{
			if (keyPressed[tmpThis.id][i] == keyCode)
			{
				index = i;
				break;
			}
		}
		if (index == -1)
		{
			keyCharPressed[tmpThis.id].push(keyChar);
			keyPressed[tmpThis.id].push(keyCode);
					//alert(keyCharPressed[tmpThis.id].length);
			
		}
	};
}

function mouseEventListen(showCursor)
{
	var tmpThis = this;
	return function(event) {
		event = EventUtil.getEvent(event);
		switch (event.type)
		{
			case 'click':
				tmpThis.onClick(event);
			break;
			case 'mousedown':
				//nada
			break;
			case 'mouseup':
				//nada
			break;
			case 'mousemove':
				//nada
			break;
			case 'mouseover':
				if (showCursor)
					tmpThis.obj.style.cursor = "pointer";

				tmpThis.onMouseOver(event);

			break;
			case 'mouseout':
				if (showCursor)
					tmpThis.obj.style.cursor = "auto";
				tmpThis.onMouseOut(event);
			break;
		}
	};
}

FObject.prototype.getClassTypeName = function()
{
	return thisClassName;
}

FObject.prototype.onClick = function(eventData) { } //Sobrecargar!
FObject.prototype.onMouseOver = function(eventData) { } //Sobrecargar!
FObject.prototype.onMouseOut = function(eventData) { } //Sobrecargar!

FObject.prototype.isBeingDragged = function()
{
	return 	pressed[this.id] && isDrag[this.id];
}


//Argumento opcional [op] cursor = false, si es true, se muestra el cursor de apretar cuando se esta arriba del coso, como un boton
FObject.prototype.listenMouseEvents = function(mode)
{
	var cursor = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	if (mode)
	{
		EventUtil.addHandler(this.obj, "click", mouseEventListen.call(this, cursor));
		EventUtil.addHandler(this.obj, "mousedown", mouseEventListen.call(this, cursor));
		EventUtil.addHandler(this.obj, "mouseup", mouseEventListen.call(this, cursor));
		EventUtil.addHandler(this.obj, "mousemove", mouseEventListen.call(this, cursor));
		EventUtil.addHandler(this.obj, "mouseover", mouseEventListen.call(this, cursor));
		EventUtil.addHandler(this.obj, "mouseout", mouseEventListen.call(this, cursor));
	} else {
		EventUtil.removeHandler(this.obj, "click", mouseEventListen.call(this, cursor));
		EventUtil.removeHandler(this.obj, "mousedown", mouseEventListen.call(this, cursor));
		EventUtil.removeHandler(this.obj, "mouseup", mouseEventListen.call(this, cursor));
		EventUtil.removeHandler(this.obj, "mousemove", mouseEventListen.call(this, cursor));
		EventUtil.removeHandler(this.obj, "mouseover", mouseEventListen.call(this, cursor));
		EventUtil.removeHandler(this.obj, "mouseout", mouseEventListen.call(this, cursor));
	}
}

FObject.prototype.listenKeyPressed = function(mode)
{
	if (mode)
	{
		$(document).keydown(keyCodeListen.call(this));
		$(document).keyup(keyCodeUpListen.call(this));
		//EventUtil.addHandler(document, "keypress", keyCodeListen.call(this));
		//EventUtil.addHandler(document, "keyup", keyCodeUpListen.call(this));
	} else {
		//EventUtil.removeHandler(document, "keypress", keyCodeListen.call(this));
		$(document).off("keydown");
		$(document).off("keyup");
		//EventUtil.removeHandler(document, "keyup", keyCodeUpListen.call(this));
		keyCharPressed[this.id].length = 0;
		keyPressed[this.id].length = 0;
	}
}

FObject.prototype.getKeyCodePressed = function() //Retorna un array
{
	return clone(keyPressed[this.id]);
}
FObject.prototype.getKeyCharPressed = function()
{
	//return clone(keyCharPressed[this.id]);
	return clone(keyCharPressed[this.id]);
}
FObject.prototype.removeKeyCharPressed = function(letter)
{
	var i,len;
	for(i=0, len=keyCharPressed[this.id].length; i < len; i++)
	{
		if (letter.toLowerCase() == keyCharPressed[this.id][i].toLowerCase())
		{
			keyCharPressed[this.id].splice(i, 1);
			len--;
			i--;
		}
	}
}
/**
* Funcion para obtener tamaño del objeto
* 
* (opcional) @param bool - FALSE: Tamaño sin padding - TRUE: Tamaño con padding y border
**/

FObject.prototype.getObjSize = function()
{
	var mode = (arguments.length > 0) ? arguments[0] : false;
	if (mode)
	{
		width[this.id] = $(this.obj).forceOuterWidth();
		height[this.id] = $(this.obj).forceOuterHeight();
	} else {
		width[this.id] = $(this.obj).forceWidth();
		height[this.id] = $(this.obj).forceHeight();
	}
	if (widthMode[this.id])
	{
		if (this.obj.parentNode)
		{
			width[this.id] = Math.round((width[this.id]*100)/$(this.obj.parentNode).forceWidth());
		} else {
			width[this.id] = Math.round((width[this.id]*100)/$(document).width());
		}
	}
	if (heightMode[this.id])
	{
		if (this.obj.parentNode)
		{
			height[this.id] = Math.round((height[this.id]*100)/$(this.obj.parentNode).forceHeight());
		} else {
			height[this.id] = Math.round((height[this.id]*100)/$(document).height());
		}
	}
}
FObject.prototype.setObjSize = function()
{
	var mode = (arguments.length > 0) ? arguments[0] : false;
	if (mode)
	{
		var widthOffset = $(this.obj).css('border-left-width') + $(this.obj).css('border-left-width') + $(this.obj).css('padding-right') + $(this.obj).css('padding-left');

		var heightOffset = $(this.obj).css('border-top-width') + $(this.obj).css('border-bottom-width') + $(this.obj).css('padding-right') + $(this.obj).css('padding-left');

		var newWidth = width[this.id] - widthOffset;
		var newHeight = height[this.id] - heightOffset;

		$(this.obj).width(newWidth + "px");
		$(this.obj).height(newHeight + "px");
	} else {
		if (heightMode[this.id])
		{
			$(this.obj).height(height[this.id] + "%");
		} else {
			$(this.obj).height(height[this.id] + "px");
		}
		if (widthMode[this.id])
		{
			$(this.obj).width(width[this.id] + "%");
		} else {
			$(this.obj).width(width[this.id] + "px");
		}
	}
}
/**
* Funciones para obtener y establecer dimensiones y posicion del objeto
*
**/

/*
* Funcion para obtener ancho del objeto
*
* [OP] @param integer - Para forzar modo pixels, porcentaje o default [0: Default - 1: Fuerza modo pixels - 2: Fuerza modo porcentaje]
**/
FObject.prototype.getWidth = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : 0;
	switch (mode)
	{
		case 1:
			if (!widthMode[this.id])
				break;
			var pWidth;
			if (this.obj.parentNode)
			{
				pWidth = Math.round(($(this.obj.parentNode).forceWidth()*width[this.id])/100);
			} else {
				pWidth = Math.round(($(document).width()*width[this.id])/100);
			}
			return pWidth;
		break;
		case 2:
			if (widthMode[this.id])
				break;
			var pWidth;
			if (this.obj.parentNode)
			{
				var fWidth = $(this.obj.parentNode).forceWidth();
				if (fWidth == 0)
					return 100;
				pWidth = Math.round((width[this.id]*100)/fWidth);
			} else {
				pWidth = Math.round((width[this.id]*100)/$(document).width());
			}
			return pWidth;
		break;
	}
	return width[this.id];
}
/*
* Funcion para obtener alto del objeto
*
* [OP] @param integer - Para forzar modo pixels, porcentaje o default [0: Default - 1: Fuerza modo pixels - 2: Fuerza modo porcentaje]
**/
FObject.prototype.getHeight = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : 0;
	switch (mode)
	{
		case 1:
			if (!heightMode[this.id])
				break;
			var pHeight;
			if (this.obj.parentNode)
			{
				pHeight = Math.round(($(this.obj.parentNode).forceHeight()*height[this.id])/100);
			} else {
				pHeight = Math.round(($(document).height()*height[this.id])/100);
			}
			return pHeight;
		break;
		case 2:
			if (heightMode[this.id])
				break;
			var pHeight;
			if (this.obj.parentNode)
			{
				var fHeight = $(this.obj.parentNode).forceHeight();
				if (fHeight == 0)
					return 100;
				pHeight = Math.round((height[this.id]*100)/fHeight);
			} else {
				pHeight = Math.round((height[this.id]*100)/$(document).height());
			}
			return pHeight;
		break;
	}
	return height[this.id];
}
FObject.prototype.setWidth = function(twidth)
{
	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	if (mode != widthMode[this.id])
		widthMode[this.id] = mode;
	return width[this.id] = twidth;
}
FObject.prototype.setHeight = function(theight)
{
	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	if (mode != heightMode[this.id])
		heightMode[this.id] = mode;
	return height[this.id] = theight;
}

/**
* Funcion para obtener la posicion X del objeto
*
* [OP] @param bool - Especifica si obtener la posición absoluta o relativa del objeto
* [OP] @param integer - Forzar modo pixel, porcentaje o mantener default [0: default, 1: modo pixel, 2: modo porcentaje]
**/
FObject.prototype.getPosX = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	var returnVal;
	if (mode)
		return absPos[this.id].getX();
	else
		returnVal = pos[this.id].getX();
	
	var forceMode = (typeof arguments[1] !== 'undefined') ? arguments[1] : 0;
	switch (forceMode)
	{
		case 1:
			if (!pos[this.id].mode)
				break;
			var fX;
			if (this.obj.parentNode)
			{
				fX = Math.round(($(this.obj.parentNode).forceWidth()*returnVal)/100);
			} else {
				fX = Math.round(($(document).width()*returnVal)/100);
			}
			return fX;
		break;
		case 2:
			if (pos[this.id].mode)
				break;
			var fX;
			if (this.obj.parentNode)
			{
				var pWidth = $(this.obj.parentNode).forceWidth();
				if (pWidth == 0)
					return 0;
				fX = Math.round((returnVal*100)/pWidth);
			} else {
				if ($(document).width() == 0)
					return 0;
				fX = Math.round((returnVal*100)/$(document).width());
			}
			return fX;
		break;
	}
	return returnVal;
}
/**
* Funcion para obtener la posicion Y del objeto
*
* [OP] @param bool - Especifica si obtener la posición absoluta o relativa del objeto
* [OP] @param integer - Forzar modo pixel, porcentaje o mantener default [0: default, 1: modo pixel, 2: modo porcentaje]
**/
FObject.prototype.getPosY = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	var returnVal;
	if (mode)
		return absPos[this.id].getY();
	else
		returnVal = pos[this.id].getY();

	
	var forceMode = (typeof arguments[1] !== 'undefined') ? arguments[1] : 0;
	switch (forceMode)
	{
		case 1:
			if (!pos[this.id].mode)
				break;
			var fY;
			if (this.obj.parentNode)
			{
				fY = Math.round(($(this.obj.parentNode).forceHeight()*returnVal)/100);
			} else {
				fY = Math.round(($(document).height()*returnVal)/100);
			}
			return fY;
		break;
		case 2:
			if (pos[this.id].mode)
				break;
			var fY;
			if (this.obj.parentNode)
			{
				var pHeight = $(this.obj.parentNode).forceHeight();
				if (pHeight == 0)
					return 0;
				fY = Math.round((returnVal*100)/pHeight);
			} else {
				if ($(document).height() == 0)
					return 0;
				fY = Math.round((returnVal*100)/$(document).height());
			}
			return fY;
		break;
	}
	return returnVal;
}
FObject.prototype.getPosXCSS = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (mode)
		return absPos[this.id].getXCSS();
	else
		return pos[this.id].getXCSS();
	
}
FObject.prototype.getPosYCSS = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (mode)
		return absPos[this.id].getYCSS();
	else
		return pos[this.id].getYCSS();
}
FObject.prototype.getFatherOffset = function()
{
	var pOffset = 0;
	if (this.obj.parentNode)
	{
		pOffset = $(this.obj.parentNode).offset();
		if (this.obj.parentNode === document.body)
		{
			pOffset.left = 0;
			pOffset.top = 0;
		}
		/*pOffset.left += parseInt($(this.obj).css('margin-left'));
		pOffset.top += parseInt($(this.obj).css('margin-top'));
		pOffset.left += parseInt($(this.obj).css('padding-left'));
		pOffset.top += parseInt($(this.obj).css('padding-top'));*/
	} else {
		pOffset = {left: 0, top: 0};
	}
	return pOffset;
}
/**
* Funcion para setear X
*
* @param integer tx - valor de X actual, en pixels o porcentaje
* [OP] @param bool - Modo : 0 (default): Setea X tal cual indicamos - 1: Setea X con
valores que correspondan al absoluto de la pantalla - 2: Setea X con valores que correspondal al absoluto de la pantalla ignorando scroll, osea fixed - 3: Setea el X en modo pixels ignorando el modo porcentaje - 4: Setea el X en modo porcentaje ignorando el modo pixels
*
**/
FObject.prototype.setPosX = function(tx)
{
	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : 0;
	var POffset = 0;
	switch (mode)
	{
		case 1:
			POffset = this.getFatherOffset();
			tx -= POffset.left;
		break;
		case 2:
			POffset = this.getFatherOffset();
			tx -= POffset.left;
			tx += Ventana.getScrollX();
		break;
		case 3:
			if (!pos[this.id].mode)
				break;
			if (this.obj.parentNode)
			{
				var pWidth = $(this.obj.parentNode).forceWidth();
				if (pWidth == 0)
				{
					tx = 0
					break;
				}
				tx = Math.round((tx*100)/pWidth);
			} else {
				if ($(document).width() == 0)
				{
					tx = 0
					break;
				}
				tx = Math.round((tx*100)/$(document).width());
			}
		break;
		case 4:
			if (pos[this.id].mode)
				break;

			if (this.obj.parentNode)
			{
				tx = Math.round(($(this.obj.parentNode).forceWidth()*tx)/100);
			} else {
				tx = Math.round($(document).width()*tx/100);
			}
		break;
	}
	oldPos[this.id].setX(this.getPosX());

	return pos[this.id].setX(tx);
}
/**
* Funcion para setear Y
*
* @param integer ty - valor de Y actual, en pixels o porcentaje
* [OP] @param bool - Modo : 0 (default): Setea Y tal cual indicamos - 1: Setea Y con
valores que correspondan al absoluto de la pantalla - 2: Setea Y con valores que correspondal al absoluto de la pantalla ignorando scroll, osea fixed - 3: Setea el Y en modo pixels ignorando el modo porcentaje - 4: Setea el Y en modo porcentaje ignorando el modo pixels
*
**/
FObject.prototype.setPosY = function(ty)
{
	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : 0;
	var POffset = 0;
	switch (mode)
	{
		case 1:
			POffset = this.getFatherOffset();
			ty -= POffset.top;
		break;
		case 2:
			POffset = this.getFatherOffset();
			ty -= POffset.top;
			ty += Ventana.getScrollY();
		break;
		case 3:
			if (!pos[this.id].mode)
				break;
			if (this.obj.parentNode)
			{
				var pHeight = $(this.obj.parentNode).forceHeight();
				if (pHeight == 0)
				{
					ty = 0
					break;
				}
				ty = Math.round((ty*100)/pHeight);
			} else {
				if ($(document).height() == 0)
				{
					ty = 0
					break;
				}
				ty = Math.round((ty*100)/$(document).height());
			}
		break;
		case 4:
			if (pos[this.id].mode)
				break;
			if (this.obj.parentNode)
			{
				ty = Math.round(($(this.obj.parentNode).forceHeight()*ty)/100);
			} else {
				ty = Math.round($(document).height()*ty/100);
			}
		break;
	}
	oldPos[this.id].setY(this.getPosY());
	return pos[this.id].setY(ty);
}

/**
* Funcion para establecer establecer transparencia
* 
* (OP) @param float - Nueva transparencia a asignar
*
* @return float - La vieja transparencia antes de cambiarla
**/
FObject.prototype.setOpacity = function()
{
	var oldOpac = this.opacity;
	var tmpOpac = (arguments.length > 0) ? arguments[0] : this.opacity;
	this.opacity = tmpOpac;
	setopac.call(this, tmpOpac); //Se usa para llamar a metodos privados
	return oldOpac;
}

FObject.prototype.fade = function(fopac, tiempo)
{
	var acOpac = (typeof arguments[2] != 'undefined') ? arguments[2] : this.opacity;
	tiempo = this.fixTime(tiempo);
	var FPS;
	if ((FPS = this.getFPS()) <= 0)
		FPS = 30;
	var steps = (tiempo/this.getFPS());
	var incrOpac = (fopac-acOpac)/steps;
	this.clearTimeouts(0);
	for (var i=FPS; i < tiempo; i+=FPS)
	{
		acOpac += incrOpac;
		this.addTimeout(function(tthis, topac) { return function() {
			tthis.setOpacity(topac);
		}; }(this, acOpac), i, 0);
	}
	this.addTimeout(function(tthis, topac) { return function() {
			tthis.setOpacity(topac);
	}; }(this, acOpac), tiempo, 0);
	return 0;
}

FObject.prototype.fadeIn = function(tiempo)
{
	var fopac = (typeof arguments[1] != 'undefined') ? arguments[1] : 1.0;
	return this.fade(fopac, tiempo);
}

FObject.prototype.fadeOut = function(tiempo)
{
	var fopac = (typeof arguments[1] != 'undefined') ? arguments[1] : 0.0;
	return this.fade(fopac, tiempo);
}

FObject.prototype.getOpacity = function()
{
	if (!this.obj)
		return;
	return parseInt($(this.obj).css('opacity'));
};
FObject.prototype.zoom = function(xzoom)
{
	if (!this.obj)
		return;
	var tmpObj = 0;
	var mzoom = (xzoom/this.aczoom);
	var nFontSize = 0;
	this.getObjSize();
	if (arguments[1])
	{
		tmpObj = arguments[1];
		var RwidthSize = $(tmpObj).forceWidth();

		var RheightSize = $(tmpObj).forceHeight();


		tmpObj.style.width = Math.round(RwidthSize*mzoom) + "px";
		tmpObj.style.height = Math.round(RheightSize*mzoom) + "px";

		if (typeof tmpObj.fixFontSize === 'undefined')
		{
			if (window.getComputedStyle)
	   			nFontSize = parseInt(document.defaultView.getComputedStyle(tmpObj,null).fontSize)*mzoom;
			else if (this.obj.currentStyle)
	    			nFontSize = parseInt(tmpObj.currentStyle.fontSize)*mzoom;
		} else {
			nFontSize = tmpObj.fixFontSize*mzoom;
		}
		tmpObj.fixFontSize = nFontSize;
		tmpObj.style.fontSize = Math.round(nFontSize) + "px";		
	}
	else
	{
		tmpObj = this.obj;
		this.obj.style.width = this.getWidth(1) + "px";
		this.obj.style.height = this.getHeight(1) + "px";
		this.obj.style.overflow = "hidden";
		if (this.fixFontSize == -1)
		{
			var tFontSize = parseInt($(this.obj).css('font-size'));
			nFontSize = tFontSize*mzoom;
		} else {
			nFontSize = this.fixFontSize*mzoom;
		}

		this.fixFontSize = nFontSize;
		this.obj.style.fontSize = Math.round(nFontSize) + "px";
	}
	var tmpChilds = tmpObj.childNodes;
	for (var i=0; i < tmpChilds.length; i++)
	{
		if (tmpChilds[i].nodeType != 1)
			continue;
		if (typeof tmpChilds[i].tagName === 'undefined')
			continue;
		switch (tmpChilds[i].tagName.toLowerCase())
		{
			case "div":
				this.zoom(xzoom, tmpChilds[i]);			
			break;
			case "img":
				var widthSize = 0;
				if(tmpChilds[i].offsetWidth)
				{
					widthSize=tmpChilds[i].offsetWidth;
				}
				else if (tmpChilds[i].style.pixelWidth){
					widthSize=tmpChilds[i].style.pixelWidth;
				}
				var heightSize = 0;
				if(tmpChilds[i].offsetWidth)
				{
					heightSize=tmpChilds[i].offsetWidth;
				}
				else if (tmpChilds[i].style.pixelWidth){
					heightSize=tmpChilds[i].style.pixelWidth;
				}
				tmpChilds[i].style.width = Math.round(widthSize*mzoom) + "px";
				tmpChilds[i].style.height = Math.round(heightSize*mzoom) + "px";
			break;
		}
	}
	if (!arguments[1])
		this.aczoom = xzoom;

};

/**
* @param angulo integer - angulo a rotar el elemento
* @param [OP] integer - FALSE(D): No rotar a los childs - TRUE: rotar a los childs
*/

FObject.prototype.rotar = function(angulo)
{
       if (angulo >= 0) {
        var rotation = Math.PI * angulo / 180;
    } else {
        var rotation = Math.PI * (360+angulo) / 180;
    }
    var c = Math.cos(rotation),
    s = Math.sin(rotation);
	if (!arguments[1])
	{
		this.obj.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+c+",M12="+(-s)+",M21="+s+",M22="+c+",SizingMethod='auto expand')";
    		this.obj.style.webkitTransform = 'rotate('+angulo+'deg)'; 
    		this.obj.style.mozTransform    = 'rotate('+angulo+'deg)'; 
    		this.obj.style.msTransform     = 'rotate('+angulo+'deg)'; 
    		this.obj.style.oTransform      = 'rotate('+angulo+'deg)'; 
    		this.obj.style.transform       = 'rotate('+angulo+'deg)';
	} else {
		var tmpChilds = this.obj.childNodes;
		for (var i=0; i < tmpChilds.length; i++)
		{
			if (typeof tmpChilds[i].tagName === 'undefined')
				continue;
			tmpChilds[i].style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+c+",M12="+(-s)+",M21="+s+",M22="+c+",SizingMethod='auto expand')";
    			tmpChilds[i].style.webkitTransform = 'rotate('+angulo+'deg)'; 
    			tmpChilds[i].style.mozTransform    = 'rotate('+angulo+'deg)'; 
    			tmpChilds[i].style.msTransform     = 'rotate('+angulo+'deg)'; 
    			tmpChilds[i].style.oTransform      = 'rotate('+angulo+'deg)'; 
    			tmpChilds[i].style.transform       = 'rotate('+angulo+'deg)';			
		}
	} 
	this.angulo = angulo;
};
FObject.prototype.transRotar = function(time, endAngulo)
{
	if (!this.obj)
		return;
	var acelMode = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;
	/*0: Usar time, 1: Usar tiempo restante, 2: Usar tiempo reproducido, 3: Viajar en el tiempo*/
	var playMode = (typeof arguments[3] !== 'undefined') ? arguments[3] : 0;
	var acAngulo = (typeof arguments[4] !== 'undefined') ? arguments[4] : this.angulo;

	var iniAngulo = acAngulo;
	var tTime=-1;
	switch (playMode)
	{
		case 1:
			tTime = time - this.timePlayed(2);
			this.obj.innerHTML = "Time left: " + tTime;
		break;
		case 2:
			tTime = this.timePlayed(2);
			this.obj.innerHTML = "Time Played: " + tTime;
		break;
		case 3:
			var timeB = this.timePlayed(2);
			var timeA = time - timeB;
			tTime = (timeA >= timeB) ? timeA : timeB;
		break;
	}
	if  (tTime != -1)
		time = tTime;
	time = this.fixTime(time);

	this.clearTimeouts(2);
	var acel=0;
	var steps = time/this.getFPS();
	var Incr = (endAngulo - acAngulo)/steps;
	var i;
	var z=0;
	var semiTime = Math.round(steps/2);
	if (acelMode)
	{
		var desp = endAngulo - acAngulo;
		acel = 2*parseFloat(parseFloat(desp/2)/Math.pow(parseFloat(steps/2), 2));
		Incr = 0;
	}

	for (i=this.getFPS(); i < time; i+=this.getFPS(), z++)
	{
		if (z >= semiTime)
			Incr-=acel;
		else
			Incr+=acel;
		if (((iniAngulo < endAngulo) && (acAngulo > endAngulo)) || ((iniAngulo > endAngulo) && (acAngulo < endAngulo))) {
			acAngulo = endAngulo;
		}
		acAngulo+=Incr;
		//this.rotar(acAngulo);
		this.addTimeout(function(t_ang, t_obj) { return function() { t_obj.rotar(t_ang); }; }(acAngulo, this), i, 2);
	}
	this.addTimeout(function(t_ang, t_obj) { return function() { t_obj.rotar(t_ang); }; }(endAngulo, this), i, 2);
	return 2;
};
FObject.prototype.transZoom = function(time, endZoom)
{
	if (!this.obj)
		return;
	var acelMode = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;
	/*0: Usar time, 1: Usar tiempo restante, 2: Usar tiempo reproducido*/
	var playMode = (typeof arguments[3] !== 'undefined') ? arguments[3] : 0;
	var acZoom = (typeof arguments[4] !== 'undefined') ? arguments[4] : this.aczoom;
	var iniZoom = acZoom;
	var acel = 0;
	var tTime=-1;
	switch (playMode)
	{
		case 1:
			tTime = this.timeLeft(1);
		break;
		case 2:
			tTime = this.timePlayed(1);
		break;
	}
	if (tTime != -1)
		time = tTime;
	time = this.fixTime(time);
	this.clearTimeouts(1);
	var steps = time/this.getFPS();
	var Incr = (endZoom - acZoom)/steps;
	var i;
	var z=0;
	var semiTime = Math.round(steps/2);
	if (acelMode)
	{
		var desp = endZoom - acZoom;
		acel = 2*parseFloat(parseFloat(desp/2)/Math.pow(parseFloat(steps/2), 2));
		Incr = 0;
	}

	for (i=this.getFPS(); i < time; i+=this.getFPS(), z++)
	{
		if (z >= semiTime)
			Incr-=acel;
		else
			Incr+=acel;
		if (((iniZoom < endZoom) && (acZoom > endZoom)) || ((iniZoom > endZoom) && (acZoom < endZoom))) {
			acZoom = endZoom;
		}
		acZoom+=Incr;
		this.addTimeout(function(t_zoom, t_obj) { return function() { t_obj.zoom(t_zoom); }; }(acZoom, this), i, 1);
		
	}
	
	this.addTimeout(function(t_zoom, t_obj) { return function() { t_obj.zoom(t_zoom); }; }(endZoom, this), i, 1);
	return 1;
};

FObject.prototype.refreshData = function()
{
	//pos[this.id].getDOMObjPos(this.obj);
	//pos[this.id].setZ(0);
	absPos[this.id].getDOMObjPos(this.obj, true);
	absPos[this.id].setZ(0);
	this.getObjSize(true);
}
/**
* Funcion para establecer position del objeto
* [OP] @param bool estado - Si se debe trabajar en modo pixels o modo porcentaje [FALSE: Pixels - TRUE: Porcentaje]
* [OP] @param bool - Para especificar si se debe obtener o no la posicion actual del objeto cuando se cambia de estado. [(D) FALSE: No se cambia, se hace conversion automatica - TRUE: Se cambia mediante la posicion actual del objeto
**/
FObject.prototype.refreshPosition = function(estado)
{
	var Restado = (typeof estado !== 'undefined') ? estado : pos[this.id].mode;	
	var Rchange = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;	
	if (Restado != pos[this.id].mode)
	{
		pos[this.id].mode = Restado;
		oldPos[this.id].mode = Restado;
		if (Rchange)
		{	
			pos[this.id].getDOMObjPos(this.obj);
		} else {
			if (pos[this.id].mode)
			{
				pos[this.id].setY(this.getPosY(2));
				pos[this.id].setX(this.getPosX(2));
			} else {
				pos[this.id].setY(this.getPosY(1));
				pos[this.id].setX(this.getPosX(1));
			}
		}
		oldPos[this.id].setY(this.getPosY());
		oldPos[this.id].setX(this.getPosX());
	}
	$(this.obj).css('top', this.getPosYCSS(false));
	$(this.obj).css('left', this.getPosXCSS(false));
	//alert("lol");
	//Para emular 3ra dimension (calcular y aplicar Z)
	if (this.z != 0)
		this.zoom(this.calcZ());
};
FObject.prototype.calcZ = function()
{
	var tmpZ = pos[this.id].getZ();
	if (arguments.length > 0)
		tmpZ = arguments[0];

	var endZ = 0.0;
	if (tmpZ >= 0)
	{
		endZ = parseFloat(1.0 + parseFloat(tmpZ)*0.01);
	} else if (tmpZ == 0)
	{
		endZ = 1.0;
	} else {
		var rtmp = -tmpZ;
		endZ = parseFloat(1.0/(1.0+parseFloat(rtmp)*0.01));
	}
	if (!pos[this.id].mode)
	{
		if (tmpZ > 0)
		{
			endZ= 1.0 + (endZ-1.0)*2;
		} else if (tmpZ < 0) {
			endZ = endZ - ((1.0-endZ)/2);
		}
	}

	return endZ;
}

/**
* Funcion para determinar si el objeto se encuentra fuera de los limites de otro
*
* @param FObject ObjB - Objeto con el cual se desea verificar si esta fuera de los limites de este
* [OP] @param bool - HAbilita modo estricto default false- TRUE: Se toma el cuenta si el objeto en su totalidad esta dentro del
* segundo, FALSE: Solo se toma en cuenta las coordenadas x e y si estan afuera o no
* [OP] @param bool - Habilita el modo de detección preventiva, y normalizado
**/
FObject.prototype.isInside = function(ObjB)
{
	if (!this.obj || !(ObjB instanceof FObject))
		return false;

	var strictMode = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	var preventMode = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;
	
	var IobjBX = ObjB.getPosX(true);
	var IobjBY = ObjB.getPosY(true);
	var IobjAX = this.getPosX(true);
	var IobjAY = this.getPosY(true);

	if (preventMode)
	{
		IobjAX += this.getPosX() - oldPos[this.id].getX();
		IobjAY += this.getPosY() - oldPos[this.id].getY();
	}

	var FobjBX = IobjBX + ObjB.getWidth(1);
	var FobjBY = IobjBY + ObjB.getHeight(1);
	var FobjAX = IobjAX + this.getWidth(1);
	var FobjAY = IobjAY + this.getHeight(1);

	var cond = 0;
	var newX = 0;
	var newY = 0;
	if (strictMode)
	{
		cond = !!(IobjAX > IobjBX && IobjAY > IobjBY && FobjAX < FobjBX && FobjAY < FobjBY);
		if (!cond && preventMode)
		{	
			if (Math.abs(IobjAX - IobjBX) < Math.abs(FobjBX - FobjAX))
			{
				newX = IobjBX;
			} else {
				newX = FobjBX-this.getWidth(1);
			}
			if (Math.abs(IobjAY - IobjBY) < Math.abs(FobjBY - FobjAY))
			{
				newY = IobjBY;
			} else {
				newY = FobjBY-this.getHeight(1);
			}
			if (IobjAX <= IobjBX || FobjAX >= FobjBX)
				this.setPosX(newX, 1);
			if (IobjAY <= IobjBY || FobjAY >= FobjBY)
				this.setPosY(newY, 1);
		}
	} else {
		cond = !!(IobjAX > IobjBX && IobjAY > IobjBY && IobjAX < FobjBY && IobjAY < FobjBY);
	}
	return cond;
}

/**
* Funcion para detectar colisiones
* @param FObject ObjB - Objeto con el cual se desea ver si hay colision
*
* @return bool - [TRUE: Hubo una colision - FALSE: Ninguna]
**/

FObject.prototype.colision = function(ObjB)
{
	if (!this.obj || !(ObjB instanceof FObject))
		return false;
	var IobjBX = ObjB.getPosX(true);
	var IobjBY = ObjB.getPosY(true);
	var IobjAX = this.getPosX(true);
	var IobjAY = this.getPosY(true);

	var FobjBX = IobjBX + ObjB.getWidth(1);
	var FobjBY = IobjBY + ObjB.getHeight(1);
	var FobjAX = IobjAX + this.getWidth(1);
	var FobjAY = IobjAY + this.getHeight(1);

	if (IobjBX <= FobjAX && FobjBX >= IobjAX && IobjBY <= FobjAY && FobjBY >= IobjAY)
		return true;
	else
		return false; 
}

/**
* Funcion para determinar si un objeto es mas grande que el otro. (Usando calculo de areas)
* @param FObject ObjB - Objeto con el cual se desea comparar dimensiones
* [OP] @param bool mode - TRUE: actualiza dimensiones [de ambos objetos] - [D] FALSE: Utiliza dimensiones almacenadas anteriormente
*
* @return bool - [TRUE: Es mayor al otro objeto - FALSE: No es mayor]
**/
FObject.prototype.compareSize = function(ObjB)
{
	if (!this.obj)
		return false;
 	if (!(ObjB instanceof FObject))
		return true; 
	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	if (mode)
	{
		this.getObjSize(true);
		ObjB.getObjSize(true);
	}
	var AreaA = this.getWidth(1)*this.getHeight(1);
	var AreaB = ObjB.getWidth(1)*ObjB.getHeight(1);

	return (AreaA > AreaB) ? true : false;
}

/**
* Funcion para saber si el objeto esta fuera o no del campo visible
* [OP] @param bool mode - TRUE: Analiza tambien si display:none - FALSE: SOlo analiza objetos visibles
* 
* @return bool - [TRUE: El objeto esta en el campo visible - FALSE: No esta en el campo visible]
**/
FObject.prototype.inVisibleArea = function()
{
	if (!this.obj)
		return false;
	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	if (mode && ($(this.obj).css('visible') == 'hidden'  || $(this.obj).css('display') == 'none')) {
		return false;
	}
	var iniX = this.getPosX(true);
	var iniY = this.getPosY(true);
	var finX = iniX + this.getWidth(1);
	var finY = iniY + this.getHeight(1);
	var WindowVisible = Ventana.visibleArea();
	if (finX > WindowVisible.xi && finY > WindowVisible.yi && iniX < WindowVisible.xf && iniY < WindowVisible.yf)
		return true;
	else
		return false;
}
FObject.prototype.mover = function(fX, fY, time, posMode)
{
	if (!this.obj)
		return;
	var acelMode = (typeof arguments[4] !== 'undefined') ? arguments[4] : false;

	var objX, objY;
	if (posMode)
	{
		objX = this.getPosX(false, 2);
		objY = this.getPosY(false, 2);
	} else {
		objX = this.getPosX(false, 1);
		objY = this.getPosY(false, 1);
	}

	var acX = (typeof arguments[5] !== 'undefined') ? arguments[5] : objX;
	var acY = (typeof arguments[6] !== 'undefined') ? arguments[6] : objY;
	var iniX = acX;
	var iniY = acY;
	var acelX = 0;
	var acelY = 0;
	var tTime=-1;
	if (tTime != -1)
		time = tTime;
	time = this.fixTime(time);

	this.clearTimeouts(4);

	var steps = time/this.getFPS();
	var despX = fX - acX;
	var despY = fY - acY;
	var IncrX = despX/steps;
	var IncrY = despY/steps;
	var i;
	var z=0;
	var semiTime = Math.round(steps/2);
	if (acelMode)
	{
	
		acelX = 2*parseFloat(parseFloat(despX/2)/Math.pow(parseFloat(steps/2), 2));
		acelY = 2*parseFloat(parseFloat(despY/2)/Math.pow(parseFloat(steps/2), 2));
		IncrX = 0;
		IncrY = 0;
	}

	for (i=this.getFPS(); i < time; i+=this.getFPS(), z++)
	{
		if (z >= semiTime)
		{
			IncrX-=acelX;
			IncrY-=acelY;
		}
		else
		{
			IncrX+=acelX;
			IncrY+=acelY;
		}
		if (((iniX < fX) && (acX > fX)) || ((iniX > fX) && (acX < fX))) {
			acX = fX;
		}
		if (((iniY < fY) && (acY > fY)) || ((iniY > fY) && (acY < fY))) {
			acY = fY;
		}
		acX+=IncrX;
		acY+=IncrY;
		this.addTimeout(function(t_x, t_y, t_mode, t_obj) { return function() {
			t_obj.setPosX(t_x);
			t_obj.setPosY(t_y);
			t_obj.refreshPosition(t_mode, true);

		}; }(acX, acY, posMode, this), i, 4);
		
	}
	this.addTimeout(function(t_x, t_y, t_mode, t_obj) { return function() {
			t_obj.setPosX(t_x);
			t_obj.setPosY(t_y);
			t_obj.refreshPosition(t_mode, true);
		}; }(fX, fY, posMode, this), time, 4);
	return 1;
}

/**
* Funcion para mover al elemento 
*
* @param FObject ObjB - Objeto hacia el cual nos deseamos desplazar
* @param integer time - Tiempo que deseamos que dure el desplazamiento
* [Opcional] @param bool - Habilitar o no modo aceleracion 
* [Opcional] @param bool - Refrescar la posicion del objeto
**/
FObject.prototype.moveTo = function(ObjB, time)
{
	var acelMode = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;
	var refreshPosition = (typeof arguments[3] !== 'undefined') ? arguments[3] : false;
	if (refreshPosition)
		ObjB.refreshAbsolutePos();

	var fatherOffset = this.getFatherOffset();
	var toX = ObjB.getPosX(true) - fatherOffset.left;
	var toY = ObjB.getPosY(true) - fatherOffset.top;

	return this.mover(toX, toY, time, false, acelMode);
}
/**
* Funcion para redimensionar el Objeto
*
* @param number fWidth - Width final del objeto deseado - [si es 'keep' significa que tiene que mantener el width original del objeto] [Si se especifica como string tambien puede indicarse como pixels o porcentaje]
* @param number fHeight - Height final del objeto deseado - [si es 'keep' significa que tiene que mantener el height original del objeto] [Si se especifica como string tambien puede indicarse como pixels o porcentaje]
* @param number time - Tiempo de la transición del objeto
* [OPTIONAL] @param bool - Modo en que se debe tratar la redimension [ (D)FALSE: Pixels, TRUE: Porcentaje]
* [OPTIONAL] @param bool - Si el la transicion va a ser acelerada o no [ (D)FALSE: NO, TRUE: SI]
*
* @return number - ID del Timeout
**/
FObject.prototype.resize = function(fWidth, fHeight, time)
{
	var posMode = (typeof arguments[3] !== 'undefined') ? arguments[3] : false;
	var acelMode = (typeof arguments[4] !== 'undefined') ? arguments[4] : false;

	var objWidth, objHeight;
	if (posMode)
	{
		objWidth = this.getWidth(2);
		objHeight = this.getHeight(2);
	} else {
		objWidth = this.getWidth(1);
		objHeight = this.getHeight(1);
	}
	var acWidth = (typeof arguments[5] !== 'undefined') ? arguments[5] : objWidth;
	var acHeight = (typeof arguments[6] !== 'undefined') ? arguments[6] : objHeight;
	var iniHeight = acHeight;
	var iniWidth = acWidth;
	if (!this.obj)
		return;
	time = this.fixTime(time);
	this.clearTimeouts(5);
	var steps = time/this.getFPS();
	var despX = fWidth - acWidth;
	var despY = fHeight - acHeight;
	var IncrX = despX/steps;
	var IncrY = despY/steps;

	var acelX = 0;
	var acelY = 0;
	var i;
	var z=0;
	var semiTime = Math.round(steps/2);
	if (acelMode)
	{
	
		acelX = 2*parseFloat(parseFloat(despX/2)/Math.pow(parseFloat(steps/2), 2));
		acelY = 2*parseFloat(parseFloat(despY/2)/Math.pow(parseFloat(steps/2), 2));
		IncrX = 0;
		IncrY = 0;
	}
	for (i=this.getFPS(); i < time; i+=this.getFPS(), z++)
	{
		if (z >= semiTime)
		{
			IncrX-=acelX;
			IncrY-=acelY;
		}
		else
		{
			IncrX+=acelX;
			IncrY+=acelY;
		}
		if (((iniHeight < fWidth) && (acWidth > fWidth)) || ((iniHeight > fWidth) && (acWidth < fWidth))) {
			acWidth = fWidth;
		}
		if (((iniHeight < fHeight) && (acHeight > fHeight)) || ((iniHeight > fHeight) && (acHeight < fHeight))) {
			acHeight = fHeight;
		}
		acWidth+=IncrX;
		acHeight+=IncrY;
		this.addTimeout(function(t_x, t_y, t_mode, t_obj) { return function() {
			t_obj.setWidth(t_x, t_mode);
			t_obj.setHeight(t_y, t_mode);
			t_obj.setObjSize(false);

		}; }(acWidth, acHeight, posMode, this), i, 5);

	}
	this.addTimeout(function(t_x, t_y, t_mode, t_obj) { return function() {
		t_obj.setWidth(t_x, t_mode);
		t_obj.setHeight(t_y, t_mode);
		t_obj.setObjSize(false);
	}; }(fWidth, fHeight, posMode, this), time, 5);

	return 5;
}

/**
* Funcion para cambiar imagen de fondo
* [OP] @param string - Nueva imagen de fondo para el objeto
* @return void
**/
FObject.prototype.setBackgroundImage = function()
{
	if (!this.obj)
		return;
	if (typeof arguments[0] !== 'undefined')
		this.backgroundImage = arguments[0];
	$(this.obj).css("background-image", "url('" + this.backgroundImage + "')");
	return;
}
/**
* Funcion para cambiar la imagen de fondo usando FImage para 
* acelerar proceso de carga.
*
* [OP] @param string - Nueva imagen de fondo para el objeto
**/
FObject.prototype.smartSetBackgroundImage = function()
{
	if (!this.obj)
		return;	
	var srcImage;
	if (typeof arguments[0] !== 'undefined')
		srcImage = arguments[0];
	else
		srcImage = this.backgroundImage;
	
	var tmpImage = new FImage(srcImage);
	var tmpThis = this;
	tmpImage.load(function(srcData) {
		tmpThis.setBackgroundImage(srcData);
	});
}
//Usar esto UNICAMENTE en objetos Imagenes
FObject.prototype.smartSetImage = function(image)
{
	if (!this.obj)
		return;
	if (this.obj.tagName.toLowerCase() != "img")
		return;
	var tmpImage = new FImage(image);
	var tmpThis = this;
	tmpImage.load(function(srcData) {
		$(tmpThis.obj).attr("src", srcData);
	});
}
//Agregar evento perfect_mouseover, perfect_mouseout

/**
* Funcion para cambiar imagen de fondo con transicion
* @param string NewIMG - Nueva imagen de fondo para el objeto
* @param integer time	- Tiempo de transicion
* [OP] @param integer - Modo de transicion [0 - Default: FadeOut-In simultaneo - 1: FadeOutIN
* separado - 2: Salir uno y entrar otro - 3: Aparece tipo cuadritos - 4: WSP Efecto, 5: ...más y más
* [OP] @param bool - Size mode: TRUE: 100% o FALSE: auto de la dimension de la imagen
* [OP] @param bool - Real Background: TRUE: establece background - FALSE: deja de background el div falso
* @return integer - el codigo de transicion para usar en clearTImeouts y más
**/
FObject.prototype.transBackgroundImage = function(NewImg, time)
{
	/**
	*
	* Agregar modos a esta funcion
	**/
	this.clearTimeouts(3);

	var mode = (typeof arguments[2] !== 'undefined') ? arguments[2] : 0;
	var sizeM = (typeof arguments[3] !== 'undefined') ? arguments[3] : false;
	var backR = (typeof arguments[4] !== 'undefined') ? arguments[4] : true;

	if (tmpBackImgs[this.id].length <= 0)
	{
	tmpBackImgs[this.id][tmpBackImgs[this.id].length] = new FObject(document.createElement("div"));

	$(tmpBackImgs[this.id][0].obj).css("width", "100%");
	$(tmpBackImgs[this.id][0].obj).css("height", "100%");
	$(tmpBackImgs[this.id][0].obj).css("position", "absolute");
	$(tmpBackImgs[this.id][0].obj).css("overflow", "hidden");
	$(tmpBackImgs[this.id][0].obj).css("top", "0");
	$(tmpBackImgs[this.id][0].obj).css("left", "0");
	$(tmpBackImgs[this.id][0].obj).css("zIndex", "-2");

	var tmpImg = document.createElement("img");
	tmpImg.src = NewImg;
	if (sizeM)
	{
		$(tmpImg).css("width", "100%");
		$(tmpImg).css("height", "100%");
	} else {
		$(tmpImg).css("width", "auto");
		$(tmpImg).css("height", "auto");
	}
	$(tmpImg).css("position", "absolute");
	$(tmpImg).css("opacity", "1.0");
	tmpBackImgs[this.id][0].obj.appendChild(tmpImg);


	tmpBackImgs[this.id][tmpBackImgs[this.id].length] = new FObject(tmpBackImgs[this.id][0].obj.cloneNode(false));
	var tmpImgTwo = tmpImg.cloneNode(true);
	$(tmpBackImgs[this.id][1].obj).css("zIndex", "-1");
	tmpImgTwo.src = this.backgroundImage;
	tmpBackImgs[this.id][1].obj.appendChild(tmpImgTwo);

	tmpBackImgs[this.id][0].setOpacity(0.0);
	tmpBackImgs[this.id][1].setOpacity(1.0);
	this.obj.appendChild(tmpBackImgs[this.id][0].obj);
	this.obj.appendChild(tmpBackImgs[this.id][1].obj);

	switch (mode)
	{
		case 2:
			var semiTime = Math.round(time/2);
			//alert("lol");
			//$(this.obj).css('background-image', 'none');
			//tmpBackImgs[this.id][0].refreshPosition(true);
			tmpBackImgs[this.id][0].setPosX(100);
			tmpBackImgs[this.id][0].setPosY(0);
			tmpBackImgs[this.id][0].setOpacity(1.0);
			tmpBackImgs[this.id][0].mover(0, 0, semiTime, true, true);

			//tmpBackImgs[this.id][1].refreshPosition(true);
			tmpBackImgs[this.id][1].setPosX(0);
			tmpBackImgs[this.id][1].setPosY(0);
			tmpBackImgs[this.id][1].setOpacity(1.0);
			tmpBackImgs[this.id][1].mover(-100, 0, semiTime, true, true);
		break;
		case 1:
			var semiTime = Math.round(time/2);
			tmpBackImgs[this.id][1].fadeOut(semiTime);
			$(this.obj).css('background-image', 'none');
			this.addTimeout(function(t_obj, t_img, t_time) { return function () {
				t_img.fadeIn(t_time);
			}; }(this, tmpBackImgs[this.id][0], semiTime), semiTime, 3);
		break;
		default:
			tmpBackImgs[this.id][0].fadeIn(time);
			tmpBackImgs[this.id][1].fadeOut(time);
	}

	} else {
		var acID = tmpBackImgs[this.id].length;
		if (tmpBackImgs[this.id].length > 4)
		{
			acID = Math.floor((Math.random() * 4) + 1);
			tmpBackImgs[this.id][acID].clearTimeouts(0);
			this.obj.removeChild(tmpBackImgs[this.id][acID].obj);
			tmpBackImgs[this.id][acID] = 0;
		}

		tmpBackImgs[this.id][acID] = new FObject(tmpBackImgs[this.id][0].obj.cloneNode(false));

		$(tmpBackImgs[this.id][acID].obj).css("zIndex", "-" +  acID);
		tmpBackImgs[this.id][acID].setOpacity(0.0);

		var tmpImg = document.createElement("img");
		tmpImg.src = NewImg;
		if (sizeM)
		{
			$(tmpImg).css("width", "100%");
			$(tmpImg).css("height", "100%");
		} else {
			$(tmpImg).css("width", "auto");
			$(tmpImg).css("height", "auto");
		}
		$(tmpImg).css("position", "absolute");
		$(tmpImg).css("opacity", "1.0");
		tmpBackImgs[this.id][acID].obj.appendChild(tmpImg);
		this.obj.appendChild(tmpBackImgs[this.id][acID].obj);
		for (var i=0; i < tmpBackImgs[this.id].length; i++)
		{
			if (i==acID)
			{
				switch (mode)
				{
					default:
						tmpBackImgs[this.id][i].fadeIn(time);
				}
			} else {
				switch (mode)
				{
					default:
						tmpBackImgs[this.id][i].fadeOut(time);
				}
			}
		}
	}
	//time = this.fixTime(time);
	
	this.addTimeout(function(t_obj, t_img) { return function() {
		if (tmpBackImgs[t_obj.id].length >= 2)
		{
			$(t_obj.obj).css('background-size', 'auto auto');
			t_obj.setBackgroundImage(t_img);
			for (var i=0; i < tmpBackImgs[t_obj.id].length; i++)
				t_obj.obj.removeChild(tmpBackImgs[t_obj.id][i].obj);
			tmpBackImgs[t_obj.id].length = 0;
		}
	;}; }(this, NewImg), time+this.getFPS(), 3);

	return false;
}

/**
* Funcion para agregar un elemento al actual como hijo
*
*
*/

FObject.prototype.isFather = function(elem)
{
	return (elem.parentNode === this.obj);
}

FObject.prototype.addChild = function(elem)
{
	if (!isElement(elem))
	{
		throw new Error("Solo se pueden pasar elementos HTML como parametro");
		return;
	}
	if (elem.parentNode !== this.obj)
		$(elem).appendTo(this.obj);
}

/**
* Funcion para establecer si el objeto debe seguir al mouse o no (es drageable)
* 
* @param bool enable - TRUE: Habilitar - FALSE: Deshabilitar
* [OP] @param bool - Para especificar si solamente debe ser dagrable cuando se le hace click o siempre debe seguir al mouse
* [OP] @param bool - Especificar dagreable absoluto o relativo al contenedor padre [es decir si sigue al mouse en absoluto o solamente en los limites de su contenedor padre sin salirse jamas (tipo recuadro)]
*
* @return void
**/
FObject.prototype.setDragMode = function(enable)
{


	var mode = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	var limit = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;

	if (!isDrag[this.id] && enable)
	{
		EventUtil.addHandler(this.obj, 'mousedown', dragFunction.call(this, mode, limit));
		EventUtil.addHandler(this.obj, 'touchstart', dragFunction.call(this, mode, limit));
		EventUtil.addHandler(document, 'touchend', dragFunction.call(this, mode, limit));
		EventUtil.addHandler(document, 'mouseup', dragFunction.call(this, mode, limit));
		EventUtil.addHandler(document, 'mousemove', dragFunction.call(this, mode, limit));
		EventUtil.addHandler(document, 'touchmove', dragFunction.call(this, mode, limit));
	}
	if (isDrag[this.id] && !enable)
	{
		EventUtil.removeHandler(this.obj, 'mousedown', dragFunction.call(this, mode, limit));
		EventUtil.removeHandler(this.obj, 'touchstart', dragFunction.call(this, mode, limit));
		EventUtil.removeHandler(document, 'touchend', dragFunction.call(this, mode, limit));
		EventUtil.removeHandler(document, 'mouseup', dragFunction.call(this, mode, limit));
		EventUtil.removeHandler(document, 'mousemove', dragFunction.call(this, mode, limit));
		EventUtil.removeHandler(document, 'touchmove', dragFunction.call(this, mode, limit));
	}
		isDrag[this.id] = enable;
}

FObject.prototype.refreshAbsolutePos = function()
{
	absPos[this.id].getDOMObjPos(this.obj, true);
	absPos[this.id].setZ(0);
}
	
FObject.prototype.init = function()
{
	pos[this.id].getDOMObjPos(this.obj);
	oldPos[this.id].getDOMObjPos(this.obj);
	pos[this.id].setZ(0);
	absPos[this.id].getDOMObjPos(this.obj, true);
	absPos[this.id].setZ(0);
	var Tstyle = 0;
	if (window.getComputedStyle)
	    Tstyle = document.defaultView.getComputedStyle(this.obj,null);
	else if (this.obj.currentStyle)
	    Tstyle = this.obj.currentStyle;

	this.obj.fStyle = Tstyle;
	this.getObjSize(true);
	this.nativeDisplay = $(this.obj).css('display');

}

/**
* Funcion para centrar un objeto en la pantalla
*
* [OP] @param bool - Para determinar si debe centrar respecto a la ventana absoluta o a su padre. - TRUE: Ventana absoluta - FALSE [D]: Respecto a su padre
* [OP] @param bool - TRUE: Centra automaticamente con cada redimension FALSE [D]: SI se redimenciona la pantalla no se centra
*
**/

FObject.prototype.center = function()
{
	var mode = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	var autorefresh = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	var father = this.obj.parentNode;
	var WidthSize = 0;
	var HeightSize = 0;
	this.getObjSize(true);

	if (mode)
	{
		HeightSize = Ventana.getHeight();
		WidthSize = Ventana.getWidth();
	} else {
		if (father == null || father === document.body)
		{
			HeightSize = Ventana.getHeight();
			WidthSize = Ventana.getWidth();
		} else {
			HeightSize = $(father).innerHeight();
			WidthSize = $(father).innerWidth();
		}
	}
	var mLeft = -Math.round(this.getWidth(1)/2);
	var mTop = -Math.round(this.getHeight(1)/2);
	$(this.obj).css("top", "50%");
	$(this.obj).css("left", "50%");
	$(this.obj).css("margin-left", mLeft + "px");
	$(this.obj).css("margin-top", mTop + "px");

	if (autorefresh)
		EventUtil.addHandler(window, "resize", autoRefreshCenter.call(this, mode));
}

/**
* Funcion para obtener hijos en modo CSS (con selectores clasicos de CSS)
*
* @param string regla - La regla de selectores de CSS a utilizar
*
**/

//Terminar

FObject.prototype.getChildsCSS = function(regla)
{
	if (!this.obj)
		return false;
	regla = regla.replace(/ /g, '');
	var elems = regla.split(">");
	var elemArray = new Array();
	for (var i=0; i < elems.length; i++)
	{
		if (elems[i].length <= 0)
			break;
		elemArray[elemArray.length] = new Array(3);
		elemArray[elemArray.length-1]['id'] = 0;
		elemArray[elemArray.length-1]['tag'] = 0;
		elemArray[elemArray.length-1]['class'] = 0;
		elemArray[elemArray.length-1]['child'] = true;
		//Obtengo la clase, id y tag del elemento
		var cPos = elems[i].indexOf(".");
		var idPos = elems[i].indexOf("#");
		var endPos = 0;
		if (elems[i].charAt(0) != "#" && elems[i].charAt(0) != ".")
		{
			if (idPos == -1 || cPos == -1)
				endPos = Math.max(cPos, idPos);
			else
				endPos = Math.min(cPos, idPos);
			if (endPos == -1)
				endPos = elems[i].length;
			elemArray[elemArray.length-1]['tag'] = elems[i].slice(0, endPos).toLowerCase();
		}
		if (cPos != -1)
		{
			endPos = (idPos > cPos) ? idPos : elems[i].length;
			if ((cPos+1) < endPos)
			{
				elemArray[elemArray.length-1]['class'] = elems[i].slice(cPos+1, endPos).toLowerCase();
			}
		}
		if (idPos != -1)
		{
			endPos = (cPos > idPos) ? cPos : elems[i].length;
			if ((idPos+1) < endPos)
			{
				elemArray[elemArray.length-1]['id'] = elems[i].slice(idPos+1, endPos).toLowerCase();
			}
		}
	}

	//Terminar aca que esta la papusa
	var AElems = new Array();
	var childs = 0;
	var ASearch = new Array();
	ASearch.push(this.obj);
	var z=0;
	for (var i=0; i < elemArray.length; i++)
	{

		var tmpArray = new Array();
		for (var k=0; k < ASearch.length; k++)
		{
			childs = ASearch[k].childNodes;
			for (var j=0; j < childs.length; j++)
			{
				//alert(childs[j].nodeType);
				if (childs[j].nodeType != 1)
					continue;
				if (elemArray[i]['id'] && !(childs[j].hasAttribute("id") && childs[j].getAttribute("id").toLowerCase() == elemArray[i]['id']))	continue;
				if (elemArray[i]['tag'] && childs[j].tagName.toLowerCase() != elemArray[i]['tag']) continue;
				if (elemArray[i]['class'] && !(childs[j].hasAttribute("class") && childs[j].getAttribute("class").toLowerCase() == elemArray[i]['class'])) continue;

				if (i == elemArray.length-1)
				{
					AElems[AElems.length] = new FObject(childs[j]);
				} else {
					tmpArray.push(childs[j]);
				}
			}
		}
		ASearch.length = 0;
		ASearch = tmpArray.slice();
	}

	return AElems;
}

})();

//FGalery (empieza la papusa e.e)
/** 
* Clase FGalery
* - Propiedades
* @prop integer acImage - Imagen actual que se reproduce en la galeria
* @prop FObject galery - Objeto FObject de la galeria
* @prop integer id - id de galeria actual
* @prop [Array de FObject] divElems - Los elementos div de cada una de las imagenes de la galeria (Fobject cada uno)
* @prop integer tMode - Tipo de transición de cada clase. [0: Modo comun desvanecer y aparecer - 1: Aparecer por izquierda - 2: Aparecer por derecha - 3: Tipo rollo de papel - 4: Tipo WSP - 5: Zoom + Desvanecer - 6: Partirse en pedacitos
* @prop integer time - Tiempo que dura cada imagen en pantalla
* @prop integer transTime - Tiempo que dura cada transición
* @prop bool waitLoad - Para especificar si se debe esperar o no a que carguen las imagenes para reproducir
* @prop bool touchEnable - Para determinar si se puede o no cambiar de imagen en un movil con funciones touch
**/
(function() {
var images = new Array();
var oldImage = new Array();
var playing = new Array();
var paused = new Array();
var touchStartPos = new Array();
var touchEndPos = new Array();
var touchIniPos = new Array();
var IniScrollPos = new Array();
var beingTouched = new Array();

var thisClassName = "FGalery"; //IMPORTANTISIMO!!!

FGalery = function(tObj, imgArray)
{
	FMain.call(this);
	this.touchEnable = true;
	this.time = 3000;
	this.transTime = 350;
	this.touchScroll = false;
	this.acImage = 0;
	this.tMode = 0;
	this.galery = new FObject(tObj);
	this.id = images.length;
	IniScrollPos[IniScrollPos.length] = new FCoord(0, 0);
	touchIniPos[touchIniPos.length] = new FCoord(0, 0);
	beingTouched[beingTouched.length] = false;
	touchStartPos[touchStartPos.length] = new FCoord(0,0);
	touchEndPos[touchEndPos.length] = new FCoord(0,0);
	paused[paused.length] = false;
	playing[playing.length] = false;
	images[images.length] = new Array();
	oldImage[oldImage.length] = 0;
	this.divElems = new Array();
	this.waitLoad = false;
	this.init(imgArray);
}
fHeredarProto(FMain, FGalery);

//Funciones privadas
function pauseAllDivs()
{
	var i;
	for (i=0, len=this.divElems.length; i < len; i++)
		this.divElems[i].pauseAll();
}

function playAllDivs()
{
	var i;
	for (i=0, len=this.divElems.length; i < len; i++)
		this.divElems[i].resumeAll();
}
function fixZIndexValues()
{
	var acValue = (typeof arguments[0] !== 'undefined') ? arguments[0] : this.acImage;
	acValue = this.normalizeImageNumber(acValue);
	var oldImage = this.normalizeImageNumber(acValue-1);
	var nextImage = this.normalizeImageNumber(acValue+1);

	$(this.divElems[acValue].obj).css('z-index', -1);
	if (oldImage != acValue)
		$(this.divElems[oldImage].obj).css('z-index', ((-2) - oldImage));
	if (nextImage != acValue)
		$(this.divElems[nextImage].obj).css('z-index', ((-2) - nextImage));
}
function touchEvents()
{
	var tmpThis = this;
	return function(event)
	{
		if (!tmpThis.touchEnable)
			return;
		if (tmpThis.isPlaying())
			return;
		event = EventUtil.getEvent(event);

		var oldImage = tmpThis.normalizeImageNumber(tmpThis.acImage-1);
		var nextImage = tmpThis.normalizeImageNumber(tmpThis.acImage+1);

		switch (event.type)
		{
			case 'mousedown':
			case 'touchstart':
				if (beingTouched[tmpThis.id])
					break;
				if ((tmpThis.tMode == 3 || tmpThis.tMode == 4) && !tmpThis.galery.contenedor)
					return;

				beingTouched[tmpThis.id] = true;
				tmpThis.clearTimeouts(3);
				tmpThis.pauseGalery();
				IniScrollPos[tmpThis.id].setY(Ventana.getScrollY());
				if (event.type == 'touchstart') {
				touchStartPos[tmpThis.id].setX(parseInt(event.touches[0].clientX));
				touchStartPos[tmpThis.id].setY(parseInt(event.touches[0].clientY));
				touchEndPos[tmpThis.id].setX(parseInt(event.touches[0].clientX));
				touchEndPos[tmpThis.id].setY(parseInt(event.touches[0].clientY));
				} else {
				touchStartPos[tmpThis.id].setX(parseInt(event.clientX));
				touchStartPos[tmpThis.id].setY(parseInt(event.clientY));
				touchEndPos[tmpThis.id].setX(parseInt(event.clientX));
				touchEndPos[tmpThis.id].setY(parseInt(event.clientY));
				}

				switch (tmpThis.tMode)
				{
					case 3:
					case 4:
						tmpThis.galery.contenedor.clearTimeouts(4);
						var acStartX = touchStartPos[tmpThis.id].getX();
						var contX = tmpThis.galery.contenedor.getPosX(false, 1);
						touchStartPos[tmpThis.id].setX(acStartX - contX);
						touchIniPos[tmpThis.id].setX(contX);
					break;
					default:
						fixZIndexValues.call(tmpThis);
						tmpThis.divElems[oldImage].setOpacity(1.0);
						tmpThis.divElems[nextImage].setOpacity(1.0);
						tmpThis.divElems[nextImage].setPosX(0);
						tmpThis.divElems[nextImage].setPosY(0);
						tmpThis.divElems[nextImage].refreshPosition();
						tmpThis.divElems[oldImage].setPosX(0);
						tmpThis.divElems[oldImage].setPosY(0);
						tmpThis.divElems[oldImage].refreshPosition();
						$(tmpThis.divElems[oldImage].obj).css('display', 'block');
						$(tmpThis.divElems[nextImage].obj).css('display', 'block');
					break;
				}

			break;
			case 'mouseup':
			case 'touchend':
				if (!beingTouched[tmpThis.id])
					break;
				beingTouched[tmpThis.id] = false;
				var maxSize = Math.round(tmpThis.galery.getWidth(1)/2);
				despX = touchEndPos[tmpThis.id].getX() - touchStartPos[tmpThis.id].getX();
				switch (tmpThis.tMode)
				{
					case 3:
					case 4:
						despX -= touchIniPos[tmpThis.id].getX();
					break;
				}
				if (despX < 0 && Math.abs(despX) >= maxSize)
				{
					tmpThis.setPlaying(false);
					paused[tmpThis.id] = false;
					switch (tmpThis.tMode)
					{
						case 4:
						case 2:
							tmpThis.previous(true);
						break;

						default:
						case 3:
						case 1:
							tmpThis.next(true);
						break;
					}
				} else if (despX > 0 && Math.abs(despX) >= maxSize) {
					tmpThis.setPlaying(false);
					paused[tmpThis.id] = false;
					switch (tmpThis.tMode)
					{
						case 4:
						case 2:
							tmpThis.next(true);
						break;

						default:
						case 3:
						case 1:
							tmpThis.previous(true);
						break;
					}
				} else {
				switch (tmpThis.tMode)
				{
					case 3:
					case 4:
						tmpThis.galery.contenedor.mover(-100, 0, 250, true, true);
					break;
					case 0:
					if (tmpThis.acImage != oldImage)
						tmpThis.divElems[oldImage].fadeOut(250);
					if (tmpThis.acImage != nextImage)
						tmpThis.divElems[oldImage].fadeOut(250);
					tmpThis.divElems[tmpThis.acImage].fadeIn(250);
					break;
					case 2:
					case 1:
						tmpThis.divElems[tmpThis.acImage].mover(0, 0, 250, false, true);
					break;
				}
				tmpThis.addTimeout(function(tThis, old, next) { return function() {
					switch (tThis.tMode)
					{
						case 3:
						case 4:

						break;
						default:
						$(tThis.divElems[old].obj).css('display', 'none');
						$(tThis.divElems[next].obj).css('display', 'none');
						break;
					}
					tThis.playGalery();
				}; }(tmpThis, oldImage, nextImage), 250, 3);
				}
			break;
			case 'mousemove':
			case 'touchmove':
				if (!beingTouched[tmpThis.id])
					break;
				var maxSize = Math.round(tmpThis.galery.getWidth(1)/2);
				if (event.type == 'touchmove') {
				touchEndPos[tmpThis.id].setX(parseInt(event.changedTouches[0].clientX));
				touchEndPos[tmpThis.id].setY(parseInt(event.changedTouches[0].clientY));
				} else {
				touchEndPos[tmpThis.id].setX(parseInt(event.clientX));
				touchEndPos[tmpThis.id].setY(parseInt(event.clientY));
				}
				var xPos = touchEndPos[tmpThis.id].getX() - touchStartPos[tmpThis.id].getX();
				if (tmpThis.touchScroll)
				{
					var yDesp = touchEndPos[tmpThis.id].getY() - touchStartPos[tmpThis.id].getY();
					yDesp = IniScrollPos[tmpThis.id].getY() - yDesp;
					$(window).scrollTop(yDesp)
				}
				switch (tmpThis.tMode)
				{
					case 0:
						var newOpac = Math.abs(xPos/maxSize);
						if (newOpac > 1.0)
							newOpac = 1.0;
						if (xPos > 0)
						{
							$(tmpThis.divElems[nextImage].obj).css('display', 'none');
							$(tmpThis.divElems[oldImage].obj).css('display', 'block');
							newOpac = 1.0 - newOpac;
							tmpThis.divElems[tmpThis.acImage].setOpacity(newOpac);					
						} else {
							$(tmpThis.divElems[oldImage].obj).css('display', 'none');
							$(tmpThis.divElems[nextImage].obj).css('display', 'block');
							newOpac = 1.0 - newOpac;
							tmpThis.divElems[tmpThis.acImage].setOpacity(newOpac);
						}
					break;
					case 1:
						if (xPos > 0)
						{
							$(tmpThis.divElems[nextImage].obj).css('display', 'none');
							$(tmpThis.divElems[oldImage].obj).css('display', 'block');
						} else {
							$(tmpThis.divElems[oldImage].obj).css('display', 'none');
							$(tmpThis.divElems[nextImage].obj).css('display', 'block');
						}
					case 2:
						if (xPos > 0)
						{
							$(tmpThis.divElems[oldImage].obj).css('display', 'none');
							$(tmpThis.divElems[nextImage].obj).css('display', 'block');
						} else {
							$(tmpThis.divElems[nextImage].obj).css('display', 'none');
							$(tmpThis.divElems[oldImage].obj).css('display', 'block');
						}
					case 1:
					case 2:
						tmpThis.divElems[tmpThis.acImage].setPosX(xPos, 3);
						tmpThis.divElems[tmpThis.acImage].refreshPosition();
					break;
					case 3:
					case 4:
						if (!tmpThis.galery.contenedor)
							break;
						tmpThis.galery.contenedor.setPosX(xPos, 3);
						tmpThis.galery.contenedor.refreshPosition();
					break;
				}
			break;
		}
		EventUtil.preventDefault(event);
	};
}

FGalery.prototype.getClassTypeName = function()
{
	return thisClassName;
}

//Funciones publicas
FGalery.prototype.normalizeImageNumber = function(n)
{
	if (n < 0) {
		n = images[this.id].length-1;
	} else if (n >= images[this.id].length) {
		n = 0;
	}
	return n;
}
FGalery.prototype.setPlaying = function(mode)
{
	playing[this.id] = mode;
}
FGalery.prototype.isPlaying = function()
{
	return playing[this.id];
}
FGalery.prototype.getImage = function(id)
{
	if (id >= images[this.id].length)
		return -1;
	if (id < 0)
		return -1;
	return images[this.id][id];
}
FGalery.prototype.maxImages = function()
{
	return images[this.id].length;
}
/**
* Funcion para cambiar ACImage y normalizarlo
*
* @param integer newImage - Numero de la nueva image
* [OP] @param bool - Para cambiar o no oldImage [False: no cambia oldIMage - (D) TRUE: Cambia oldImage]
**/
FGalery.prototype.setAcImage = function(newImage)
{
	var changeOld = (typeof arguments[1] !== 'undefined') ? arguments[1] : true;
	if (changeOld)
		oldImage[this.id] = this.acImage;
	this.acImage = newImage;
	if (this.acImage < 0)
		this.acImage = images[this.id].length-1;
	if (this.acImage >= images[this.id].length)
		this.acImage = 0;
}
FGalery.prototype.getOldImage = function()
{
	return oldImage[this.id];
}
/**
* Funcion que se usa para normalizar los Divs en las transiciones
* unicamente para no copiar y pegar codigo e.e
**/
FGalery.prototype.normalizeStartPlaying = function()
{
	this.setPlaying(true);
	var oldImage = this.getOldImage();
	var acImage = this.acImage;
	for (var i=0; i < this.maxImages(); i++)
	{
		if (i != oldImage){
			var nZindex = (-2) - i;
			$(this.divElems[i].obj).css('z-index', nZindex);
		}
		if (i == acImage || i == oldImage)
			continue;
		this.divElems[i].setOpacity(0.0);
		$(this.divElems[i].obj).css('display', 'none');
		this.divElems[i].setPosY(0);
		this.divElems[i].setPosX(0);
		this.divElems[i].refreshPosition();
	}
}
FGalery.prototype.normalizeEndPlaying = function()
{
	this.setPlaying(false);
	var oldImage = this.getOldImage();
	var acImage = this.acImage;

	$(this.divElems[oldImage].obj).css('display', 'none');
	var nZindex = (-2) - tOld;
	$(this.divElems[oldImage].obj).css('z-index', nZindex);
	$(this.divElems[acImage].obj).css('z-index', -1);
}
/**
*  Funcion para normalizar las imagenes de contenedor
* Otra funcion que existe para reducir codigo en .play
**/
FGalery.prototype.normalizeContenedor = function(previousMode)
{
	//this.createContenedor();
	var acImage = this.acImage;
	var oldImage = this.normalizeImageNumber(acImage-1);
	var nextImage = this.normalizeImageNumber(acImage+1);
	var i, j;
	var condImages;
	switch (this.tMode)
	{
		case 3:
			condImages = new Array(oldImage, acImage, nextImage);
		break;
		case 4:
			condImages = new Array(nextImage, acImage, oldImage);
		break;
	}
	var maxImages = this.maxImages();
	var test=0;

	for (i=0; i < this.galery.contenedor.elems.length; i++)
	{
		for (j=0; j < this.galery.contenedor.elems[i].elems.length; j++)
		{

			if (j == condImages[i])
			{
				$(this.galery.contenedor.elems[i].elems[j].obj).css('display', 'block');
			} else {
				$(this.galery.contenedor.elems[i].elems[j].obj).css('display', 'none');
			}
		}
	}
	//alert($(this.galery.obj).css('display'));
	
	this.galery.contenedor.setPosX(-100);
	this.galery.contenedor.refreshPosition();

	//alert($(this.galery.contenedor.obj).forcePosition().left);

}
/**
* Funcion para crear el contenedor que tiene a los elementos en modo 3 (modo rollo de papel)
* Existe unicamente para reducir codigo
**/
FGalery.prototype.createContenedor = function()
{
	if ((typeof this.galery.contenedor === 'undefined') || !this.galery.contenedor)
	{
	var i, j;
	var oldImage = this.getOldImage();
	var acImage = this.acImage;
	var prevImage = this.normalizeImageNumber(oldImage-1);
	var tmpObj = document.createElement("div");
	$(tmpObj).css('position', 'absolute');
	$(tmpObj).css('height', '100%');
	$(tmpObj).css('top', '0');
	$(tmpObj).css('background', 'none');
	$(tmpObj).css('overflow', 'hidden');
	$(tmpObj).css('left', "-33.33%");
	$(tmpObj).css('width', "300%");
	var condImages;
	switch (this.tMode)
	{
		case 3:
			condImages = new Array(prevImage, oldImage, acImage);
		break;
		case 4:
			condImages = new Array(acImage, oldImage, prevImage);
		break;
	}

	var childPos = new Array(0.0, 33.33, 66.66);
	for (j=0; j < this.maxImages(); j++)
		$(this.divElems[j].obj).css('display', 'none');

	for (i=0; i < 3; i++)
	{
		var tmpFather = document.createElement("div");
		$(tmpFather).css('position', 'absolute');
		$(tmpFather).css('display', 'block');
		$(tmpFather).css('width', '33.33%');
		$(tmpFather).css('height', '100%');
		$(tmpFather).css('overflow', 'hidden');
		$(tmpFather).css('top', 0);
		$(tmpFather).css('left', childPos[i] + '%');
		$(tmpFather).css('background', 'none');
		for (j=0; j < this.maxImages(); j++)
		{
			var tmpChild = document.createElement("div");
			$(tmpChild).css('position', 'absolute');
			$(tmpChild).css('top', '0');
			$(tmpChild).css('height', '100%');
			$(tmpChild).css('width', '100%');
			$(tmpChild).css('background-color', '#fafafa');
			$(tmpChild).css('background-repeat', 'no-repeat');
			$(tmpChild).css('background-size', '100% auto');
			$(tmpChild).css('overflow', 'hidden');
			$(tmpChild).css('left', '0');
			var nZindex = (-2) - j;
			$(tmpChild).css('opacity', '1.0');
			$(tmpChild).css('visibility', 'visible');
			if (j==condImages[i])
			{
				$(tmpChild).css('display', 'block');
				$(tmpChild).css('z-index', -1);
			} else {
				$(tmpChild).css('z-index', nZindex);
			}
			tmpFather.appendChild(tmpChild);
		}
		tmpObj.appendChild(tmpFather);
	}
	$(tmpObj).css('z-index', '-1');
	this.galery.obj.appendChild(tmpObj);
	this.galery.contenedor = new FObject(tmpObj);
	this.galery.contenedor.elems = this.galery.contenedor.getChildsCSS("div");
	for (i=0; i < this.galery.contenedor.elems.length; i++)
	{
		this.galery.contenedor.elems[i].elems = this.galery.contenedor.elems[i].getChildsCSS("div");
		for (j=0; j < this.galery.contenedor.elems[i].elems.length; j++)
		{
			this.galery.contenedor.elems[i].elems[j].setOpacity(1.0);
			this.galery.contenedor.elems[i].elems[j].elems =  this.galery.contenedor.elems[i].elems[j].getChildsCSS("div");
		}
	}
	for (j=0; j < this.maxImages(); j++)
	{
		var tmpImage = new FImage(images[this.id][j]);

		tmpImage.load(function(tObj, idImage) { return function(srcImage, id) {
	var i, j;
		var CurrentElem = new Array();
		for (i=0; i < tObj.elems.length; i++)
		{
			for (j=0; j < tObj.elems[i].elems.length; j++)
			{
				if (j != idImage)
					continue;
				CurrentElem.push(tObj.elems[i].elems[j]);
			}
		}
		if (CurrentElem.length <= 0)
			return;
		switch (id)
		{
			case 0:
				for (i=0; i < CurrentElem.length; i++)
				{
				if (!CurrentElem[i].elems[id].obj == null)
					break;
				CurrentElem[i].elems[id].setBackgroundImage(srcImage);
				$(CurrentElem[i].elems[id].obj).css('display', 'block');
				}
			break;
			case 1:
				for (i=0; i < CurrentElem.length; i++)
				{
				if (!CurrentElem[i].elems[id].obj == null)
					break;
				CurrentElem[i].elems[id].setBackgroundImage(srcImage);
				$(CurrentElem[i].elems[id].obj).css('display', 'block');
				CurrentElem[i].addTimeout(function(ttObj) { return function() {
				if (ttObj.elems[0] !== 'undefined')
				{
					ttObj.obj.removeChild(ttObj.elems[0].obj);
					ttObj.elems[0].obj = null;
				}
				}; }(CurrentElem[i]), 100, 25);
				}
			break;
			case 2:
				for (i=0; i < CurrentElem.length; i++)
				{
				CurrentElem[i].setBackgroundImage(srcImage);
				setTimeout(function(ttObj) { return function() {
					ttObj.clearTimeouts(25);
					var i=0;
					for (i=0; i < ttObj.elems.length; i++)
					{
						if (ttObj.elems[i].obj === null)
							continue;
						ttObj.obj.removeChild(ttObj.elems[i].obj);
					}
					ttObj.elems.length = 0;
				}; }(CurrentElem[i]), 100);
				}
			break;
		}
		}; }(this.galery.contenedor, j));
	}
	}
}
/*Seguir trabajando con FGalery y despues empezar ya de lleno con la pagina de Firetech (de ultima vas a usar
una version modificada especial de FBase para la pagina y fue. Ver tambien que pasa que en el celular
anda inestable*/
/**
* Funcion para reproducir la galeria
* 
* [OP] @param bool - Para no forzar AcImage [FALSE: (D) AcImage se fuerza (ejemplo a ser opac0.0 y block) - TRUE: AcImage no se fuerza, se deja con los datos que tenia antes]
* [OP] @param bool - Para no cambiar oldImage [FALSE: No Cambia oldImage - (D) TRUE: Cambia oldImage]
* [OP] @param bool - Para especificar si se llego con previous [(D) FALSE: Normal - TRUE: Se llego con previous]
**/
FGalery.prototype.playGalery = function()
{
	var forceAcImage = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	var changeOld = (typeof arguments[1] !== 'undefined') ? arguments[1] : true;
	var previousMode = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;
	if (this.waitLoad)
		return;
	if (paused[this.id])
	{
		this.resume(0);
		this.resume(1);
		this.resume(2);
		playAllDivs.call(this);
		paused[this.id] = false;
		return;
	}
	this.clearTimeouts(0);
	this.clearTimeouts(1);
	this.setAcImage(this.acImage+1, changeOld);
	var acTime = 0;

	switch (this.tMode)
	{
		//Transicion de desvanecer y aparecer
		case 0:
			acTime += this.getFPS();
			this.addTimeout(function(tmpThis, tImage, tForce) { return function()
			{
				tmpThis.normalizeStartPlaying();

				var oldImage = tmpThis.getOldImage();
				var acImage = tmpThis.acImage;
				if (!tForce) {
					tmpThis.divElems[acImage].setOpacity(1.0);
					$(tmpThis.divElems[acImage].obj).css('display', 'block');
				}
				$(tmpThis.divElems[oldImage].obj).css('z-index', -1);
				$(tmpThis.divElems[acImage].obj).css('z-index', -2);
				tmpThis.divElems[oldImage].fadeOut(tmpThis.transTime);

				tmpThis.addTimeout(function(tThis, tOld, tAc) { return function()
				{
					tThis.normalizeEndPlaying();
				}; }(tmpThis, oldImage, acImage), tmpThis.transTime+tmpThis.getFPS(), 1);
			}; }(this, images[this.id][this.acImage], forceAcImage), acTime, 1);
		break;
		//Transicion de aparecer por la izquierda
		case 2:
		case 1:
			acTime += this.getFPS();
			this.addTimeout(function(tmpThis, tImage, tForce) { return function()
			{
				tmpThis.normalizeStartPlaying();

				var oldImage = tmpThis.getOldImage();
				var acImage = tmpThis.acImage;
				if (!tForce) {
					tmpThis.divElems[acImage].setOpacity(1.0);
					tmpThis.divElems[acImage].setPosY(0);
					switch (tmpThis.tMode)
					{
						case 1:
							tmpThis.divElems[acImage].setPosX(100, 4);
						break;
						case 2:
							tmpThis.divElems[acImage].setPosX(-100, 4);
						break;
					}
					tmpThis.divElems[acImage].refreshPosition();
					$(tmpThis.divElems[acImage].obj).css('display', 'block');
					$(tmpThis.divElems[acImage].obj).css('z-index', -1);
					$(tmpThis.divElems[oldImage].obj).css('z-index', -2);
					tmpThis.divElems[acImage].mover(0, 0, tmpThis.transTime, true, true);
				} else {
					$(tmpThis.divElems[acImage].obj).css('z-index', -2);
					$(tmpThis.divElems[oldImage].obj).css('z-index', -1);
					var xPos = tmpThis.divElems[oldImage].getPosX(false, 2);
					if (xPos <= 50) {
						xPos += 100;
						var newTime = Math.abs(Math.round((xPos/50)*tmpThis.transTime)) + tmpThis.getFPS();
						tmpThis.divElems[oldImage].mover(-100, 0, newTime, true, true);
					} else {
						var newTime =  Math.abs(Math.round(((100-xPos)/50)*tmpThis.transTime)) + tmpThis.getFPS();
						tmpThis.divElems[oldImage].mover(100, 0, newTime, true, true);
					}
				}
				tmpThis.addTimeout(function(tThis, tOld) { return function() 
				{
					tThis.normalizeEndPlaying();
				}; }(tmpThis, oldImage), tmpThis.transTime+tmpThis.getFPS(), 1);
			}; }(this, images[this.id][this.acImage], forceAcImage), acTime, 1);
		break;

		//Modo rollo de papel higienico
		case 3:
		case 4:
			this.createContenedor();
			acTime += this.getFPS();
			this.addTimeout(function(tmpThis, tImage, tForce) { return function()
			{
				tmpThis.setPlaying(true);
				var oldImage = tmpThis.getOldImage();
				var acImage = tmpThis.acImage;
				if (!tForce) {
					tmpThis.galery.contenedor.setOpacity(1.0);
					$(tmpThis.galery.contenedor.obj).css('display', 'block');
				}
				switch (tmpThis.tMode)
				{
					case 3:
						if (previousMode)
						{
							tmpThis.galery.contenedor.mover(0, 0, tmpThis.transTime, true, true);
						} else {
							tmpThis.galery.contenedor.mover(-200, 0, tmpThis.transTime, true, true);
						}
					break;
					case 4:
						if (previousMode)
						{
							tmpThis.galery.contenedor.mover(-200, 0, tmpThis.transTime, true, true);
						} else {
							tmpThis.galery.contenedor.mover(0, 0, tmpThis.transTime, true, true);
						}
					break;
				}
				
				tmpThis.addTimeout(function(tThis, tOld, tAc) { return function()
				{
					tThis.setPlaying(false);
					tThis.normalizeContenedor(previousMode);
				}; }(tmpThis, oldImage, acImage), tmpThis.transTime+tmpThis.getFPS(), 1);
			}; }(this, images[this.id][this.acImage], forceAcImage), acTime, 1);
			
		break;
	}
	acTime += this.time;
	this.addTimeout(function(tthis) { return function() {
		tthis.playGalery();
	}; }(this), acTime, 0);
}
FGalery.prototype.pauseGalery = function()
{
	this.pause(0);
	this.pause(1);
	this.pause(2);
	pauseAllDivs.call(this);
	paused[this.id] = true;
}

/**
* Funcion para ir a la imagen anterior
* 
* [OP] @param bool - Para no forzar AcImage [FALSE: AcImage se fuerza (ejemplo a ser opac0.0 y block) - TRUE: AcImage no se fuerza, se deja con los datos que tenia antes]
**/
FGalery.prototype.previous = function()
{
	var forceAcImage = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (!this.isPlaying())
	{
		this.clearTimeouts(2);
		this.clearTimeouts(0);
		this.clearTimeouts(1);
		
		if (this.acImage == 0)
			this.setAcImage(images[this.id].length-2);
		else
			this.setAcImage(this.acImage-2);
		this.playGalery(forceAcImage, false, true);
	} else {
		this.clearTimeouts(2);
		this.addTimeout(function(tmpThis, tForce) { return function() {
			tmpThis.previous(tForce);
		}; }(this, forceAcImage), this.transTime+this.getFPS(), 2);
	}
}
/**
* Funcion para ir a la imagen siguiente
* 
* [OP] @param bool - Para no forzar AcImage [FALSE: AcImage se fuerza (ejemplo a ser opac0.0 y block) - TRUE: AcImage no se fuerza, se deja con los datos que tenia antes]
**/
FGalery.prototype.next = function()
{
	var forceAcImage = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (!this.isPlaying())
	{
		this.clearTimeouts(2);
		this.clearTimeouts(0);
		this.clearTimeouts(1);
		this.playGalery(forceAcImage);
	} else {
		this.clearTimeouts(2);
		this.addTimeout(function(tmpThis, tForce) { return function() {
			tmpThis.next(tForce);
		}; }(this, forceAcImage), this.transTime+this.getFPS(), 2);
	}
}

FGalery.prototype.init = function(imgArray)
{
	if (!this.galery.obj)
		return;
	if (!isArray(imgArray))
		return;
	var i, j;
	if ($(this.galery.obj).css('position') == 'static')
		$(this.galery.obj).css('position', 'relative') 
	for (i=0; i < imgArray.length; i++)
		images[this.id].push(imgArray[i]);
	for (i=0; i < images[this.id].length; i++)
	{
		var tmpObj = document.createElement("div");
		$(tmpObj).css('position', 'absolute');
		$(tmpObj).css('width', '100%');
		$(tmpObj).css('height', '100%');
		$(tmpObj).css('top', '0');
		$(tmpObj).css('left', '0');
		$(tmpObj).css('background-repeat', 'no-repeat');
		$(tmpObj).css('background-size', '100% auto');
		$(tmpObj).css('overflow', 'hidden');
		for (j=0; j < 3; j++)
		{
			var tmpChild = tmpObj.cloneNode();
			$(tmpChild).css('display', 'none');
			$(tmpChild).css('overflow', 'hidden');
			tmpObj.appendChild(tmpChild);
		}
		$(tmpObj).css('visibility', 'hidden');
		var nZindex = (-2) - i;
		$(tmpObj).css('z-index', nZindex);
		var tmpId = this.divElems.length;
		this.divElems[tmpId] = new FObject(tmpObj);
		
		this.divElems[tmpId].elems = this.divElems[tmpId].getChildsCSS("div");
		var tmpFObject = this.divElems[tmpId];

		//Todo esto para la mejora de carga de imagenes, aumentando efectividad en la carga
		var tmpImage = new FImage(images[this.id][i]);

		tmpImage.load(function(tObj) { return function(srcImage, id) {
			switch (id)
			{
				case 0:
					tObj.elems[id].setBackgroundImage(srcImage);
					$(tObj.elems[id].obj).css('display', 'block');
				break;
				case 1:
					tObj.elems[id].setBackgroundImage(srcImage);
					$(tObj.elems[id].obj).css('display', 'block');
					tObj.addTimeout(function(ttObj) { return function() {
						if (ttObj.elems[0] !== 'undefined')
						{
							ttObj.obj.removeChild(ttObj.elems[0].obj);
							ttObj.elems[0].obj = null;
						}
					}; }(tObj), 100, 25);
				break;
				case 2:
					tObj.setBackgroundImage(srcImage);
					setTimeout(function(ttObj) { return function() {
						ttObj.clearTimeouts(25);
						var i=0;
						for (i=0; i < ttObj.elems.length; i++)
						{
							if (ttObj.elems[i].obj === null)
								continue;
							ttObj.obj.removeChild(ttObj.elems[i].obj);
						}
						ttObj.elems.length = 0;
					}; }(tObj), 100);
				break;
			}
		}; }(this.divElems[tmpId]));
		//Fin de la mejora de carga

		$(this.galery.obj).css('overflow', 'hidden');
		this.galery.obj.appendChild(this.divElems[tmpId].obj);
		this.divElems[tmpId].init();


		if (this.acImage != i)
		{
			$(this.divElems[tmpId].obj).css('display', 'none');
		}
		$(this.divElems[tmpId].obj).css('visibility', 'visible');
	}
	//Agregando eventos a la galeria
	EventUtil.addHandler(this.galery.obj, 'touchstart', touchEvents.call(this));
	EventUtil.addHandler(this.galery.obj, 'touchmove', touchEvents.call(this));
	EventUtil.addHandler(this.galery.obj, 'touchend', touchEvents.call(this));
	EventUtil.addHandler(this.galery.obj, 'mousemove', touchEvents.call(this));
	EventUtil.addHandler(this.galery.obj, 'mousedown', touchEvents.call(this));
	EventUtil.addHandler(this.galery.obj, 'mouseup', touchEvents.call(this));
	oldImage[this.id] = this.normalizeImageNumber(this.acImage-1);
	this.addTimeout(function(tthis) { return function() {
		tthis.playGalery();
	}; }(this), this.time, 0);
}
})();

(function()
{

var thisClassName = "FDebug"; //IMPORTANTISIMO!!!


FDebug = function()
{
		FMain.call(this);
		this.obj = document.createElement("div");
		this.enabled = true;
		this.init();
}

fHeredarProto(FMain, FDebug);

FDebug.prototype.getClassTypeName = function()
{
	return thisClassName;
}

FDebug.prototype.setMessage = function(msg)
{
	if (!this.enabled)
		return;
	if (this.obj.parentNode !== document.body)
	{
		document.body.appendChild(this.obj);
	}
	$(this.obj).css('display', 'block');
	this.obj.innerHTML = msg;
}
FDebug.prototype.setTimeMessage = function (msg, ms)
{
	if (!this.enabled)
		return;
	$(this.obj).css('display', 'block');
	var destroyAtEnd = (typeof arguments[2] !== 'undefined') ? arguments[2] : false;
	this.clearAllTimeouts();
	this.setMessage(msg);
	this.addTimeout(function(tthis, destroy) { return function() {
		if (destroy)
			tthis.destroyMessage();
		else
			tthis.setMessage("...");
	}; }(this, destroyAtEnd), ms, this.MainID);
}
FDebug.prototype.addMessage = function(msg)
{
	if (!this.enabled)
		return;
	$(this.obj).css('display', 'block');
	this.obj.innerHTML += "<br />" + msg;
}
FDebug.prototype.destroyMessage = function()
{
	this.clearAllTimeouts();
	$(this.obj).css('display', 'none');
}

FDebug.prototype.init = function()
{
	$(this.obj).css('position', 'fixed');
	$(this.obj).css('display', 'block');
	$(this.obj).css('border', '1px solid #000000');
	$(this.obj).css('background-color', 'rgba(255, 255, 255, 0.4');
	$(this.obj).css('color', '#343434');
	$(this.obj).css('font-size', '15px');
	$(this.obj).css('top', '50%');
	$(this.obj).css('left', '50%');
	$(this.obj).css('min-width', '100px');
	$(this.obj).css('min-height', '50px');
	$(this.obj).css('padding', '5px');
	$(this.obj).css('z-index', '500');
}
})();

DebugTool = new FDebug();

Base.setLoaded();
}



Base.onDOMLoad(function(event) {

	if (window.removeEventListener)
	{
		window.removeEventListener("DOMContentLoaded", arguments.callee, false);
	} else if (window.detachEvent) {
		window.detachEvent("onDOMContentLoaded", arguments.callee);
	} else {
		window["onDOMContentLoaded"] = null;
	}

	//document.body.innerHTML += Base.getInfo();
	//Modificar esta linea segun pagina para compatibilidad
	Base.importJS("code/FBase/FMain.js", ScriptLoaded);
	setTimeout(function(tbase, tscript) { return function () {
		tbase.importJS("code/FBase/jquery-1.11.3.min.js", tscript)
	}; }(Base, ScriptLoaded), 1);
});
