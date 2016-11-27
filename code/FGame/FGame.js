/*
* A hacer para la alpha01 final
* 0. Para el punto 2 es necesario estudiar los documentos, como minimo, "05 trabajo y energia",  "06 torque y cuerpos extensos" y "07 Movimiento lineal y choque"
* 1. Sistema de fuerzas para colisiones (asi podemos hacer juegos bien chulos DXDXDXDX)
* 2. Fixear un poco mas el asunto de las colisiones	
* 3. Optimizar rendimiento (PRIORIDAD MAXIMA AHORA)	
*	3.1 - Analizar cada 0.5 segs (1segs me parece mucho) la velocidad a la que se desplaza un elemento !!
*	3.2 - Tratar de usar CANVAS y crear una imagen, cada 5 segs, de los objetos que no se movieron en los ultimos 10 secs para mostrar solo esa imagen en vez de todos los elementos individualmente
*	3.3 - Analizar cada 0.5 segs (al mismo tiempo que el 3.1) los elementos circundantes a una circunferencia de radio equivalente al modulo de velocidad maxima
*		de elementos que estan en desplazamiento y tienen activada la deteccion de colisiones !! (Ahora falta modificar un bug que hace que cuando se elimina un elemento SE ROMPE TODO DXDXDX, lo mejor seria guardar
		en el array de colisionesPosibles la referencia del objeto Y NO el indice como estoy haciendo ahora) !!
	3.4 - Solo son cargados graficamente los elementos que esten en el marco visible de la ventana !!
	3.5 - DestroyWhenOutside, agregar esta propiedad a FEntity para cuando algo este fuera del campo visible del juego sea destruido (util para projectiles) !!
	3.6 - Se mejoro el sistema de analisis de rango de deteccion de colisiones
* 4. Sistema de camara [Desactivado = (0, 0)], addNewCamera, setCameraPosition, focusCameraOnEntity, enableCamera (A cada camara se le asigna un ID, al habilitar una camara las demas se deshabilitan automaticamente)
*   4.1 PARA LA ALPHA02 - enableMultiCamera (id1, id2, ..., máximo 4) [Ideal para juegos multijugador singleplayer]
* TODAVIA ESTA LAG EN EL FIREFOX!!!
*/


//DEFS

var PIXELS_A_METROS 			= 35.0; //Cambiar segun correspondan los sprites del juego
var FGAME_NO_COLISION 			= 0;
var FGAME_COLISION_ABAJO 		= 1;
var FGAME_COLISION_ARRIBA 		= 2;
var FGAME_COLISION_IZQUIERDA 	= 3;
var FGAME_COLISION_DERECHA 		= 4;
var FGAME_COLISION_DESCONOCIDA 	= 5;
var FGAME_INITIAL_CAMERA		= 9999;

//Alineaciones 
var FGAME_HUD_ALIGNIZQ			= 0;
var FGAME_HUD_ALIGNDER			= 1;
var FGAME_HUD_ALIGNCEN			= 2;

var FGAME_HUD_ALIGNTOP			= 0;
var FGAME_HUD_ALIGNBOTTOM		= 1;


var GameUtil = {
	pixelsToMeters : function(p) {
		return parseFloat(p/PIXELS_A_METROS);
	},
	metersToPixels : function(m) {
		return parseFloat(m*PIXELS_A_METROS);
	}
};
	
function LoadFGame()
{

/*
	Ejemplo de FImage
var tmpImage = new FImage(image);
	var tmpThis = this;
	tmpImage.load(function(srcData) {
		$(tmpThis.obj).attr("src", srcData);
		
	*/
//Clase para animaciones
(function()
{
	var sprites = new Array();
	var currentFrame = new Array();
	var aFPS = new Array();
	var dims = new Array();
	var thisClassName = "FAnimation"; //IMPORTANTISIMO!!!

FAnimation = function(tobj)
{
	FMain.call(this);
	this.obj = new FObject(tobj);
	this.img = null;
	this.repeat = false;
	this.animName = "default";
	this.id = sprites.length;
	this.tmpLoaded = false;
	sprites[sprites.length] = new Array();
	currentFrame[currentFrame.length] = 0;
	aFPS[aFPS.length] = 60;
	dims[dims.length] = new FCoord(0, 0, 0);

	this.AnimInit();
}	

fHeredarProto(FMain, FAnimation);


FAnimation.prototype.getClassTypeName = function()
{
	return thisClassName;
}

FAnimation.prototype.getAnimFPS = function()
{
	return Math.round(1000/aFPS[this.id]);
}
FAnimation.prototype.setAnimFPS = function(nFps)
{
	aFPS[this.id] = nFps;
}

FAnimation.prototype.getWidth = function()
{
	return dims[this.id].getX();
}
FAnimation.prototype.getHeight = function()
{
	return dims[this.id].getY();
}
FAnimation.prototype.destroy = function()
{
	this.stop();
	sprites[this.id].length = 0;
}
FAnimation.prototype.loadSprites = function(tmpName, tmpFormat, cant)
{
	var i, tid;
	sprites[this.id].length = 0; //limpiamos el array primero
	var strcac = "";
	var tmpImg = new Image();
	this.tmpLoaded = false;
	for (i=0; i < cant; i++)
	{
		sprites[this.id][i] = tmpName + numberToString((i+1), cant) + "." + tmpFormat;
		strcac = strcac + sprites[this.id][i] + "\n";
	}

	var tmpthis = this;
	tmpImg.onload = function()
	{
		var height = tmpImg.height;
		var width = tmpImg.width;
		dims[tmpthis.id].setX(width);
		dims[tmpthis.id].setY(height);
		tmpthis.tmpLoaded = true;
	}
	tmpImg.src = sprites[this.id][0];


}

FAnimation.prototype.addSprite = function(tmpSprite)
{
	sprites[this.id].push(tmpSprite);
}
FAnimation.prototype.stop = function()
{
	currentFrame[this.id] = 0;
	//$(this.img).attr("src", sprites[this.id][currentFrame[this.id]]);
	this.clearTimeouts(this.id);
	
}
FAnimation.prototype.pause = function()
{
	this.clearTimeouts(this.id);
}
FAnimation.prototype.play = function()
{
	$(this.img).attr("src", sprites[this.id][currentFrame[this.id]]);
	currentFrame[this.id]++;
	if (currentFrame[this.id] >= sprites[this.id].length)
	{
		if (this.repeat)
		{
			currentFrame[this.id] = 0;
			this.addTimeout(function(tthis) { return function() {
				tthis.play();
			}; }(this), this.getAnimFPS(), this.id);
		}

	} else {
		this.addTimeout(function(tthis) { return function() {
			tthis.play();
		}; }(this), this.getAnimFPS(), this.id);
	}
}

FAnimation.prototype.AnimInit = function()
{
	aFPS[this.id] = this.getFPS(); //Heredo los FPS default de la clase Main
	var imgChilds = this.obj.getChildsCSS("img");
	if (imgChilds.length <= 0)
	{
		var tmpImg = document.createElement("img");
		$(tmpImg).css("width", "100%");
		$(tmpImg).css("height", "100%");
		$(tmpImg).css("position", "absolute");
		$(tmpImg).css("opacity", "1.0");
		$(tmpImg).css("backgroundColor", "none");
		this.obj.obj.appendChild(tmpImg);
		this.img = tmpImg;
	} else {
		this.img = imgChilds[0].obj;
	}
		
}

/**
* Retorna el src de un frame determinado en esta animacion
*/

FAnimation.prototype.getSRCFrame = function(frameNumber)
{
	if (frameNumber < 0)
		frameNumber = 0;
	if (frameNumber >= sprites[this.id].length)
		frameNumber = sprites[this.id].length-1;
	
	if (frameNumber < 0)
		return "dont exists";
	
	return sprites[this.id][frameNumber];
}

})();

//Entidad fundamental base
(function()
{

//Crear una funcion que permita resetear a la entidad a sus valores defaults

var worldX = new Array();
var oldWorldX = new Array();
var oldWorldY = new Array();
var oldWorldZ = new Array();

var worldY = new Array();
var worldZ = new Array();
var keyBeingPressed = new Array();
var gravity = new Array();
var solid = new Array();
var score = new Array();
var animaciones = new Array();
var currentSize = new Array();
var falling = new Array();
var fallingTime = new Array();
var colisiones = new Array();
var detectColisions = new Array();
var speeds = new Array();
var tmpSpeeds = new Array();
var customSpeeds = new Array();
var currentAnim = new Array();
//Constantes
var setYFirstUse = new Array();
var setXFirstUse = new Array();
var inmovible = new Array(); //objeto que no se puede desplazar del mapa mediante colisiones
var elasticidad = new Array();
var className = new Array();
var destroyed = new Array();
var masa = new Array();
var ID_USERSPEED = 4097;
var nonSolidClasses = new Array();

var fDimensions = new Array();
var ignoreAnimDimensions = new Array();
var zIndexVal = new Array();

FEntity = function()
{
	var tclassName = (typeof arguments[0] !== 'undefined') ? arguments[0] : "Entity";
	var tobj = (typeof arguments[1] !== 'undefined') ? arguments[1] : document.createElement("div");
	FObject.call(this, tobj);
	this.id = worldX.length; //ERROR, ESTO ESTA REMPLAZANDO AL this.id DEL FOBJECT Y ESO ES MUY MALA IDEA!!!, USAR UN NUEVO IDPERSONALIZADO!!
	this.destroyWhenOutside = false;
	this.decoracion = false;
	this.MyClassTypeName = "FEntity"; //SOLO Modificar en las funciones derivadas!!
	worldX[worldX.length] = 0.0;
	worldY[worldY.length] = 0.0;
	worldZ[worldZ.length] = 0.0;
	oldWorldX[oldWorldX.length] = 0.0;
	oldWorldY[oldWorldY.length] = 0.0;
	oldWorldZ[oldWorldZ.length] = 0.0;
	setYFirstUse[setYFirstUse.length] = true;
	setXFirstUse[setXFirstUse.length] = true;
	inmovible[inmovible.length] = false;
	elasticidad[elasticidad.length] = 0.0;
	className[className.length] = tclassName;
	destroyed[destroyed.length] = false;
	colisiones[colisiones.length] = new Array();
	gravity[gravity.length] = false;
	solid[solid.length] = false;
	score[score.length] = 0;
	currentSize[currentSize.length] = new FCoord(0, 0, 0);
	fDimensions[fDimensions.length] = new FCoord(0, 0, 0);
	ignoreAnimDimensions[ignoreAnimDimensions.length] = false;
	zIndexVal[zIndexVal.length] = 0;
	animaciones[animaciones.length] = new Array();
	nonSolidClasses[nonSolidClasses.length] = new Array();
	falling[falling.length] = false;
	fallingTime[fallingTime.length] = 0; //Se cuenta en segundos
	detectColisions[detectColisions.length] = false;
	currentAnim[currentAnim.length] = "error";
	masa[masa.length] = 0.0;
	speeds[speeds.length] = new FCoord(0, 0, 0); //Para las velocidades finales
	tmpSpeeds[tmpSpeeds.length] = new Array(); //Para poder agregar velocidades (vectores secundarios)
	customSpeeds[customSpeeds.length] = new Array();
	

	//Callbacks de eventos Mejor como prototypes
	//this.onColision =  null;
	//this.onSpawn =  null;
	//this.onDestroy = null;
	
	this.initN();
}

fHeredarProto(FObject, FEntity);

function checkLoaded(idAnim)
{
	if (animaciones[this.id][idAnim].tmpLoaded)
	{
			currentSize[this.id].setX(animaciones[this.id][idAnim].getWidth());
			currentSize[this.id].setY(animaciones[this.id][idAnim].getHeight());
	} else {
		this.addTimeout(function(tthis, tAnim) { return function() {
				checkLoaded.call(tthis, tAnim);
		}; }(this, idAnim), this.getFPS(), this.id);
	}
}

function settingFallingTime()
{
	if (falling[this.id])
	{
		fallingTime[this.id] = parseFloat(fallingTime[this.id] + parseFloat(1.0/this.getNonConvertedFPS()));
		this.addTimeout(function(tthis) { return function() {
				settingFallingTime.call(tthis);
		}; }(this), this.getFPS(), this.id);
	} 

}


function getCustomSpeedIndex(idSpeed)
{
	var i;
	for (i=0; i < customSpeeds[this.id].length; i++)
	{
		if (customSpeeds[this.id][i][1] == idSpeed)
			return i;
	}
	return -1;
}
function clearAllCollisions()
{
	var i, j, lenb, len;
	//Primero las mias DE SER posible
	for (i=0, len=colisiones[this.id].length; i < len; i++)
	{
		colisiones[this.id][i][0].delColision(this, false); //Eliminamos la colision tambien en el otro objeto
		
		colisiones[this.id][i].length = 0;
	}
	
	//Y ahora las de otros elementos que esten relacionados con el si existen
	for (i=0, len=colisiones.length; i < len; i++)
	{
		if (i==this.id)
			continue;
	
		for (j=0, lenb=colisiones[i].length; j < lenb; j++)
		{
			if (colisiones[i][j][0].id == this.id)
			{
				colisiones[i][j].length = 0;
				colisiones[i].splice(j, 1);
				j=-1;
				lenb--;
			}
		}
	}
	
	colisiones[this.id].length = 0;
}
function clearAllAnimations()
{
	var i, len;
	for (i=0, len=animaciones[this.id].length; i < len; i++)
		animaciones[this.id][i].destroy();
	animaciones[this.id].length = 0;
}

FEntity.prototype.setZIndex = function(nzindex)
{
	zIndexVal[this.id] = nzindex;
}

FEntity.prototype.getZIndex = function()
{
	return zIndexVal[this.id];
}

FEntity.prototype.getClassTypeName = function()
{
	return this.MyClassTypeName;
}

/* ESTAS FUNCIONES TIPO EVENTOS TIENEN QUE SER SOBRECARGADAS EN LAS CLASES DERIVADAS*/
FEntity.prototype.mainFunction = function() { }
FEntity.prototype.onSpawn = function() { }
FEntity.prototype.onColision = function() { }
FEntity.prototype.onDestroy = function() { }

/**
* Esta funcion permite establecer dimensiones propias para nuestro objeto ignorando las originales de la animacion usada, de esta
* manera se pueden mejorar las colisiones con algunos objetos determinados
*/

FEntity.prototype.forceNewDimensions = function(nwidth, nheight)
{
	ignoreAnimDimensions[this.id] = true; 
	fDimensions[this.id].setX(nwidth);
	fDimensions[this.id].setY(nheight);
}
FEntity.prototype.restoreOriginalDimensions = function()
{
	ignoreAnimDimensions[this.id] = false; 
}
//Esto sirve cuando se tiene forceNewDimensions y es diferente a las dimensiones originales del sprite
FEntity.prototype.getPaddingX = function()
{
	if (!ignoreAnimDimensions[this.id])
		return 0;
	return (currentSize[this.id].getX() - fDimensions[this.id].getX())/2.0;
}

FEntity.prototype.getPaddingY = function()
{
	if (!ignoreAnimDimensions[this.id])
		return 0;
	return (currentSize[this.id].getY() - fDimensions[this.id].getY())/2.0;
}

/**
*
* Obtener el angulo respecto a un punto
* @param tPoint FCoord, punto con el cual se quiere obtener un angulo
* @param [OP] mode integer [0(D) = Centro, 1 = Center Top, 2 = Center Bottom]
*/

FEntity.prototype.getAngleWithPoint = function(tPoint)
{
	if (!(tPoint instanceof FCoord))
		return -1;
	
	var mode =  (typeof arguments[1] !== 'undefined') ? arguments[1] : 0;
	var elemPoint = new FCoord(0, 0);
	switch (mode)
	{
		case 0:
			elemPoint.setX(worldX[this.id]+(this.getCurrentWidth()/2.0));
			elemPoint.setY(worldY[this.id]+(this.getCurrentHeight()/2.0));
		break;
		case 1:
			elemPoint.setX(worldX[this.id]+(this.getCurrentWidth()/2.0));
			elemPoint.setY(worldY[this.id]+this.getCurrentHeight());
		break;
		
		case 2:
			elemPoint.setX(worldX[this.id]+(this.getCurrentWidth()/2.0));
			elemPoint.setY(worldY[this.id]);
		break;
	}
	return getVectorAngle(tPoint.getX(), tPoint.getY(), elemPoint.getX(), elemPoint.getY());
}

FEntity.prototype.pauseCurrentAnimation = function()
{
	var i;
	for (i=0; i < animaciones[this.id].length; i++)
	{
		if (myStrICmp(animaciones[this.id][i].animName, currentAnim[this.id]) == 0)
			animaciones[this.id][i].pause();
	}
}
FEntity.prototype.playCurrentAnimation = function()
{
	var i;
	for (i=0; i < animaciones[this.id].length; i++)
	{
		if (myStrICmp(animaciones[this.id][i].animName, currentAnim[this.id]) == 0)
		{
		//	animaciones[this.id][i].stop();
			animaciones[this.id][i].play();
			
		}
	}
}


/**
* Para usar en conjunto con exportObjectsToJSON de FGameWorld
*/
FEntity.prototype.getAnimationArrayInfo = function()
{
	var i;
	var returnArray = new Array();
	var j, z;
	var addAnim = true;
	/**
	* Informacion a devolver: 
	*/
	for (i=0, j=0; i < animaciones[this.id].length; i++)
	{
		addAnim = true;
		for (z=0; z < returnArray.length; z++)
		{
			if (myStrICmp(returnArray[z][0], animaciones[this.id][i].animName) == 0)
			{
				addAnim = false;
				break;
			}
		}
		if (!addAnim)
			continue;
		returnArray[j] = new Array();
		returnArray[j][0] = animaciones[this.id][i].animName;
		returnArray[j][1] = animaciones[this.id][i].getSRCFrame(0);
		j++;
	}

	return returnArray;
}

//USER SPEEDS - Velocidades establecidas por la interaccion del usuario con el juego

FEntity.prototype.addNonSolidWith = function(className)
{
	nonSolidClasses[this.id].push(className);
}
FEntity.prototype.checkIfSolidWith = function(className)
{
	var i;
	for (i=0; i < nonSolidClasses[this.id].length; i++)
	{
		if (myStrICmp(nonSolidClasses[this.id][i], className) == 0)
			return false;
	}
	return true;
}
FEntity.prototype.destroy = function()
{
	clearAllCollisions.call(this);
	clearAllAnimations.call(this);
	if ((this.obj.parentNode !== 'undefined') && (this.obj.parentNode != null))
		this.obj.parentNode.removeChild(this.obj);
	destroyed[this.id] = true;
	this.clearAllTimeouts(true);
	this.onDestroy();
}
FEntity.prototype.isDestroyed = function()
{
	return destroyed[this.id];
}
FEntity.prototype.setClassName = function(cn)
{
	className[this.id] = cn;
}
FEntity.prototype.getClassName = function()
{
	return className[this.id];
}
FEntity.prototype.setElasticidad = function(v)
{
	elasticidad[this.id] = parseFloat(v);
}
FEntity.prototype.getElasticidad = function()
{
	return elasticidad[this.id];
}

FEntity.prototype.setMasa = function(m)
{
	masa[this.id] = m;
}
FEntity.prototype.getMasa = function()
{
	return masa[this.id];
}
//No uso la de newton POR AHORA
//kgf*pixel/s
FEntity.prototype.getFuerzaY = function()
{
	var tmpVelY = (typeof arguments[0] !== 'undefined') ? arguments[0] : this.getVelY(true);
	return parseFloat(masa[this.id]*0.5*tmpVelY);
}
FEntity.prototype.getFuerzaX = function()
{
	var tmpVelX = (typeof arguments[0] !== 'undefined') ? arguments[0] : this.getVelX(true);
	return parseFloat(masa[this.id]*0.5*tmpVelX);
}
FEntity.prototype.setImmovable = function(modo)
{
	inmovible[this.id] = modo;
}

FEntity.prototype.isMoveable = function()
{
	return !inmovible[this.id];
}

FEntity.prototype.clearCustomYSpeeds = function()
{
	var i, len;
	for (i=0, len=customSpeeds[this.id].length; i < len; i++)
		customSpeeds[this.id][i][0].setY(0);
}

FEntity.prototype.clearCustomXSpeeds = function()
{
	var i, len;
	for (i=0, len=customSpeeds[this.id].length; i < len; i++)
		customSpeeds[this.id][i][0].setX(0);

}
FEntity.prototype.getAllCustomVels = function()
{
	var newVel = new FCoord(0, 0, 0);
	var i, len;
	for (i=0, len=customSpeeds[this.id].length; i < len; i++)
	{
		newVel.setX(newVel.getX() + customSpeeds[this.id][i][0].getX());
		newVel.setY(newVel.getY() + customSpeeds[this.id][i][0].getY());
	}
	return newVel;
}

FEntity.prototype.clearCustomSpeeds = function()
{
	customSpeeds[this.id].length = 0;
}

FEntity.prototype.setCustomVelX = function (vx, idcustom)
{
	var index = getCustomSpeedIndex.call(this, idcustom);
	
	if (index >= 0)
	{
		customSpeeds[this.id][index][0].setX(vx);
	} else {
		var tmpLength = customSpeeds[this.id].length;
		customSpeeds[this.id][tmpLength] = new Array(2);
		customSpeeds[this.id][tmpLength][0] = new FCoord(vx, 0, 0);
		customSpeeds[this.id][tmpLength][1] = idcustom;
	}
}

FEntity.prototype.setCustomVelY = function (vy, idcustom)
{
	var index = getCustomSpeedIndex.call(this, idcustom);
	
	if (index >= 0)
	{
		customSpeeds[this.id][index][0].setY(vy);
	} else {
		var tmpLength = customSpeeds[this.id].length;
		customSpeeds[this.id][tmpLength] = new Array(2);
		customSpeeds[this.id][tmpLength][0] = new FCoord(0, vy, 0);
		customSpeeds[this.id][tmpLength][1] = idcustom;
	}
}

FEntity.prototype.getCustomVelX = function(idcustom)
{
	var index = getCustomSpeedIndex.call(this, idcustom);
	if (index >= 0)
		return customSpeeds[this.id][index][0].getX();
	
	return 0;
}

FEntity.prototype.getCustomVelY = function(idcustom)
{
	var index = getCustomSpeedIndex.call(this, idcustom);
	if (index >= 0)
		return customSpeeds[this.id][index][0].getY();
	
	return 0;
}


FEntity.prototype.setUserVelX = function(vx)
{
	this.setCustomVelX(vx, ID_USERSPEED);
}

FEntity.prototype.addUserVelX = function(vx)
{
	this.setCustomVelX(this.getCustomVelX(ID_USERSPEED)+ vx, ID_USERSPEED);
}

FEntity.prototype.getUserVelX = function()
{
	return this.getCustomVelX(ID_USERSPEED);
}

FEntity.prototype.getUserVelY = function()
{
	return this.getCustomVelY(ID_USERSPEED);
}

FEntity.prototype.setUserVelY = function(vy)
{
	this.setCustomVelY(vy, ID_USERSPEED);
}

FEntity.prototype.addUserVelY = function(vy)
{
	this.setCustomVelY(this.getCustomVelY(ID_USERSPEED)+ vy, ID_USERSPEED);
}



FEntity.prototype.getVelX = function()
{
	var fullSpeeds = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (fullSpeeds)
		return speeds[this.id].getX() + this.getAllCustomVels().getX();
	
	return speeds[this.id].getX();
}
FEntity.prototype.getVelY = function()
{
	var fullSpeeds = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (fullSpeeds)
		return speeds[this.id].getY() + this.getAllCustomVels().getY();
	
	return speeds[this.id].getY();
}

/*
* Funcion para establecer velocidades X e Y absolutas
*
* @param vx - integer, nueva velocidad en pixels/s
* @param [OP] - bool, [TRUE: Se limpian las velocidades custom - (D)FALSE: No]
*/

FEntity.prototype.setVelX = function(vx)
{
	var clearCustom = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	var i;
	var tmpVY = 0;
	for (i=0; i < tmpSpeeds[this.id].length; i++)
		tmpVY += tmpSpeeds[this.id][i].getY();

	tmpSpeeds[this.id].length = 0;
	tmpSpeeds[this.id][0] = new FCoord(vx, tmpVY, 0);
	
	if (clearCustom)
		this.clearCustomXSpeeds();
	
	speeds[this.id].setX(vx);
}
FEntity.prototype.setVelY = function(vy)
{
	var clearCustom = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	
	var i;
	var tmpVX = 0;
	for (i=0; i < tmpSpeeds[this.id].length; i++)
		tmpVX += tmpSpeeds[this.id][i].getX();
	
	if (clearCustom)
		this.clearCustomYSpeeds();
	
	tmpSpeeds[this.id].length = 0;
	tmpSpeeds[this.id][0] = new FCoord(tmpVX, vy, 0);

	speeds[this.id].setY(vy);
}
FEntity.prototype.addVelX = function(vx)
{
	tmpSpeeds[this.id].push(new FCoord(vx, 0, 0));
}
FEntity.prototype.addVelY = function(vy)
{
	tmpSpeeds[this.id].push(new FCoord(0, vy, 0));
}

FEntity.prototype.enableColisionDetection = function()
{
	detectColisions[this.id] = true;
}
FEntity.prototype.disableColisionDetection = function()
{
	detectColisions[this.id] = false;
}

FEntity.prototype.colisionDetection = function()
{
	return detectColisions[this.id];
}
FEntity.prototype.colisionWith = function(elem)
{
	if (!(elem instanceof FEntity))
		return false;
	var i=0;
	for (i=0; i < colisiones[this.id].length; i++)
	{
		if (elem.id == colisiones[this.id][i][0].id)
			return true;
	}

	return false;
}
/*
	Esta funcion nos permite saber con que clase de objeto hicimos colision mediante getClassName,
	devuelve un integer, es 0 si NO HAY Colision, y es > 0 si HAY colision
	posibles valores devueltos:  0: No hay colision, 1: Colision por abajo, 2: Colision por arriba, 3: Colision por izquierda, 4: Colision por derecha, 5: No se puede especificar con exactitud
*/
FEntity.prototype.colisionWithClass = function(eClassName)
{
	return !!(this.colisionWithClassByType(eClassName) > 0);
}

FEntity.prototype.colisionWithClassByType = function(eClassName)
{
	var i=0;
	for (i=0; i < colisiones[this.id].length; i++)
	{
		if (myStrICmp(colisiones[this.id][i][0].getClassName(), eClassName) == 0)
			return colisiones[this.id][i][1];
	}
	return 0;
}
FEntity.prototype.colisionTypeWith = function(elem)
{
	if (!(elem instanceof FEntity))
		return false;
	var i=0;
	for (i=0; i < colisiones[this.id].length; i++)
	{
		if (elem.id == colisiones[this.id][i][0].id)
			return colisiones[this.id][i][1];
	}

	return -1;
}

/*
* La funcion mas generica para detectar colisiones de acuerdo a tipo y/o clase
*
* @param [OP] int - type: el tipo de colision de 1 a 5 ( 0: No hay colision, 1: Colision por abajo, 2: Colision por arriba, 3: Colision por izquierda, 4: Colision por derecha, 5: No se puede especificar con exactitud)
* @param [OP] string - className: el nombre de la clase con la que colisionamos
*
* @return FEntity - objeto con el que colisionamos y cumple las condiciones [si retorna 0 entonces no existe el elemento]
*/
FEntity.prototype.getColisionWith = function()
{
	var type = (typeof arguments[0] !== 'undefined') ? arguments[0] : -1;
	var className = (typeof arguments[1] !== 'undefined') ? arguments[1] : "ignore";
	
	var i=0;
	for (i=0; i < colisiones[this.id].length; i++)
	{
		if ((type == -1 || colisiones[this.id][i][1] == type) && (className == "ignore" || (myStrICmp(colisiones[this.id][i][0].getClassName(), className) == 0)))
		{
			//alert("khe bien");
			return colisiones[this.id][i][0];
		}
	}
	return 0;
}
FEntity.prototype.getColisionWithClass = function(eClassName)
{
	return this.getColisionWith(-1, eClassName);
}

FEntity.prototype.canIJump = function()
{
	////DebugTool.addMessage(!!(this.checkColisionType(1, true) >= 0));
	return !!(this.checkColisionType(1, true) >= 0)
}

/*
* Para detectar colisiones con ciertos obejtos
*
* @param type - integer, tipo de colision - 0: No hay colision, 1: Colision por abajo, 2: Colision por arriba, 3: Colision por izquierda, 4: Colision por derecha, 5: No se puede especificar con exactitud
* @param [OP] - bool - Si es estricto con solidos o no [TRUE: Solo solidos - FALSE: Todo tipo de objetos (D)]
*
* @return integer - Indice del elemento que cumple la condicion. Si no existe devuelve -1
*/

FEntity.prototype.checkColisionType = function(type)
{
	var i;
	var onlySolids = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;

	for (i=0; i < colisiones[this.id].length; i++)
	{
		if ((colisiones[this.id][i][1] == type) && (!onlySolids || colisiones[this.id][i][0].checkSolid()))
		{
			//DebugTool.setMessage("Colision con solido por abajo: " + i);
			return i;
		}
	}
	
	return -1;
}

FEntity.prototype.addColision = function(elem, tipo)
{
	if (!(elem instanceof FEntity))
	{
		throw new Error("Solo se puede pasar objetos FEntity como parametro");
		return;
	}

	var tmpIndex = colisiones[this.id].length;
	var i;
	var colExists = false;
	for (i=0; i < colisiones[this.id].length; i++)
	{
		if (elem.id == colisiones[this.id][i][0].id)
		{
			tmpIndex = i;
			colExists = true;
		}
	}

	if (!colExists)
	{
		//Llamar aca al evento de onColision
		colisiones[this.id][tmpIndex] = new Array();
		colisiones[this.id][tmpIndex][0] = elem;
		colisiones[this.id][tmpIndex][1] = tipo;
		this.onColision();
	} else {
		colisiones[this.id][tmpIndex][1] = tipo;
	}
	//DebugTool.setMessage("Colision agregada");
	////DebugTool.addMessage("Con elem id: " + elem.id);
	////DebugTool.addMessage("Tipo: " + tipo);
}
FEntity.prototype.delColision = function(elem)
{
	if (!(elem instanceof FEntity))
	{
		throw new Error("Solo se puede pasar objetos FEntity como parametro");
		return;
	}
	if (!this.colisionWith(elem))
		return;

	var recursive = (typeof arguments[1] !== 'undefined') ? arguments[1] : true; //si no es recursiva no se elimina la colision en el otro elemento, solo en el original NO USAR
	var i=0;
	var index=-1;
	for (i=0; i < colisiones[this.id].length; i++)
	{
		if (elem.id == colisiones[this.id][i][0].id)
		{
			if (recursive)
				colisiones[this.id][i][0].delColision(this, false);
			index = i;
			break;
		}
	}
	if (index == -1)
		return false;
	
	colisiones[this.id][index].length = 0;
	colisiones[this.id].splice(index, 1);
	//DebugTool.setMessage("Colision eliminada");
	//DebugTool.addMessage("Colisiones: " + colisiones[this.id].length);

	return true;
}

FEntity.prototype.colisionsWork = function()
{
	//Primero el asunto de la gravedad
	
}

FEntity.prototype.startFalling = function()
{
	//var oldFal = falling[this.id];
	falling[this.id] = true;
	//if (!oldFal)
	//	settingFallingTime.call(this);
}
FEntity.prototype.stopFalling = function()
{
	falling[this.id] = false;
	fallingTime[this.id] = 0;
}
FEntity.prototype.isFalling = function()
{
	return falling[this.id];
}

FEntity.prototype.getYSpeed = function(g)
{
	var tmpSpeed = 0;
	if (this.checkGravity())
	{
		tmpSpeed = g*fallingTime[this.id];
	} 
	return tmpSpeed;
}
FEntity.prototype.calculateVelocity = function(grav, ms)
{
	//Reseteo las velocidades
	//this.setVelY(0);
	//this.setVelX(0);
	var tmpYSpeed = 0;
	var tmpXSpeed = 0;
	var multiPlier = parseFloat(ms/1000.0);
	if (this.checkGravity() && this.isFalling())
		tmpSpeeds[this.id].push(new FCoord(0, grav, 0));
	
	var i;
	/*customSpeeds[this.id][tmpLength]
	*/
	var customXSpeed = 0;
	var customYSpeed = 0;
	for (i=0; i < customSpeeds[this.id].length; i++)
	{
		tmpSpeeds[this.id].push(new FCoord(customSpeeds[this.id][i][0].getX(), customSpeeds[this.id][i][0].getY(), 0));
		customXSpeed += customSpeeds[this.id][i][0].getX();
		customYSpeed += customSpeeds[this.id][i][0].getY();
	}

	
	//Cargo las velocidades viejas cargadas
	//*parseFloat(ms/1000.0) -> De Pixels/s a Pixels/¿?ms
	for (i=0; i < tmpSpeeds[this.id].length; i++)
	{
		tmpYSpeed += tmpSpeeds[this.id][i].getY();
		tmpXSpeed += tmpSpeeds[this.id][i].getX();
	}
	this.setVelY(tmpYSpeed);
	this.setVelX(tmpXSpeed);
	tmpXSpeed -= customXSpeed;
	tmpYSpeed -= customYSpeed;
	tmpSpeeds[this.id].length = 0; //Reseteo todas las velocidades temporales a 0
	tmpSpeeds[this.id][0] = new FCoord(tmpXSpeed, tmpYSpeed, 0); //La velocidad tmpSpeeds SIEMPRE tiene que estar en pixels/s, por hago la transformacion
	/*DebugTool.setMessage("Informacion de la velocidad");
	//DebugTool.addMessage("Velx: " + this.getVelX(true));
	//DebugTool.addMessage("VelY: " + this.getVelY(true));
	//DebugTool.addMessage("tmpSpeeds.length: " + tmpSpeeds[this.id].length);
	//DebugTool.addMessage("Gravedad: " + grav);
			//DebugTool.addMessage("CustonXSpeed: " + customXSpeed);*/
}
FEntity.prototype.refreshWorldPositions = function(grav, ms) //Pixels/s
{
	var tmpYPos = worldY[this.id];
	var tmpXPos = worldX[this.id];
	
	this.calculateVelocity(grav, ms);
	
	tmpYPos += parseFloat(this.getVelY()*ms/1000.0);
	tmpXPos += parseFloat(this.getVelX()*ms/1000.0);
	this.setWorldY(tmpYPos);
	this.setWorldX(tmpXPos);
}

/*
* Si el parametro opcional mode es true, se obtiene las dimensiones originales sin importar qeu este activado ignoreAnimDimensions
*
*/

FEntity.prototype.getCurrentWidth = function()
{
	var forceOriginalDimensions = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (ignoreAnimDimensions[this.id] && !forceOriginalDimensions)
		return fDimensions[this.id].getX();
	else
		return currentSize[this.id].getX();
}
FEntity.prototype.getCurrentHeight = function()
{
	var forceOriginalDimensions = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	if (ignoreAnimDimensions[this.id] && !forceOriginalDimensions)
		return fDimensions[this.id].getY();
	else
		return currentSize[this.id].getY();
}

FEntity.prototype.getCurrentWidthCSS = function()
{
	var forceOriginalDimensions = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	return this.getCurrentWidth(forceOriginalDimensions) + 'px';
}
FEntity.prototype.getCurrentHeightCSS = function()
{
	var forceOriginalDimensions = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	return this.getCurrentHeight(forceOriginalDimensions) + 'px';
}
FEntity.prototype.isAnimPlaying = function(animName)
{
	if (myStrICmp(currentAnim[this.id], "error") != 0 && myStrICmp(currentAnim[this.id], animName) == 0)
		return true;
	return false;
}

FEntity.prototype.playAnimation = function(animName)
{
	//Buscar si existe la animacion con ese nombre
	var i=0;
	var found=-1;
	for (i=0; i < animaciones[this.id].length; i++)
	{
		if (myStrICmp(animaciones[this.id][i].animName, currentAnim[this.id]) == 0)
			continue; //Si ya se reproduce la animacion actual
		if ((myStrICmp(animaciones[this.id][i].animName, animName) == 0))
		{
			currentAnim[this.id] = animaciones[this.id][i].animName;
			animaciones[this.id][i].stop();
			animaciones[this.id][i].play();
			currentSize[this.id].setX(animaciones[this.id][i].getWidth());
			currentSize[this.id].setY(animaciones[this.id][i].getHeight());
			found = i;
			//alert("yeah");
		} else {
			animaciones[this.id][i].stop();
		}
	}
	if (found != -1)
		checkLoaded.call(this, found);
}
FEntity.prototype.addAnimation = function(animName, animFile, formato, cant)
{
	var repeat = (typeof arguments[4] !== 'undefined') ? arguments[4] : true;
	var tmpFps = (typeof arguments[5] !== 'undefined') ? arguments[5] : this.getFPS();
	var tmpLength = animaciones[this.id].length;
	animaciones[this.id][tmpLength] = new FAnimation(this.obj); //Un poco peligroso esto por la doble referencia en this.obj
	
	animaciones[this.id][tmpLength].animName = animName;
	animaciones[this.id][tmpLength].loadSprites(animFile, formato, cant);
	animaciones[this.id][tmpLength].repeat = repeat;
	animaciones[this.id][tmpLength].setAnimFPS(tmpFps);
}

FEntity.prototype.initN = function()
{
	worldX[this.id] = this.getPosX(false, 1);
	worldY[this.id] = this.getPosY(false, 1);
	worldZ[this.id] = 0.0;
}
//En los getWorldX, Y, Z, existe el parametro opcional booleano, que si es true, devuelve la posicion pasada (un frame antes) del objeto
FEntity.prototype.getWorldX = function()
{
	var oldPos = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	return oldPos ? oldWorldX[this.id] : worldX[this.id];
}

FEntity.prototype.getWorldXCSS = function()
{
	return worldX[this.id] + "px";
}
FEntity.prototype.getWorldY = function()
{
	var oldPos = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	return oldPos ? oldWorldY[this.id] : worldY[this.id];
}
FEntity.prototype.getWorldYCSS = function()
{
	return worldY[this.id] + "px";
}
FEntity.prototype.getWorldZ = function()
{
	var oldPos = (typeof arguments[0] !== 'undefined') ? arguments[0] : false;
	return oldPos ? oldWorldZ[this.id] : worldZ[this.id];
}

FEntity.prototype.setWorldX = function(x)
{
	var teleport = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	this.setPosX(x);
	//this.refreshPosition(false);
	if (teleport || setXFirstUse[this.id])
	{
		oldWorldX[this.id] = x;
		if (setXFirstUse[this.id])
			setXFirstUse[this.id] = false;
	} else {
		oldWorldX[this.id] = worldX[this.id];
	}
	worldX[this.id] = x;
}

FEntity.prototype.setWorldY = function(y)
{
	var teleport = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;

	this.setPosY(y);
	//this.refreshPosition(false);
	if (teleport || setYFirstUse[this.id])
	{
		oldWorldY[this.id] = y;
		if (setYFirstUse[this.id])
			setYFirstUse[this.id] = false;
	} else {
		oldWorldY[this.id] = worldY[this.id];
	}
	worldY[this.id] = y;
}
FEntity.prototype.setSolid = function(mode)
{
	solid[this.id] = mode;
}
FEntity.prototype.checkSolid = function()
{
	return solid[this.id];
}
FEntity.prototype.setGravity = function(mode)
{
	gravity[this.id] = mode;
}
FEntity.prototype.checkGravity = function()
{
	return gravity[this.id];
}
})();

//Clase FPlayer, para el jugador
(function() {
	
})();

//Clase FMap
(function() {
	var mapName = new Array();
	var entidades = new Array();
	
FMap = function(mpName)
{
	FMain.call(this);
	this.id = mapName.length;
	mapName[mapName.length] = mpName;
	entidades[entidades.length] = new Array();
}

fHeredarProto(FMain, FMap);

FMap.prototype.changeName = function(nname)
{
	mapName[this.id] = nname;
}

FMap.prototype.addEntity = function(tEntity)
{
	if (!(tEntity instanceof FEntity))
	{
		throw new Error('Solo se pueden ingresar Objetos FEntity como parametro.');
	} else {
		if (tEntity.checkGravity())
			tEntity.startFalling();
		entidades[this.id].push(tEntity);
	}
}

FMap.prototype.getMapName = function()
{
	return mapName[this.id];
}
FMap.prototype.countAllEntities = function()
{
	return entidades[this.id].length;
}
FMap.prototype.loadEntity = function(index)
{
	if (index < 0 || index>= entidades[this.id].length)
		return -1;
	return entidades[this.id][index];
}
})();

//Una simple camara :D

(function ()
{
var cameraPosition = new Array();
var cameraEnabled = new Array();
var entityFocus = new Array();
var viewDimension = new Array();
var worldLimits = new Array();
FCamera = function(posx, posy, tagN)
{
	this.id = cameraPosition.length;
	this.tag = tagN;
	worldLimits[worldLimits.length] = new Array(0, 0, -1, -1); //-1 significa sin limites, x0, y0, xf, yf
	cameraPosition[cameraPosition.length] = new FCoord(posx, posy);
	cameraEnabled[cameraEnabled.length] = false;
	entityFocus[entityFocus.length] = null;
	viewDimension[viewDimension.length] = new FCoord(800, 600);
}

FCamera.prototype.enable = function()
{
	cameraEnabled[this.id] = true;
}
FCamera.prototype.disable = function()
{
	cameraEnabled[this.id] = false;
}
FCamera.prototype.isEnabled = function()
{
	return cameraEnabled[this.id];
}

FCamera.prototype.setWorldLimits = function(x0, y0, xf, yf)
{
	worldLimits[this.id][0] = x0;
	worldLimits[this.id][1] = y0;
	worldLimits[this.id][2] = xf;
	worldLimits[this.id][3] = yf;
}

FCamera.prototype.getX = function()
{
	
	if (this.focusOnEntity())
	{
		var nx;
		nx = Math.round((entityFocus[this.id].getWorldX()+(entityFocus[this.id].getCurrentWidth()/2.0))-(viewDimension[this.id].getX()/2.0));
		if (worldLimits[this.id][0] != -1 && nx < worldLimits[this.id][0])
			nx  = worldLimits[this.id][0];
		if (worldLimits[this.id][2] != -1 && (nx+viewDimension[this.id].getX()) > worldLimits[this.id][2])
			nx  = worldLimits[this.id][2]-viewDimension[this.id].getX();
		
		cameraPosition[this.id].setX(nx);
	}
	return cameraPosition[this.id].getX(); 
}
FCamera.prototype.getY = function()
{
	if (this.focusOnEntity())
	{
		var ny;
		ny = Math.round((entityFocus[this.id].getWorldY()+(entityFocus[this.id].getCurrentHeight()/2.0))-(viewDimension[this.id].getY()/2.0));
		
		if (worldLimits[this.id][1] != -1 && ny < worldLimits[this.id][1])
			ny  = worldLimits[this.id][1];
		
		if (worldLimits[this.id][3] != -1 && (ny+viewDimension[this.id].getY()) > worldLimits[this.id][3])
			ny  = worldLimits[this.id][3]-viewDimension[this.id].getY();
		cameraPosition[this.id].setY(ny);
	}
	return cameraPosition[this.id].getY(); 
}
/**
* setX y setY solo sierven cuando focusOnEntity es false
*/
FCamera.prototype.setX = function(nx)
{
	if (!this.focusOnEntity())
		cameraPosition[this.id].setX(nx); 
}
FCamera.prototype.setY = function(ny)
{
	if (!this.focusOnEntity())
		cameraPosition[this.id].setY(ny); 
}

FCamera.prototype.focusOnEntity = function()
{
	if (!(entityFocus[this.id] instanceof FEntity))
		return false;
	return true;
}

//Solo util cuando se usa setEntityFocus
FCamera.prototype.setViewDimension = function(viewInfo)
{
	viewDimension[this.id].copy(viewInfo);
}

FCamera.prototype.setEntityFocus = function(tEntity)
{
	if (!(tEntity instanceof FEntity))
	{
		throw new Error('Solo se pueden ingresar Objetos FEntity como parametro a FCamera.addEntityFocus');
		return false;
	}
	entityFocus[this.id] = tEntity;
	return true;
}

})();

//Elementos para el HUD de FGameWorld (NO USAR ESTA CLASE, ES SOLAMENTE LA CLASE PADRE)
(function() 
{
	var followValues = new Array();
	/**
	* Parametros del constructor: 
	* 0. Posicion X [de 0.0 a 1.0]
	* 1. Posicion Y [de 0.0 a 1.0]
	* 2. Alineacion [0 (Default) = Izquierda, 1 = Derecha, 2 = Centro]
	* 3. Valor a 'seguir' (FDinamicValue)
	**/
	var MIN_ZINDEX= 5000;
	FHudElement = function(xpos, ypos)
	{
		FMain.call(this);
		this.id = followValues.length;
		this.x = xpos;
		this.y = ypos;
		this.opacity = 1.0;
		this.zIndex = MIN_ZINDEX+this.id;
		this.halign = (typeof arguments[2] !== 'undefined') ? arguments[2] : FGAME_HUD_ALIGNIZQ;
		this.valign = (typeof arguments[4] !== 'undefined') ? arguments[4] : FGAME_HUD_ALIGNTOP;

		followValues[this.id] = ((typeof arguments[3] !== 'undefined') && (arguments[3] instanceof FDinamicValue)) ? arguments[3] : null;
		this.hudElement = new FObject(document.createElement("div"));
		this.roundValue = false;
	}
	
	fHeredarProto(FMain, FHudElement); //Para timeouts y eso, que capaz nos son utiles despues

	FHudElement.prototype.getFollowValue = function()
	{
		if (followValues[this.id] == null)
			return 'null';
		return followValues[this.id].getValue();
	}
	
	FHudElement.prototype.setFollowValue = function(follow)
	{
		followValues[this.id] = ((typeof follow !== 'undefined') && (follow instanceof FDinamicValue)) ? follow : null;
	}
	
	//La funcion queda vacia por que va a ser usada por los hijos y sobrecargada!!
	FHudElement.prototype.show = function(container, xsize, ysize, ratio) { }
})();

/*
var FGAME_HUD_ALIGNTOP			= 0;
var FGAME_HUD_ALIGNBOTTOM		= 1;
*/

(function() 
{
	/**
	* El msgFormat funciona asi: 
	*
	* "Texto comun y corriente {} mas texto", donde el {} significa el valor de la variable FDinamicValue
	* Parametros: 
	*    1. msgFormat como se explico arriba
	*	 2. Posicion X del elemento
	*	 3. Posicion Y
	*	 4. (Opcional) Alineacion horizontal (FGAME_HUD_ALIGNIZQ, FGAME_HUD_ALIGNCEN, FGAME_HUD_ALIGNDER)  
	*	 5. (Opcional) Alineacion vertical (FGAME_HUD_ALIGNTOP, FGAME_HUD_ALIGNCEN, FGAME_HUD_ALIGNBOTTOM)  
	*	 6. (Opcional) Variable a seguir (variable tipo FDinamicValue)
	**/
	FHudMessage = function(msgFormat, xpos, ypos)
	{
		FHudElement.call(this, xpos, ypos, arguments[3], arguments[5], arguments[4]);
		this.msg = msgFormat;
		this.color = new FColor("#000000");
		this.font = "Arial";
		this.fontSize = 30;

	}
	
	fHeredarProto(FHudElement, FHudMessage); //Para timeouts y eso, que capaz nos son utiles despues
	
	function decodeMessage()
	{
		var strReturn = this.msg;
		if (this.roundValue)
			return strReturn.replace("{}", Math.round(this.getFollowValue()));
		else
			return strReturn.replace("{}", this.getFollowValue());
	}
	
	//La funcion queda vacia por que va a ser usada por los hijos y sobrecargada!!
	FHudElement.prototype.show = function(container, xsize, ysize, ratio)
	{
		if (!container.isFather(this.hudElement.obj))
			container.addChild(this.hudElement.obj);
		
		this.hudElement.obj.innerHTML = decodeMessage.call(this);
		$(this.hudElement.obj).css('position', 'absolute');
		$(this.hudElement.obj).css('display', 'block');
		$(this.hudElement.obj).css('opacity', this.opacity);
		
		$(this.hudElement.obj).css('font-family', this.font);
		$(this.hudElement.obj).css('font-size', Math.round(this.fontSize*ratio) + 'px');
		$(this.hudElement.obj).css('color', this.color.getHexaColor());
		$(this.hudElement.obj).css('padding', 0);
		$(this.hudElement.obj).css('margin', 0);
		$(this.hudElement.obj).css('z-index', this.zIndex);
		this.hudElement.getObjSize(true);
		
		switch (this.halign)
		{
			case FGAME_HUD_ALIGNDER:
				$(this.hudElement.obj).css('left', Math.round(this.x*xsize*ratio-this.hudElement.getWidth())+'px');
			break;
			case FGAME_HUD_ALIGNCEN:
				$(this.hudElement.obj).css('left', Math.round(this.x*xsize*ratio-this.hudElement.getWidth()/2)+'px');
			break;

			case FGAME_HUD_ALIGNIZQ:
			default:
				$(this.hudElement.obj).css('left', Math.round(this.x*xsize*ratio)+'px');
			break;
		}
		switch (this.valign)
		{
			case FGAME_HUD_ALIGNBOTTOM:
				$(this.hudElement.obj).css('top', Math.round(this.y*ysize*ratio-this.hudElement.getHeight())+'px');
			break;
			case FGAME_HUD_ALIGNCEN:
				$(this.hudElement.obj).css('top', Math.round(this.y*ysize*ratio-this.hudElement.getHeight()/2)+'px');
			break;

			case FGAME_HUD_ALIGNTOP:
			default:
				$(this.hudElement.obj).css('top', Math.round(this.y*ysize*ratio)+'px');
			break;
		}
		//DebugTool.setMessage($(this.hudElement.obj).css('top'));
		
	}
})();

(function(){
	/**
	* El FHudRect lo unico que requiere son 2 parametros adicionales para funcionar: una variable a seguir  y un maximo (que tambien puede ser otra variable a seguir)
	*
	* "Texto comun y corriente {} mas texto", donde el {} significa el valor de la variable FDinamicValue
	**/
	
	/**
	* Parametros del constructor: 
	* 1. Posicion X [de 0.0 a 1.0] (0.00001, etc... son validos)
	* 2. Posicion Y [de 0.0 a 1.0]
	* 3. Ancho del rectangulo [de 0.0 a 1.0] (0.00001, etc... son validos)
	* 4. Alto del rectangulo  [de 0.0 a 1.0]
	* 5. Variable que define el grafico (debe ser un FDinamicValue)
	* 6. Valor maximo que define el grafico (Puede ser un FDinamicValue o un numero simple)
	* 7. (Opcional) Alineacion horizontal (FGAME_HUD_ALIGNIZQ, FGAME_HUD_ALIGNCEN, FGAME_HUD_ALIGNDER)  
	* 8. (Opcional) Alineacion vertical (FGAME_HUD_ALIGNTOP, FGAME_HUD_ALIGNCEN, FGAME_HUD_ALIGNBOTTOM)  
	**/
	var tmpTextChildNode = new Array();
	FHudRect = function(xpos, ypos, width, height, followVar, max)
	{

		FHudElement.call(this, xpos, ypos, arguments[6], followVar, arguments[7]);

		this.maxValue = (max instanceof FDinamicValue) ? max : new FDinamicValue(max);
		this.widthSize = width;
		this.heightSize = height;
		this.hudChild = new FObject(document.createElement("div")); //la barra son dos elementos div, uno dentro de otro
		this.backColor = new FColor("#222222");
		this.foreColor = new FColor("#fafafa");
		this.vertical = false; //Si es TRUE, se trata de una barra de hud vertical y no horizontal como se acostumbra
		this.showText = false; //Si es true, en la barra se muestra 
		this.textColor = new FColor("#3eae46");

		tmpTextChildNode[this.id] = document.createTextNode("");
		this.hudInit();

	}

	fHeredarProto(FHudElement, FHudRect); //Para timeouts y eso, que capaz nos son utiles despues

	FHudRect.prototype.hudInit = function()
	{
		this.hudElement.addChild(this.hudChild.obj);
		this.hudElement.obj.appendChild(tmpTextChildNode[this.id]);
	}
	
	FHudRect.prototype.show = function(container, xsize, ysize, ratio)
	{
		if (!container.isFather(this.hudElement.obj))
			container.addChild(this.hudElement.obj);
		
		if (this.showText)
			tmpTextChildNode[this.id].nodeValue = this.getFollowValue();

		
		$(this.hudElement.obj).css('position', 'absolute');
		$(this.hudElement.obj).css('display', 'block');
		$(this.hudElement.obj).css('opacity', this.opacity);
		$(this.hudElement.obj).css('background-color', this.backColor.getHexaColor());
		$(this.hudElement.obj).css('padding', 0);
		$(this.hudElement.obj).css('margin', 0);
		$(this.hudElement.obj).css('z-index', this.zIndex);
		$(this.hudElement.obj).css('text-align', 'center');
		$(this.hudElement.obj).css('color', this.textColor.getHexaColor());
		$(this.hudElement.obj).css('height', Math.round(this.heightSize*ysize*ratio)+'px');
		$(this.hudElement.obj).css('width', Math.round(this.widthSize*xsize*ratio)+'px');
		//$(this.hudElement.obj).css('height', '50px');
		//$(this.hudElement.obj).css('width', '50px');
		
		//DebugTool.setMessage(Math.round(this.y*xsize*ratio)+'px');
		
				$(this.hudElement.obj).css('top', '0px');
				$(this.hudElement.obj).css('left', '0px');
				
		$(this.hudChild.obj).css('position', 'absolute');
		$(this.hudChild.obj).css('display', 'block');
		$(this.hudChild.obj).css('padding', 0);
		$(this.hudChild.obj).css('margin', 0);
		$(this.hudChild.obj).css('left', 0);
		$(this.hudChild.obj).css('background-color', this.foreColor.getHexaColor());
		
		if (this.vertical)
		{
			$(this.hudChild.obj).css('bottom', 0);
			$(this.hudChild.obj).css('height', Math.round(this.getFollowValue()*100/this.maxValue.getValue())+'%');
			$(this.hudChild.obj).css('width', '100%');
		} else {
			$(this.hudChild.obj).css('top', 0);
			$(this.hudChild.obj).css('height', '100%');
			$(this.hudChild.obj).css('width', Math.round(this.getFollowValue()*100/this.maxValue.getValue())+'%');
		}
		
		this.hudElement.getObjSize(true);
		
		switch (this.halign)
		{
			case FGAME_HUD_ALIGNDER:
				$(this.hudElement.obj).css('left', Math.round(this.x*xsize*ratio-this.hudElement.getWidth())+'px');
			break;
			case FGAME_HUD_ALIGNCEN:
				$(this.hudElement.obj).css('left', Math.round(this.x*xsize*ratio-this.hudElement.getWidth()/2)+'px');
			break;

			case FGAME_HUD_ALIGNIZQ:
			default:
				$(this.hudElement.obj).css('left', Math.round(this.x*xsize*ratio)+'px');
			break;
		}
		switch (this.valign)
		{
			case FGAME_HUD_ALIGNBOTTOM:
				$(this.hudElement.obj).css('top', Math.round(this.y*ysize*ratio-this.hudElement.getHeight())+'px');
			break;
			case FGAME_HUD_ALIGNCEN:
				$(this.hudElement.obj).css('top', Math.round(this.y*ysize*ratio-this.hudElement.getHeight()/2)+'px');
			break;
			case FGAME_HUD_ALIGNTOP:
			default:
				$(this.hudElement.obj).css('top', Math.round(this.y*ysize*ratio)+'px');
			break;
		}
	
	}
})();

//Escenario del juego 

(function() {
var version = "preAlpha 0.0011";
var creation = "16/08/2016";
var autor = "Maximiliano Ruben Viamonte";
var company = "Firetech";


var defaultResolution
var minSize = new FCoord(640, 480); //Resolucion minima
var MIN_RADIO = 18.75; //para resoluciones de minSize
var isPaused = false;
var gameStarted = false;
var gameEnded = false;
var netGame = false;
var gameScore = 0;
var entidades = new Array();
var mapas = new Array();
var MIN_COLISION_SPEEDID = 4098; //Todas las colisiones con plataformas comienzan de 4098 hacia abajo, asi no hay problema con custom que ponga el usuario
var GameRatioSize=new Array();
var originalSize = new Array();

var currentMap = new Array();
var colisionAnalize = new Array();
var oldRadius = new Array();
var counters = new Array();
var cameras = new Array();
var currentCamera = new Array();
var hudElements = new Array();
FGameWorld = function(worldContainer) {
	FMain.call(this);
	this.id = entidades.length;
	this.gravity = 0.281;
	this.world = new FObject(worldContainer);
	entidades[this.id] = new Array();
	cameras[this.id] = new Array();
	originalSize[this.id] = new FCoord(800, 600); //Resolucion default
	GameRatioSize[this.id] = 1.0;
	mapas[this.id] = new Array();
	currentMap[this.id]  = -1; //-1 = ningun mapa cargado
	colisionAnalize[this.id] = new Array();
	counters[this.id] = new Array(0, 0, 0, 0); //4 contadores en total
	oldRadius[this.id] = new Array();
	currentCamera[this.id] = null;
	hudElements[this.id] = new Array(); 
	this.Init();
}

fHeredarProto(FMain, FGameWorld);

function calculateMinRatio() //Solo basado en el alto de la resolucion, no el ancho!!
{
	return Math.round(MIN_RADIO*(originalSize[this.id].getY()/minSize.getY()));
}

function resetAllCameras()
{
	cameras[this.id].length = 0;
	cameras[this.id].push(new FCamera(0, 0, FGAME_INITIAL_CAMERA));
	cameras[this.id][0].setViewDimension(originalSize[this.id]);
	this.enableCamera(FGAME_INITIAL_CAMERA);
}

function clearAllEntities()
{
	var i, len;
	for (i=0, len=entidades[this.id].length; i < len; i++)
	{
		entidades[this.id][i].destroy();
		colisionAnalize[this.id][i].length = 0; //elimino todos los arrays que habia aca
		oldRadius[this.id][i].setX(0.0);
		oldRadius[this.id][i].setY(0.0);
	}
	entidades[this.id].length = 0;
	
	
}
function calculateGameRatioSize()
{
	var minRate = (minSize.getY()/originalSize[this.id].getY());
	GameRatioSize[this.id] = (Ventana.getHeight()/originalSize[this.id].getY());
	if (GameRatioSize[this.id] < minRate)
		GameRatioSize[this.id] = minRate;
}
function searchMapIndexByName(mapName)
{
	var i, len;

	for (i=0, len=mapas[this.id].length; i < len; i++)
	{
		if (myStrICmp(mapas[this.id][i].getMapName(), mapName) == 0)
		{
			return i;
		}
	}
	return -1;
}

function loadMapByIndex(index)
{
	if (index < 0 || index >= mapas[this.id].length)
		return;
	var i, len;
	this.clearTimeouts(this.id);
	clearAllEntities.call(this);
	colisionAnalize[this.id].length = 0;
	for (i=0, len=mapas[this.id][index].countAllEntities(); i < len; i++)
	{
		entidades[this.id].push(mapas[this.id][index].loadEntity(i));
		oldRadius[this.id][i] = new FCoord(calculateMinRatio.call(this), calculateMinRatio.call(this));
		colisionAnalize[this.id][i] = new Array(); //Array de referencias
	}
	currentMap[this.id] = index;
	resetAllCameras.call(this);
}

function pauseAllAnimations()
{
	var i, len;
	for (i=0, len=entidades[this.id].length; i < len; i++)
		entidades[this.id][i].pauseCurrentAnimation();
}
function resumeAllAnimations()
{
	var i, len;
	for (i=0, len=entidades[this.id].length; i < len; i++)
		entidades[this.id][i].playCurrentAnimation();
}

function shouldICalibrate(index)
{
	if (!entidades[this.id][index].colisionDetection())
		return false;
	
	var radius = new FCoord(0, 0);
	radius.setX(Math.abs(entidades[this.id][index].getVelX(true)));
	radius.setY(Math.abs(entidades[this.id][index].getVelY(true)));
	
	if ((oldRadius[this.id][index].getX() < radius.getX()) || oldRadius[this.id][index].getY() < radius.getY())
		return true;

	return false;
}

function disminuirRadio(index, cant)
{
	var radius = new FCoord(calculateMinRatio.call(this)+cant, calculateMinRatio.call(this)+cant);
	
	if (oldRadius[this.id][index].getX() > radius.getX())
		oldRadius[this.id][index].setX(oldRadius[this.id][index].getX()-cant);
		
	if (oldRadius[this.id][index].getY() > radius.getY())
		oldRadius[this.id][index].setY(oldRadius[this.id][index].getY()-cant);
}

function calibrateColisionRange(index)
{
	var i, len, j;
	var bObjCenter = new FCoord(0, 0);
	var radius = new FCoord(0, 0);
	var radiusB = new FCoord(0, 0);
	var xa0, xaf, xb0, xbf, ya0, yaf, yb0, ybf;
	i = index;
	colisionAnalize[this.id][i].length = 0;
	if (!entidades[this.id][i].colisionDetection())
		return;
	
	radius.setX(Math.abs(entidades[this.id][i].getVelX(true)));
	radius.setY(Math.abs(entidades[this.id][i].getVelY(true)));
	//radius = (new FCoord(entidades[this.id][i].getVelX(true), entidades[this.id][i].getVelY(true))).Mod2D()/1.5;
		
	if (oldRadius[this.id][i].getX() < radius.getX())
		oldRadius[this.id][i].setX(radius.getX());
	else
		radius.setX(oldRadius[this.id][i].getX());
		
	if (oldRadius[this.id][i].getY() < radius.getY())
		oldRadius[this.id][i].setY(radius.getY());
	else
		radius.setY(oldRadius[this.id][i].getY());
		
		//DebugTool.setMessage("Radio Y: " + radius.getY());
		//radius.setX(150.0);
		//radius.setY(150.0);


	xa0 = entidades[this.id][i].getWorldX()-radius.getX();
	xaf = entidades[this.id][i].getWorldX()+entidades[this.id][i].getCurrentWidth()+radius.getX();
	ya0 = entidades[this.id][i].getWorldY()-radius.getY();
	yaf = entidades[this.id][i].getWorldY()+entidades[this.id][i].getCurrentHeight()+radius.getY();

	for (j=0, len = entidades[this.id].length; j < len; j++)
	{
		if (j==i)
			continue;
		radiusB.setX(entidades[this.id][j].getVelX(true)/1.5);
		radiusB.setY(entidades[this.id][j].getVelY(true)/1.5);
		//radiusB = (new FCoord(entidades[this.id][j].getVelX(true), entidades[this.id][j].getVelY(true))).Mod2D()/1.5;
			
		if (oldRadius[this.id][j].getX() < radiusB.getX())
			oldRadius[this.id][j].setX(radiusB.getX());
		else
			radiusB.setX(oldRadius[this.id][j].getX());
		
		if (oldRadius[this.id][j].getY() < radiusB.getY())
			oldRadius[this.id][j].setY(radiusB.getY());
		else
			radiusB.setY(oldRadius[this.id][j].getY());
			
		xb0 = entidades[this.id][j].getWorldX()-radiusB.getX();
		xbf = entidades[this.id][j].getWorldX()+entidades[this.id][j].getCurrentWidth()+radiusB.getX();
		yb0 = entidades[this.id][j].getWorldY()-radiusB.getY();
		ybf = entidades[this.id][j].getWorldY()+entidades[this.id][j].getCurrentHeight()+radiusB.getY();
	
		if ((xa0 <= xbf && xaf >= xb0 && ya0 <= ybf && yaf >= yb0)) //Dentro de rango
			colisionAnalize[this.id][i].push(entidades[this.id][j]);

	}
}

function checkColisionsRange()
{
	var i, len, dism;
	dism =  Math.round(calculateMinRatio.call(this)/4.0);
	if (dism < 0)
		dism = 1;
	for (i=0, len=entidades[this.id].length; i < len; i++)
	{
		disminuirRadio.call(this, i, dism); //Vamos achicando los radios
		calibrateColisionRange.call(this, i);
	}
}

FGameWorld.prototype.getVersion = function()
{
	return version;
}

FGameWorld.prototype.addHudElement = function(tHud)
{
	if (!(tHud instanceof FHudElement))
	{
		throw new Error('Solo se pueden ingresar instancias de FHudElement en FGameWorld.addHudElement');
		return;
	}

	hudElements[this.id].push(tHud);
}

FGameWorld.prototype.setVisibleSize = function(x, y)
{
	originalSize[this.id].setX(x);
	originalSize[this.id].setY(y);
}
FGameWorld.prototype.getVisibleSizeX = function()
{
	return originalSize[this.id].getX();
}
FGameWorld.prototype.getVisibleSizeY = function()
{
	return originalSize[this.id].getY();
}

FGameWorld.prototype.addMap = function(mapa)
{
	if (!(mapa instanceof FMap))
	{
		throw new Error('Solo se pueden ingresar Objetos FMap');
	} else {
		mapas[this.id].push(mapa);
	}
}
FGameWorld.prototype.loadMap = function(mapName)
{
	var index = searchMapIndexByName.call(this, mapName);
	
	if (index == -1)
		return false;
	
	loadMapByIndex.call(this, index);
}
FGameWorld.prototype.nextMap = function()
{
	var index = currentMap[this.id]+1;
	if (index < 0 && index >= mapas[this.id].length) 
		index = 0;

	loadMapByIndex.call(this, index);
}
FGameWorld.prototype.previousMap = function()
{
	var index = currentMap[this.id]-1;
	if (index < 0 && index >= mapas[this.id].length) 
		index = 0;

	loadMapByIndex.call(this, index);
}
/*
Agrega una entidad a un mapa ya cargado, carga de objetos en ejecucion :D
*/
FGameWorld.prototype.addToMap = function(tEntity, mapName)
{
	if (!(tEntity instanceof FEntity))
		throw new Error('Solo se pueden ingresar Objetos FEntity como parametro.');
	var mapIndex = searchMapIndexByName.call(this, mapName);
	if (mapIndex == -1)
		throw new Error('El nombre del mapa indicado no existe');
	
	mapas[this.id][mapIndex].addEntity(tEntity);
}
FGameWorld.prototype.StartGame = function()
{
	gameStarted = true;
}
FGameWorld.prototype.isGameStarted = function()
{
	return gameStarted;
}
FGameWorld.prototype.isGamePaused = function()
{
	return isPaused;
}
FGameWorld.prototype.isNetGame = function()
{
	return netGame;
}
FGameWorld.prototype.isGameEnded = function()
{
	return gameEnded;
}
FGameWorld.prototype.pauseGame = function()
{
	if (!netGame && !isPaused) //No se pueden pausar los juegos online
	{
		isPaused = true;
		pauseAllAnimations.call(this);
	}
	//this.clearTimeouts(this.id);
	
}
FGameWorld.prototype.resumeGame = function()
{
	if (isPaused)
	{
		isPaused = false;
		resumeAllAnimations.call(this);
	}
}

FGameWorld.prototype.endGame = function()
{
	gameEnded = true;
}
FGameWorld.prototype.setScore = function(newScore)
{
	gameScore = newScore;
}
FGameWorld.prototype.addScore = function(scoreToAdd)
{
	gameScore += scoreToAdd;
}
FGameWorld.prototype.getScore = function()
{
	return gameScore;
}
FGameWorld.prototype.addEntity = function(tEntity)
{
	if (!(tEntity instanceof FEntity))
	{
		throw new Error('Solo se pueden ingresar Objetos FEntity como parametro.');
	} else {
		if (tEntity.checkGravity())
			tEntity.startFalling();
		entidades[this.id].push(tEntity);
		oldRadius[this.id][oldRadius[this.id].length] = new FCoord(calculateMinRatio.call(this), calculateMinRatio.call(this)); //minimo
		colisionAnalize[this.id][colisionAnalize[this.id].length] = new Array(); //Array de integers
	}
}
/* Retorna la cantidad de entidades que existen de cierto tipo en el mapa */
FGameWorld.prototype.entityCount = function(entClass)
{
	var i=0;
	var count=0;
	for (i=0; i < entidades[this.id].length; i++)
	{
		if (myStrICmp(entidades[this.id][i].getClassName(), entClass) == 0)
			count++;
	}
	return count;
	
}
/**
*	Funcion que informa si el elemento colisiono o no
*
*	@param integer - Indica el indice del elemento en el array entidades
*
*	@retorno integer - 0: No hay colision, 1: Colision por abajo, 2: Colision por arriba, 3: Colision por izquierda, 4: Colision por derecha, 5: No se puede especificar con exactitud
*/
FGameWorld.prototype.colisiones = function(index)
{
	if (index >= entidades[this.id].length)
		return;
	//if (!entidades[this.id][index].checkSolid())

	if (!entidades[this.id][index].colisionDetection())
		return;

	if (typeof colisionAnalize[this.id][index] === 'undefined' || colisionAnalize[this.id][index].length == 0)
		return;
	//DebugTool.setMessage("lol");
	var i, q, len;
	var ax, ay, az, oax, oay, oaz, aex, aey, aez, oaex, oaey, oaez;
	var bx, by, bz, bex, bey, bez, obx, oby, obz, obex, obey, obez;
	
	var midAX, midAY, midBX, midBY, midOldAx, midOldAy, midOldBx, midOldBy;

	var avx = entidades[this.id][index].getVelX(true);
	var avy = entidades[this.id][index].getVelY(true);
	var bvx, bvy;
	
	//Toda la info del objeto A (index actual)
	ax = entidades[this.id][index].getWorldX()+entidades[this.id][index].getPaddingX();
	ay = entidades[this.id][index].getWorldY()+entidades[this.id][index].getPaddingY();	
	az = entidades[this.id][index].getWorldZ();	
	oax = entidades[this.id][index].getWorldX(true)+entidades[this.id][index].getPaddingX();
	oay = entidades[this.id][index].getWorldY(true)+entidades[this.id][index].getPaddingY();
	oaz = entidades[this.id][index].getWorldZ(true);
	
	aex = ax + entidades[this.id][index].getCurrentWidth();
	aey = ay + entidades[this.id][index].getCurrentHeight();
	
	oaex = oax + entidades[this.id][index].getCurrentWidth();
	oaey = oay + entidades[this.id][index].getCurrentHeight();

	midAX = parseFloat(parseFloat(aex + ax)/2.0);
	midAY = parseFloat(parseFloat(aey + ay)/2.0);
	
	midOldAx = parseFloat(parseFloat(oaex+oax)/2.0);
	midOldAy = parseFloat(parseFloat(oaey+oay)/2.0);
	
	var cA = new FCoord(midAX, midAY, 0); 				//centro de A
	var cOldA = new FCoord(midOldAx, midOldAy, 0);     //centro de A viejo
	var cpA = new FCoord(parseFloat(parseFloat(cA.getX()+cOldA.getX())/2.0), parseFloat(parseFloat(cA.getY()+cOldA.getY())/2.0), 0); //centro promedio de A
	
	var cB = new FCoord(0, 0, 0);					//Centro de B
	var cOldB = new FCoord(0, 0, 0);					//Centro viejo de B
	var cpB = new FCoord(0, 0, 0);					//Centro promedio de B
	
	var e = 5; //6pixels de error maximo
	var exDesp = 2; //pixels extras a desplazar
	//Crear un array de colisiones para colisiones multiples :D
	var h = 0; //extra si esta colisionando, 3px
	var colWith = false;
	//for (i=0; i < 3; i++)
	//for (i=0; i < entidades[this.id].length; i++)
	
	if (index == 0)
		DebugTool.setMessage("Colisiones a analizar: " + colisionAnalize[this.id][index].length);
	
	for (q=0, len=colisionAnalize[this.id][index].length; q < len; q++)
	{
		if (!(colisionAnalize[this.id][index][q] instanceof FEntity))
			continue;
		if (colisionAnalize[this.id][index][q].id == entidades[this.id][index].id)
			continue;
		if (colisionAnalize[this.id][index][q].decoracion)
			continue;
		//i=colisionAnalize[this.id][index][q];
		//if (typeof entidades[this.id][i] === 'undefined')
		//	continue;
		//if (index == i)
		//	continue;
		if (colisionAnalize[this.id][index][q].isDestroyed())
			continue;
		//if (!entidades[this.id][i].checkSolid())
		//	continue;
	
		//Obtengo los datos del elemento B
		bx = colisionAnalize[this.id][index][q].getWorldX()+colisionAnalize[this.id][index][q].getPaddingX();
		by = colisionAnalize[this.id][index][q].getWorldY()+colisionAnalize[this.id][index][q].getPaddingY();	
		bz = colisionAnalize[this.id][index][q].getWorldZ();	
		obx = colisionAnalize[this.id][index][q].getWorldX(true)+colisionAnalize[this.id][index][q].getPaddingX();
		oby = colisionAnalize[this.id][index][q].getWorldY(true)+colisionAnalize[this.id][index][q].getPaddingY();	
		obz = colisionAnalize[this.id][index][q].getWorldZ(true);
		
		bex = bx + colisionAnalize[this.id][index][q].getCurrentWidth();
		bey = by + colisionAnalize[this.id][index][q].getCurrentHeight();
		obex = obx + colisionAnalize[this.id][index][q].getCurrentWidth();
		obey = oby + colisionAnalize[this.id][index][q].getCurrentHeight();
		
		colWith = entidades[this.id][index].colisionWith(colisionAnalize[this.id][index][q]);
		
		if (colWith)
		{
			bx-=h;
			//by-=h;
			//bz-=h;
			obx-=h;
			//oby-=h;
			obz-=h;
			bex+=h;
			//bey+=h;
			bez+=h;
			obex+=h;
			//obey+=h;
			//alert("chung lee");
		}
		

		
		//Primero detecto si ahora mismo se estan tocando
		//La primera detecta colision nativa, la segunda, tercera, cuarta y quinta, mediante calculo de desplazamiento
		if ((aex >= bx && ax <= bex && aey >= by && ay <= bey) || ((oaex <= bx && ax >= bex) && (aey >= by && ay <= bey)) || ((oaey <= by && ay >= bey) && (aex >= bx && ax <= bex)) || ((oax >= bex && aex <= bx) && (aey >= by && ay <= bey)) ||((oay >= bey && aey <= by) && (aex >= bx && ax <= bex)))
		{

			//Establezco que es una colision que no esta definida temporalmente, SI O SI
			if (!colWith)
			{
				entidades[this.id][index].addColision(colisionAnalize[this.id][index][q], 5);
				if (colisionAnalize[this.id][index][q].colisionDetection())
					colisionAnalize[this.id][index][q].addColision(entidades[this.id][index], 5);		
			}
			bvx = colisionAnalize[this.id][index][q].getVelX(true);
			bvy = colisionAnalize[this.id][index][q].getVelY(true);
			//Ya hay colision, ahora a ver DE DONDE CACSO ES
			//DebugTool.setMessage("Hay colision");
			//DebugTool.setTimeMessage("Hay colision", 25);
			midBX = parseFloat(parseFloat(bex + bx)/2.0);
			midBY = parseFloat(parseFloat(bey + by)/2.0);
			
			midOldBx = parseFloat(parseFloat(obex + obx)/2.0);
			midOldBy = parseFloat(parseFloat(obey + oby)/2.0);
			
			//Centro de B
			cB.setX(midBX);
			cB.setY(midBY);
			
			cOldB.setX(midOldBx);
			cOldB.setY(midOldBy);
			
			cpB.setX(parseFloat(parseFloat(cB.getX()+cOldB.getX())/2.0));
			cpB.setY(parseFloat(parseFloat(cB.getY()+cOldB.getY())/2.0));

			var RelVel = new FCoord(parseFloat((avx-bvx)*this.getFPS()/1000.0), parseFloat((avy-bvy)*this.getFPS()/1000.0), 0); //velocidad relativa
			var RelFuerza = new FCoord(parseFloat(entidades[this.id][index].getFuerzaX(avx-bvx)+colisionAnalize[this.id][index][q].getFuerzaX(bvx-avx)), parseFloat(entidades[this.id][index].getFuerzaY(avy-bvy)+colisionAnalize[this.id][index][q].getFuerzaY(bvy-avy)), 0);
			
			if (!entidades[this.id][index].isMoveable() || !colisionAnalize[this.id][index][q].isMoveable())
			{
				RelFuerza.setX(0); //las fuerzas se anulan contra un objeto inamovible
				RelFuerza.setY(0); //las fuerzas se anulan contra un objeto inamovible
			}
			
			//DebugTool.setMessage("vely: " + RelVel.getY());
			////DebugTool.addMessage("velX: " + RelVel.getX());
			
				var colDerecha = false;
				var colArriba = false;
				var colAbajo = false;
				var colIzquierda = false;
				
			if (Math.abs(RelVel.getX()) > e ||  Math.abs(RelVel.getY()) > e)
			{
				var bA = entidades[this.id][index].getCurrentWidth();
				var hA = entidades[this.id][index].getCurrentHeight();
				var bB = colisionAnalize[this.id][index][q].getCurrentWidth();
				var hB = colisionAnalize[this.id][index][q].getCurrentHeight();
				var oCoord = new FCoord(0, 0, 0);
				

				var raii;
				var rsb, rbd;
				var xEncuentro = 0;
				
				if (cA.getY() <= (cB.getY()+RelVel.getY()))
				{
					////DebugTool.addMessage("Colision por abajo");
					 colAbajo = true;
				} else {
					////DebugTool.addMessage("Colision por arriba");
					colArriba = true;
				}
				if (cA.getX() >= (cB.getX()+RelVel.getX()))
				{
					////DebugTool.addMessage("Colision por izquierda");
					colIzquierda = true;
				} else {
					////DebugTool.addMessage("Colision por derecha");
					colDerecha = true;
				}
				
				if (colAbajo && colIzquierda)
				{
					oCoord.setX(parseFloat(cOldA.getX()-0.5*bA));
					oCoord.setY(parseFloat(cOldA.getY()+0.5*hA));
					
					raiii = cOldA.slope(cA); //la pendiente
					rsb = cB.getY() - 0.5*hB - oCoord.getY();
					rbd = cB.getX() + 0.5*bB - oCoord.getX();
					
					if (Math.abs(raiii) < 0.01 || Math.abs(raiii) >= (NUMERO_GIGANTE-1.0) || Math.abs(rsb) < 0.01)
					{
						if ((cA.getY()+0.5*hA) >= (cB.getY()-0.5*hB-e) && (cOldA.getY()+0.5*hA) < (cB.getY()-0.5*hB+e))
							colIzquierda = false;							
						else
							colAbajo = false;
						
						////DebugTool.addMessage("Pendiente deforme");
						//caca=pis;
						
					} else {
						xEncuentro = parseFloat(rsb/raiii);
					
						if (xEncuentro <= rbd && RelVel.getY() >= 0)
							colIzquierda = false;
						else
							colAbajo = false;
					
						////DebugTool.addMessage("Xecuentro:  " + xEncuentro);
						////DebugTool.addMessage("RBD:  " + rbd);
					}
				} else if (colAbajo && colDerecha) {
					oCoord.setX(parseFloat(cOldA.getX()+0.5*bA));
					oCoord.setY(parseFloat(cOldA.getY()+0.5*hA));
					
					raiii = cOldA.slope(cA); //la pendiente
					rsb = cB.getY() - 0.5*hB - oCoord.getY();
					rbd = cB.getX() - 0.5*bB - oCoord.getX();
					
					if (Math.abs(raiii) < e || Math.abs(raiii) >= (NUMERO_GIGANTE-1.0) || Math.abs(rsb) < e)
					{
						if ((cA.getY()+0.5*hA) >= (cB.getY()-0.5*hB-e) && (cOldA.getY()+0.5*hA) < (cB.getY()-0.5*hB+e))
							colDerecha = false;					
						else
							colAbajo = false;
						
						////DebugTool.addMessage("Pendiente deforme");
							//caca=pis;
					} else {
						xEncuentro = parseFloat(rsb/raiii);
					
						if (xEncuentro >= rbd && RelVel.getY() >= 0)
							colDerecha = false;
						else
							colAbajo = false;
					
						////DebugTool.addMessage("Xecuentro:  " + xEncuentro);
						////DebugTool.addMessage("RBD:  " + rbd);
						////DebugTool.addMessage("raiii: " + raiii);
					}
				} else if (colArriba && colIzquierda) {
					oCoord.setX(parseFloat(cOldA.getX()-0.5*bA));
					oCoord.setY(parseFloat(cOldA.getY()-0.5*hA));
					
					raiii = cOldA.slope(cA); //la pendiente
					rsb = cB.getY() + 0.5*hB - oCoord.getY();
					rbd = cB.getX() + 0.5*bB - oCoord.getX();
					
					if (Math.abs(raiii) < 0.01 || Math.abs(raiii) >= (NUMERO_GIGANTE-1.0) || Math.abs(rsb) < 0.01)
					{
						if ((cA.getY()-0.5*hA) <= (cB.getY()+0.5*hB+e) && (cOldA.getY()-0.5*hA) > (cB.getY()+0.5*hB-e))
							colIzquierda = false;					
						else
							colArriba = false;
						
						//DebugTool.addMessage("Pendiente deforme");
							//caca=pis;
					} else {
						xEncuentro = parseFloat(rsb/raiii);
					
						if (xEncuentro <= rbd && RelVel.getY() <= 0)
							colIzquierda = false;
						else
							colArriba = false;
					
						//DebugTool.addMessage("Xecuentro:  " + xEncuentro);
						//DebugTool.addMessage("RBD:  " + rbd);
						//DebugTool.addMessage("raiii: " + raiii);
						//caca = teta;
					}
				} else if (colArriba && colDerecha) {
					oCoord.setX(parseFloat(cOldA.getX()+0.5*bA));
					oCoord.setY(parseFloat(cOldA.getY()-0.5*hA));
					
					raiii = cOldA.slope(cA); //la pendiente
					rsb = cB.getY() + 0.5*hB - oCoord.getY();
					rbd = cB.getX() - 0.5*bB - oCoord.getX();
					
					if (Math.abs(raiii) < 0.01 || Math.abs(raiii) >= (NUMERO_GIGANTE-1.0) || Math.abs(rsb) < 0.01)
					{
						if ((cA.getY()-0.5*hA) <= (cB.getY()+0.5*hB+e) && (cOldA.getY()-0.5*hA) > (cB.getY()+0.5*hB-e))
							colDerecha = false;					
						else
							colArriba = false;
						
						//DebugTool.addMessage("Pendiente deforme");
					//alert("pend deforme");
							//caca=pis;
					} else {
						xEncuentro = parseFloat(rsb/raiii);
	
						if (xEncuentro >= rbd && RelVel.getY() <= 0)
							colDerecha = false;
						else
							colArriba = false;
					
						//DebugTool.addMessage("Xecuentro:  " + xEncuentro);
						//DebugTool.addMessage("RBD:  " + rbd);
						//DebugTool.addMessage("raiii: " + raiii);
					}
				}
				
				//DebugTool.addMessage("Esto se trata con otro metodo!! ");
				//caca = pis;
			} else {
				
			//Metodo para movimientos nulos/casi-nulos
			if (((cpA.getY()+0.5*entidades[this.id][index].getCurrentHeight()) <= (cpB.getY()-0.5*colisionAnalize[this.id][index][q].getCurrentHeight())+e) || ((cpA.getY()-0.5*entidades[this.id][index].getCurrentHeight()) >= (cpB.getY()+0.5*colisionAnalize[this.id][index][q].getCurrentHeight()-e)))
			{
				//Segunda condicion para solucionar problema de BUG contra las paredes, y ademas que esta condicion no se cumpla NO significa que sea colision izquierda o derecha, sacrifico e-pixeles en cada esquina del objeto para solucionar esto
				if (((cpA.getX()+0.5*entidades[this.id][index].getCurrentWidth()) >= (cpB.getX()-0.5*colisionAnalize[this.id][index][q].getCurrentWidth()+e)) && ((cpA.getX()-0.5*entidades[this.id][index].getCurrentWidth()) <= (cpB.getX()+0.5*colisionAnalize[this.id][index][q].getCurrentWidth())-e))
				{
				if (cpA.getY() <= cpB.getY())
				{
					colAbajo = true;
				} else {
					colArriba = true;
				}
				} 
			} else {
				if (cpA.getX() <= cpB.getX())
				{
					colDerecha = true;

				} else {
					colIzquierda = true;
				}
				//alert("looo");
			}
			}
			
			/*
			* Hacer sistema de colision de objetos movibles que se desplazen acorde a las fuerzas
			*
			*/
			
			if (colAbajo)
			{
					//DebugTool.addMessage("Colision abajo");
					if (entidades[this.id][index].isMoveable() && colisionAnalize[this.id][index][q].checkSolid() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
					{
							entidades[this.id][index].setWorldY(by-entidades[this.id][index].getCurrentHeight()-entidades[this.id][index].getPaddingY());
							if (RelFuerza.getY() > 0.1)
							{
								entidades[this.id][index].setVelY((RelFuerza.getY()*2.0)/(entidades[this.id][index].getMasa()) , true);
								DebugTool.setTimeMessage("ooopa", 250);
							} else {
							if (avy > 0)
							{

								var newAvy = -avy*entidades[this.id][index].getElasticidad();
								//DebugTool.setMessage("newAvy: " + newAvy);
								//caca = teta;							
								if (Math.abs(newAvy) < 50.0)
									newAvy = 0.0;

								entidades[this.id][index].setVelY(newAvy , true);
							}
							}
						//Desplazamiento relativo
						if (Math.abs(bvx) > 10.0)
						{
							entidades[this.id][index].setCustomVelX(parseFloat(bvx), MIN_COLISION_SPEEDID+colisionAnalize[this.id][index][q].id);
						}

					}
					if (colisionAnalize[this.id][index][q].isMoveable() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
					{
						colisionAnalize[this.id][index][q].setWorldY(aey-colisionAnalize[this.id][index][q].getPaddingY());
						if (RelFuerza.getY() > 0.1)
						{
							colisionAnalize[this.id][index][q].setVelY((RelFuerza.getY()*2.0)/(colisionAnalize[this.id][index][q].getMasa()) , true);
							//DebugTool.setTimeMessage("ooopa", 250);
						} 
					}
					entidades[this.id][index].addColision(colisionAnalize[this.id][index][q], 1);
					if (colisionAnalize[this.id][index][q].colisionDetection())
						colisionAnalize[this.id][index][q].addColision(entidades[this.id][index], 2);	
			}

			if (colArriba)
			{
					//DebugTool.addMessage("Colision arriba");
					//alert("col por arriba");
					if (entidades[this.id][index].isMoveable() && colisionAnalize[this.id][index][q].checkSolid() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
					{
						entidades[this.id][index].setWorldY(bey-entidades[this.id][index].getPaddingY());
						//alert(entidades[this.id][index].getPaddingY());
						
						if (RelFuerza.getY() > 0.1)
						{
							entidades[this.id][index].addVelY(-(RelFuerza.getY()*0.5)/(entidades[this.id][index].getMasa()) , true);
							DebugTool.setTimeMessage("ooopa", 250);
						} else {
						if (avy < 0)
							entidades[this.id][index].setVelY(0, true);
						}
					}
					if (colisionAnalize[this.id][index][q].isMoveable() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
					{
						colisionAnalize[this.id][index][q].setWorldY(ay-colisionAnalize[this.id][index][q].getCurrentHeight()-colisionAnalize[this.id][index][q].getPaddingY());

					}

					entidades[this.id][index].addColision(colisionAnalize[this.id][index][q], 2);
					if (colisionAnalize[this.id][index][q].colisionDetection())
						colisionAnalize[this.id][index][q].addColision(entidades[this.id][index], 1);	
			}
			if (colDerecha)
			{
					//DebugTool.addMessage("Colision derecha");
					if (entidades[this.id][index].isMoveable() && colisionAnalize[this.id][index][q].checkSolid() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
					{
						entidades[this.id][index].setWorldX(bx-entidades[this.id][index].getCurrentWidth()-exDesp-entidades[this.id][index].getPaddingX());
						if (avx > 0)
							entidades[this.id][index].setVelX(0, true);
					}
					if (colisionAnalize[this.id][index][q].isMoveable() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
						colisionAnalize[this.id][index][q].setWorldX(aex+exDesp-colisionAnalize[this.id][index][q].getPaddingX());

					entidades[this.id][index].addColision(colisionAnalize[this.id][index][q], 4);
					if (colisionAnalize[this.id][index][q].colisionDetection())
						colisionAnalize[this.id][index][q].addColision(entidades[this.id][index], 3);
			}
			if (colIzquierda)
			{
					//DebugTool.setMessage("Colision izquierda");
					if (entidades[this.id][index].isMoveable() && colisionAnalize[this.id][index][q].checkSolid() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
					{
						entidades[this.id][index].setWorldX(bex+exDesp-entidades[this.id][index].getPaddingX());
						if (avx < 0)
							entidades[this.id][index].setVelX(0, true);
					}
					if (colisionAnalize[this.id][index][q].isMoveable() && entidades[this.id][index].checkSolid() && colisionAnalize[this.id][index][q].checkSolid() && colisionAnalize[this.id][index][q].checkIfSolidWith(entidades[this.id][index].getClassName()) && entidades[this.id][index].checkIfSolidWith(colisionAnalize[this.id][index][q].getClassName()))
						colisionAnalize[this.id][index][q].setWorldX(ax-colisionAnalize[this.id][index][q].getCurrentWidth()-exDesp-colisionAnalize[this.id][index][q].getPaddingX());

					entidades[this.id][index].addColision(colisionAnalize[this.id][index][q], 3);
					if (colisionAnalize[this.id][index][q].colisionDetection())
						colisionAnalize[this.id][index][q].addColision(entidades[this.id][index], 4);
			}
		} else {
			if (colWith)
			{
				entidades[this.id][index].delColision(colisionAnalize[this.id][index][q], false);
				entidades[this.id][index].setCustomVelX(0.0, MIN_COLISION_SPEEDID+colisionAnalize[this.id][index][q].id);
				entidades[this.id][index].setCustomVelY(0.0, MIN_COLISION_SPEEDID+colisionAnalize[this.id][index][q].id);
			}
		}
		
		
	}
}
FGameWorld.prototype.entityInWorldArea = function(index)
{
	var iniX = -currentCamera[this.id].getX()+entidades[this.id][index].getWorldX();
	var finX = -currentCamera[this.id].getX()+entidades[this.id][index].getWorldX()+entidades[this.id][index].getCurrentWidth(true);
	var iniY = -currentCamera[this.id].getY()+entidades[this.id][index].getWorldY();
	var finY = -currentCamera[this.id].getY()+entidades[this.id][index].getWorldY()+entidades[this.id][index].getCurrentHeight(true);
	
	var iniGameX = 0;
	var iniGameY = 0;
	var endGameX = this.getVisibleSizeX();
	var endGameY = this.getVisibleSizeY();
	
	if (finX > iniGameX && finY > iniGameY && iniX < endGameX && iniY < endGameY)
		return true;
	return false;
	
}
FGameWorld.prototype.entityInVisibleArea = function(index)
{
	var WindowVisible = Ventana.visibleArea();
	var iniX = (-currentCamera[this.id].getX()+entidades[this.id][index].getWorldX())*GameRatioSize[this.id];
	var finX = ((-currentCamera[this.id].getX()+entidades[this.id][index].getWorldX())+entidades[this.id][index].getCurrentWidth(true))*GameRatioSize[this.id];
	var iniY = (-currentCamera[this.id].getY()+entidades[this.id][index].getWorldY())*GameRatioSize[this.id];
	var finY = ((-currentCamera[this.id].getY()+entidades[this.id][index].getWorldY())+entidades[this.id][index].getCurrentHeight(true))*GameRatioSize[this.id];
	if (finX > WindowVisible.xi && finY > WindowVisible.yi && iniX < WindowVisible.xf && iniY < WindowVisible.yf)
		return true;
	return false;
}

FGameWorld.prototype.focusCameraOnEntity = function(cameraTag, TEntity)
{
	var i;
	for (i=0; i < cameras[this.id].length; i++)
	{
		if (cameraTag == cameras[this.id][i].tag)
			return cameras[this.id][i].setEntityFocus(TEntity); //retorna un boolean, true si se pudo, false si no
	}
	throw new Error('El TAG ingresado en FGameWorld.focusCameraOnEntity no es valido');
	return false;
	//currentEntityFocus[this.id] = 
}

FGameWorld.prototype.addCustomCamera = function(tCamera)
{
	if (!(tCamera instanceof FCamera))
	{
		throw new Error('El parametro enviado a FGameWorld.addNewCustomCamera debe ser una instancia de FCamera!!');
		return;
	}
	if (this.cameraTagExists(tCamera.tag))
	{
		throw new Error('Ya existe una camara con el TAG que estas tratando de poner!');
		return; //Ya existe una camara con ese TAG
	}
	var enableIt = (typeof arguments[1] !== 'undefined') ? arguments[1] : false;
	
	cameras[this.id].push(tCamera);
	if (enableIt)
		this.enableCamera(tCamera.tag);
}

FGameWorld.prototype.addNewCamera = function(cameraTag)
{
	if (this.cameraTagExists(cameraTag))
	{
		throw new Error('Ya existe una camara con el TAG que estas tratando de poner!');
		return; //Ya existe una camara con ese TAG
	}
	var posX = (typeof arguments[1] !== 'undefined') ? arguments[1] : 0;
	var posY = (typeof arguments[2] !== 'undefined') ? arguments[2] : 0;
	var enableIt = (typeof arguments[3] !== 'undefined') ? arguments[3] : false;
	
	cameras[this.id].push(new FCamera(posX, posY, cameraTag));
	if (enableIt)
		this.enableCamera(cameraTag);
	
}
FGameWorld.prototype.cameraTagExists = function(cameraTag)
{
	var i;
	for (i=0; i < cameras[this.id].length; i++)
	{
		if (cameraTag == cameras[this.id][i].tag)
			return true;
	}
	return false;
}
FGameWorld.prototype.enableCamera = function(cameraTag)
{
	var i;
	var tagExists=false;
	for (i=0; i < cameras[this.id].length; i++)
	{
		if (cameraTag != cameras[this.id][i].tag)
		{
			cameras[this.id][i].disable();
		} else {
			tagExists = true;
			cameras[this.id][i].setViewDimension(originalSize[this.id]);
			cameras[this.id][i].enable();
			currentCamera[this.id] = cameras[this.id][i];
		}
	}
	if (!tagExists)
		this.enableCamera(FGAME_INITIAL_CAMERA);
}

FGameWorld.prototype.paint = function()
{
	if (!isPaused) //Si el juego esta pauseado, mantener todo como esta
	{
	var i;
	//var tmpGrav = this.gravity/(this.getFPS()*1000);
	//Ahora a limpiar las que estan destruidas, o destruir algunas inclusive
	var len, destruido, j;
	destruido = false;
	for (i=0, len=entidades[this.id].length; i < len; i++)
	{
		//Destruimos objetos que esten fuera del campo del juego y que tengan activada la propiedad "destroyWhenOutside"
		if (entidades[this.id][i].destroyWhenOutside && !this.entityInWorldArea(i))
			entidades[this.id][i].destroy();
		if (!entidades[this.id][i].isDestroyed())
		{
			entidades[this.id][i].mainFunction();
			if (shouldICalibrate.call(this, i))
				calibrateColisionRange.call(this, i);
			
			continue;
		}
		destruido = true;
		for (j=0; j < len; j++) //Eliminamos cualquier customvel x/y que producia ese objeto
		{
			entidades[this.id][j].setCustomVelX(0.0, MIN_COLISION_SPEEDID+entidades[this.id][i].id); 
			entidades[this.id][j].setCustomVelY(0.0, MIN_COLISION_SPEEDID+entidades[this.id][i].id);
		}
		entidades[this.id].splice(i, 1);
		colisionAnalize[this.id].splice(i, 1);
		len--;
		i=0;
	}
	
	
	//Me convencio mas el shouldICalibrate que calibrar absolutamente 1 por 1 a todos los bichos feos estos
	if (counters[this.id][0] <= 0)
	{
		checkColisionsRange.call(this);
		counters[this.id][0] = Math.round(1000/(this.getFPS()*2));
	} else {
		counters[this.id][0]--;
	}
	calculateGameRatioSize.call(this);
	var visibleInArea = false;
	//for (i=0; i < 1; i++)
	for (i=0, len=entidades[this.id].length; i < len; i++)
	{
		if (entidades[this.id][i].isDestroyed())
			continue;
		
		visibleInArea = this.entityInVisibleArea(i);
		
		if (!this.world.isFather(entidades[this.id][i].obj) && entidades[this.id][i])
		{
			this.world.addChild(entidades[this.id][i].obj);
			//Se spawneo
			if (entidades[this.id][i] !== 'undefined')
				entidades[this.id][i].onSpawn();
		}
		//Optimizacion para mostrar solamente los objetos en ventana :D
		$(entidades[this.id][i].obj).css("position", "absolute");
		//Voy a usar por ahora el setX e Y original que trae FObject
		entidades[this.id][i].refreshWorldPositions(GameUtil.metersToPixels(this.gravity), this.getFPS());
		this.colisiones(i);

		//entidades[this.id][i].refreshWorldPositions(metersToPixels(this.gravity), this.getFPS());
		
		if (!visibleInArea)
		{
			$(entidades[this.id][i].obj).css("display", "none");
		} else {
			$(entidades[this.id][i].obj).css("display", "block");
			
			if (entidades[this.id][i].getZIndex() > 0) //Si tiene definido zindex ya esta por encima de todos los objetos normales
				$(entidades[this.id][i].obj).css('z-index', entidades[this.id].length+entidades[this.id][i].getZIndex());
			else
				$(entidades[this.id][i].obj).css('z-index', i);
			
			//Aca recien se hace el 'paint'
			$(entidades[this.id][i].obj).css("top", Math.round((-currentCamera[this.id].getY()+entidades[this.id][i].getWorldY())*GameRatioSize[this.id]) + "px");
			$(entidades[this.id][i].obj).css("left", Math.round((-currentCamera[this.id].getX()+entidades[this.id][i].getWorldX())*GameRatioSize[this.id]) + "px");
		
			$(entidades[this.id][i].obj).css("width", Math.round(entidades[this.id][i].getCurrentWidth(true)*GameRatioSize[this.id]) + "px");
			$(entidades[this.id][i].obj).css("height", Math.round(entidades[this.id][i].getCurrentHeight(true)*GameRatioSize[this.id])+ "px");
		}
		//$(entidades[this.id][i].obj).css("background", "none");
		
	}
	
	for (i=0; i < hudElements[this.id].length; i++)
		hudElements[this.id][i].show(this.world, originalSize[this.id].getX(), originalSize[this.id].getY(), GameRatioSize[this.id]);
	
	}

	this.addTimeout(function(tthis) { return function() {
			tthis.paint();
			//alert("lol");
	}; }(this), this.getFPS(), this.id);
}


/**
* exportObjectsToJSON
*
* Esta funcion esta ideada para ser usada UNICAMENTE en conjunto con el sistema de mapeo FMapMaker
* Exporta una unica vez cada uno de los tipos de objetos que existe
*/

FGameWorld.prototype.exportsObjectsToJSON = function()
{
	var i, j;
	//1ro creamos un array
	var exportArray = new Array();
	/*
	* Datos del array
	* exportArray[j][0] = nombre de clase objecto de la entidad (FEntity, FJugador, etc..)
	* exportArray[j][1] = nombre de clase interna de la entidad (FEntity.getClassName())
	* exportArray[j][2] = Numero de argumentos esperados por el constructor
	* exportArray[j][3] = Array sobre las animaciones
	* 	-> exportArray[j][3][0][0] = "Nombre de la animacion"
	* 	-> exportArray[j][3][0][1] = "src de Imagen preview de la animacion"
	*/
	var addElement = false;
	var exportElements = 0;

	for (i=0; i < entidades[this.id].length; i++)
	{
		addElement = true;
		for (j=0; j < exportArray.length; j++)
		{
			if (myStrICmp(entidades[this.id][i].getClassTypeName(), exportArray[j][0]) == 0 && myStrICmp(entidades[this.id][i].getClassName(), exportArray[j][1]) == 0)
			{
				addElement = false;
				break;
			}
		}
		if (!addElement)
			continue;
		exportArray[exportElements] = new Array();
		exportArray[exportElements][0] = entidades[this.id][i].getClassTypeName();
		exportArray[exportElements][1] = entidades[this.id][i].getClassName();
		exportArray[exportElements][2] = entidades[this.id][i].constructor.length;
		exportArray[exportElements][3] = entidades[this.id][i].getAnimationArrayInfo();
		exportArray[exportElements][4] = new Array();
		exportArray[exportElements][4][0] = entidades[this.id][i].getCurrentWidth(true);
		exportArray[exportElements][4][1] = entidades[this.id][i].getCurrentHeight(true);
		exportElements++;
	}

	//DebugTool.setMessage(JSON.stringify(exportArray));
	
	return JSON.stringify(exportArray);
	//alert("aca llego");
}
FGameWorld.prototype.exportsObjectsToJSONTextArea = function()
{
	var formulario = new FObject(document.createElement("form"));
	var exitButton = new FObject(document.createElement("div")); 
	var textArea = document.createElement("textarea");
	$(formulario.obj).css('position', 'fixed');
	$(formulario.obj).css('top', "10%");
	$(formulario.obj).css('left', "10%");
	$(formulario.obj).css('z-index', 99999);
	$(formulario.obj).css('width', '80%');
	$(formulario.obj).css('height', '80%');
	$(formulario.obj).css('background-color', '#fafafa');
	$(formulario.obj).css('margin', 0);
	$(formulario.obj).css('padding', 0);
	$(formulario.obj).css('display', 'block');
	$(textArea).css('display', 'block');
	$(textArea).css('top', '5%');
	$(textArea).css('left', '5%');
	$(textArea).css('width', '90%');
	$(textArea).css('height', '90%');
	$(textArea).css('position', 'relative');
	$(textArea).attr('readonly','readonly');
	$(textArea).val(this.exportsObjectsToJSON());
	exitButton.obj.innerHTML = "X";
	$(exitButton.obj).css('position', 'absolute');
	$(exitButton.obj).css('display', 'block');
	$(exitButton.obj).css('top', "1%");
	$(exitButton.obj).css('right', "1%");
	$(exitButton.obj).css('width', "3%");
	$(exitButton.obj).css('height', "3%");
	
	formulario.obj.appendChild(textArea);
formulario.obj.appendChild(exitButton.obj);
	document.body.appendChild(formulario.obj);
	
	exitButton.listenMouseEvents(true, true);
	exitButton.onClick = function()
	{
		formulario.obj.parentNode.removeChild(formulario.obj);
		exitButton = null;
		formulario = null;
	}
	
}
FGameWorld.prototype.Init = function()
{
	alert("Stradex Engine alpha 0.1");
	//Creamos la camara principal del juego y la activamos
	resetAllCameras.call(this);
}

})();
}

Base.setCallback(LoadFGame);