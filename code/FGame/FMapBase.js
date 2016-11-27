/**
* Progreso y pendientes
*  
* Objetivos logrados:
*	1. Se logro importar los tipos de entidades de FGameWorld a JSON y que sean importados a un array de tipos de entidades en FMKSystem
*	2. Se logro mostrar un FMKEntity en FMKMap y tambien que sea dragreable
*
* A realizar
*	1. Que se pueda mover la camara con el mouse haciendo click en la esquina derecha o izquierda del mapa del FMKMap asi es posible hacer mapas mas grandes :Date
*	2. Que se puedan cargar entidades desde el .html a FMKMap conociendo la lista de entidades disponibles por FMKSystem
*	3. Poder Guardar un mapa en JSON
*	4. Poder Importar un mapa guardado en JSON
*	5. Poder EXPORTAR un mapa a jodigo de javascript para ser usado directamente en el juego (LO MÁS IMPORTANTE!!!)
*	6. Poder IMPORTAR un mapa de codigo en javascript para que sea modificado (Esto es MUCHO más dificil, dejar para la version 0.5 o adelante)
*/



var MPK_ACTIONSELECT = 0;
var MPK_ACTIONSMOVE = 1;
var MPK_ACTIONSMOVEMAP = 2;
var MPK_ACTIONSDELETE = 3;
var MPK_ACTIONSUNDO = 4;

//FMK = Firetech Map Maker!
function LoadMapBase()
{

	(function() {
		/**
		*  Entidad basica fundamental
		*/

		var mapEntityPosition = new Array();
		var animations = new Array();
		var worldPos = new Array();
		var propiedades = new Array();
		var parameters = new Array();
		var elementMoved = new Array();
		var currentSize = new Array();
		var classType = new Array();
		var className = new Array();
		var currentAnim = new Array();
		FMKEntity = function(nwidth, nheight)
		{
			FObject.call(this, document.createElement("div"));
			
			currentSize[this.id] = new FCoord(nwidth, nheight);
			
			this.entityID = animations.length; //Si uso this.id remplazo al this.id original de FObject y se arma un quilombo xDXDXD
			this.img = null;
			
			classType[this.entityID] = "default";
			animations[this.entityID] = new Array();
			worldPos[this.entityID] = new FCoord(0, 0);
			propiedades[this.entityID] = new Array(); //Valores de los parametros :D
			parameters[this.entityID] = 0; //Numero de parametros que necesita la funcion
			elementMoved[this.entityID] = false;
			className[this.entityID] = "default";
			currentAnim[this.entityID] = "error";
			this.setDragMode(true, false, false);
			this.zIndex = 0;
			
		}
		fHeredarProto(FObject, FMKEntity);
		
		//-1 = no existe, otros valores = indice de la animacion
		function animationExists(animName)
		{
			var i;
			var len=animations[this.entityID].length;
			for (i=0; i < len; i++)
			{
				if (myStrICmp(animName, animations[this.entityID][i][0]) == 0)
					return i;
			}
			return -1;
		}
		FMKEntity.prototype.getCurrentAnim = function()
		{
			return currentAnim[this.entityID];
		}
		FMKEntity.prototype.destroy = function()
		{
			$(this.obj).css("display", "none");
			if (this.obj.parentNode !== 'undefined')
				this.obj.parentNode.removeChild(this.obj);
			this.obj = null;
			this.img = null;
			animations[this.entityID].length = 0;
			this.clearAllTimeouts(true);
		}
		FMKEntity.prototype.setClassType = function(nc)
		{
			classType[this.entityID] = nc;
		}
		FMKEntity.prototype.getClassType = function()
		{
			return classType[this.entityID];
		}
		

		FMKEntity.prototype.setClassName = function(nc)
		{
			className[this.entityID] = nc;
		}
		FMKEntity.prototype.getClassName = function()
		{
			return className[this.entityID];
		}
		FMKEntity.prototype.setParametersNumber = function(n)
		{
			parameters[this.entityID] = n;
			var i=0;
			propiedades[this.entityID].length = 0;
			for (i=0; i < n; i++)
				propiedades[this.entityID][i] = 0; //valor default es 0
		}
		FMKEntity.prototype.setParameterVal = function(index, value)
		{
			var i=0;
			if (index < 0 || index >= parameters[this.entityID].length)
				return false;
			
			if (isNumeric(value))
				value = parseInt(value);
			
			propiedades[this.entityID][index] = value;
		}
		FMKEntity.prototype.getParams = function()
		{
			return propiedades[this.entityID];
		}
		FMKEntity.prototype.getCurrentWidth = function()
		{
			return currentSize[this.id].getX();
		}
		FMKEntity.prototype.getCurrentHeight = function()
		{
			return currentSize[this.id].getY();
		}

		FMKEntity.prototype.isElementMoving = function()
		{
			return elementMoved[this.entityID];
		}
		FMKEntity.prototype.stopMoving = function()
		{
			elementMoved[this.entityID] = false;
		}
		FMKEntity.prototype.setWorldX = function(nx)
		{
			worldPos[this.entityID].setX(nx);
		}
		FMKEntity.prototype.setWorldY = function(ny)
		{
			worldPos[this.entityID].setY(ny);
		}
		FMKEntity.prototype.getWorldX = function()
		{
			return worldPos[this.entityID].getX();
		}
		FMKEntity.prototype.getWorldY = function()
		{
			return worldPos[this.entityID].getY();
		}
		/**
		* En esta version las animaciones son solo el frame 1 de la animacion completa!!!
		*/
		FMKEntity.prototype.addAnimation = function(animName, imgSrc)
		{
			var len = animations[this.entityID].length;
			var i;
			for (i=0; i < len; i++)
			{
				if (myStrICmp(animName, animations[this.entityID][i][0]) == 0)
					return false;
			}
			animations[this.entityID][len] = new Array();
			animations[this.entityID][len][0] = animName;
			animations[this.entityID][len][1] = imgSrc;
			return true;
		}
		FMKEntity.setPosX = function(tx)
		{
			this.constructor.prototype.setPosX.call(this, tx, arguments[1]);
			elementMoved[this.entityID] = true;
			
		}
		FMKEntity.setPosY = function(ty)
		{
			this.constructor.prototype.setPosX.call(this, ty, arguments[1]);
			elementMoved[this.entityID] = true;
			
		}
		FMKEntity.prototype.playAnimation = function(animName)
		{
			var imgChilds = this.getChildsCSS("img");
			if (imgChilds.length <= 0)
			{
				var tmpImg = document.createElement("img");
				$(tmpImg).css("width", "100%");
				$(tmpImg).css("height", "100%");
				$(tmpImg).css("position", "absolute");
				$(tmpImg).css("opacity", "1.0");
				$(tmpImg).css("backgroundColor", "none");
				this.obj.appendChild(tmpImg);
				this.img = tmpImg;
			} else {
				this.img = imgChilds[0].obj;
			}
			var animIndex = animationExists.call(this, animName);
			if (animIndex == -1)
				return false;
			
			currentAnim[this.entityID] = animName;
			$(this.img).attr('src', animations[this.entityID][animIndex][1]);
			
			return true;
		}
		/**
		* Un array que nos devuelve toda la información para exportar en JSON de la entidad
		*
		* Parametros:
		* dataArray[0] = classTypeName (FEntity, FItem, FPlayer, etc...)
		* dataArray[1] = className('jugador', 'itema', etc..)
		* dataArray[2] = array de parametros
		* dataArray[2][0] = valor parametro 1
		* dataArray[2][1] = valor parametro 2, etc...
		* dataArray[3] = animacion a reproducir cuando se spawnea
		* dataArray[4] = Array de posicion
		* dataArray[4][0] = posicion X
		* dataArray[4][1] = posicion Y
		* dataArray[5] = zIndex
		*/
		FMKEntity.prototype.getDataArray = function()
		{
			var i;
			var dataArray = new Array();
			dataArray[0] = this.getClassType();
			dataArray[1] = this.getClassName();
			dataArray[2] = new Array();
			for (i=0; i < propiedades[this.entityID].length; i++)
				dataArray[2][i] = propiedades[this.entityID][i];
			dataArray[3] = currentAnim[this.entityID];
			dataArray[4] = new Array();
			dataArray[4][0] = Math.round(this.getWorldX());
			dataArray[4][1] = Math.round(this.getWorldY());
			dataArray[5] = this.zIndex;
			
			DebugTool.setTimeMessage(JSON.stringify(dataArray), 15000, true);
			
			return dataArray;
		}
	})();

	(function()
	{
		var entitiesTypes = new Array();
		FMKSystem = function()
		{
			FMain.call(this);
			this.id = entitiesTypes.length;
			entitiesTypes[this.id] = new Array();;
		}
		
		fHeredarProto(FMain, FMKSystem);
		
		
		/*
		* El parametro dataArray es asi
		* dataArray[0] = classTypeName (FEntity, FItem, FPlayer, etc...)
		* dataArray[1] = className('jugador', 'itema', etc..)
		* dataArray[2] = numero de parametros que acepta el constructor
		* dataArray[3] = un array sobre animaciones
		* dataArray[4] = dimensiones (lo mas importante!!!)
		*/
		
	
		function entityTypeExists(classType, className)
		{
			var i=0;
			for (i=0; i < entitiesTypes[this.id].length; i++)
			{

				if (myStrICmp(entitiesTypes[this.id][i][0], classType) == 0 && myStrICmp(entitiesTypes[this.id][i][1], className) == 0)
					return true;
			}

			return false;
		}
		
		FMKSystem.prototype.clear = function()
		{
			entitiesTypes[this.id].length = 0;
		}
		
		FMKSystem.prototype.elementsTypesCount = function()
		{
			return entitiesTypes[this.id].length;
		}
		
		FMKSystem.prototype.getTypeAsArray = function(index)
		{
			var returnArray = new Array();
			returnArray[0] = entitiesTypes[this.id][index][0];
			returnArray[1] = entitiesTypes[this.id][index][1];
			returnArray[2] = entitiesTypes[this.id][index][2];
			returnArray[3] = new Array();
			var i=0, len=entitiesTypes[this.id][index][3].length;
			for (i=0; i < len; i++)
			{
				returnArray[3][i] = new Array();
				returnArray[3][i][0] = entitiesTypes[this.id][index][3][i][0];
				returnArray[3][i][1] = entitiesTypes[this.id][index][3][i][1];
 			}
			returnArray[4] = new Array();
			returnArray[4][0] = entitiesTypes[this.id][index][4][0];
			returnArray[4][1] = entitiesTypes[this.id][index][4][1];
			return returnArray;
		}
		
		FMKSystem.prototype.getEntityTypeIndex = function(strClassType, strClassName)
		{
			var i=0;
			for (i=0; i < entitiesTypes[this.id].length; i++)
			{

				if (myStrICmp(entitiesTypes[this.id][i][0], strClassType) == 0 && myStrICmp(entitiesTypes[this.id][i][1], strClassName) == 0)
					return i;
			}

			return -1;
		}
		
		FMKSystem.prototype.getTypeAsElement = function(index)
		{
			
			var animStart = (typeof arguments[1] !== 'undefined') ? arguments[1] : 0; //Indice de animacion con la cual empezar
			
			var returnEntity = new FMKEntity(entitiesTypes[this.id][index][4][0], entitiesTypes[this.id][index][4][1]);
			returnEntity.setClassType(entitiesTypes[this.id][index][0]);
			returnEntity.setClassName(entitiesTypes[this.id][index][1]);
			returnEntity.setParametersNumber(entitiesTypes[this.id][index][2]);
			var i=0, len=entitiesTypes[this.id][index][3].length;
			for (i=0; i < len; i++)
			{
				returnEntity.addAnimation(entitiesTypes[this.id][index][3][i][0], entitiesTypes[this.id][index][3][i][1]);
				if (i==animStart)
					returnEntity.playAnimation(entitiesTypes[this.id][index][3][i][0]);
			}

			return returnEntity;
		}
		
		
		
		FMKSystem.prototype.addEntityType = function(dataArray)
		{
	
			if (entityTypeExists.call(this, dataArray[0], dataArray[1]))
				return false;

			var index = entitiesTypes[this.id].length;
			entitiesTypes[this.id][index] = new Array();
			entitiesTypes[this.id][index][0] = dataArray[0]; //nombre del tipo, ej:
			entitiesTypes[this.id][index][1] = dataArray[1];
			entitiesTypes[this.id][index][2] = dataArray[2];
			entitiesTypes[this.id][index][4] = new Array();
			/* MODIFICAR LUEGO PARA QUE LA DIMENSION SEA POR ANIMACION Y NO POR ESTO!!*/
			entitiesTypes[this.id][index][4][0] = dataArray[4][0]; //width
			entitiesTypes[this.id][index][4][1] = dataArray[4][1]; //height
			
			entitiesTypes[this.id][index][3] = new Array();
			var i, j;
			for (i=0; i < dataArray[3].length; i++)
			{
				entitiesTypes[this.id][index][3][i] = new Array();
				for (j=0; j < dataArray[3][i].length; j++)
					entitiesTypes[this.id][index][3][i][j] = dataArray[3][i][j];
			}
			return true;
		}
		
		FMKSystem.prototype.decodeEntitiesJSON = function(strJSON)
		{
			var ArrayData = JSON.parse(strJSON);
				var i, len;
			for (i=0, len=ArrayData.length; i < len; i++)
				this.addEntityType(ArrayData[i]);
		}
		FMKSystem.prototype.exportEntitiesData = function()
		{
			return entitiesTypes[this.id];
		}
		
		FMKSystem.prototype.importEntitiesData = function(dataArray)
		{
			entitiesTypes[this.id] = dataArray; //Arriesgado
		}
		
		FMKSystem.prototype.exportEntitiesJSON = function()
		{
			return JSON.stringify(entitiesTypes[this.id]);
		}
	})();

	(function() {
		
		var entidades = new Array();
		var GameRatioSize = new Array();
		var originalSize = new Array();
		var minSize = new FCoord(640, 480);
		var currentActionType = new Array();
		var mouseStartPos = new Array();
		var mouseCurrentPos = new Array();
		var mapOldPosition = new Array();
		var mapCurrentPosition = new Array();
		var mapDimensions = new Array();
		var mouseBeingPressed = new Array();
		FMKMap = function(obj)
		{
			FMain.call(this);
			this.id = entidades.length; //Aca si puedo usar this.id por que FMain usa this.mainID
		
			entidades[this.id] = new Array();
			this.world = new FObject(obj);
			this.world.obj.innerHTML = ""; //Elimino cualquier cosa que exista adentro
			GameRatioSize[this.id] = 1.0;
			originalSize[this.id] = new FCoord(800, 600); //Tamanio Default
			currentActionType[this.id] = MPK_ACTIONSELECT; //accion default
			mouseStartPos[this.id] = new FCoord(0, 0);
			mouseCurrentPos[this.id] = new FCoord(0, 0);
			mapOldPosition[this.id] = new FCoord(0, 0);
			mapCurrentPosition[this.id] = new FCoord(0, 0);
			mouseBeingPressed[this.id] = false;
			mapDimensions[this.id] = new FCoord(0, 0);
			this.mapName = "E1M1";
			
		}
		
		fHeredarProto(FMain, FMKMap);

		function mapMoveFunction()
		{
			var tmpThis = this;
			return function(event) {
				if (currentActionType[tmpThis.id] != MPK_ACTIONSMOVEMAP)
					return;
				event = EventUtil.getEvent(event);
				switch (event.type)
				{
					case 'mousedown':
						mouseStartPos[tmpThis.id].setX(event.clientX);
						mouseStartPos[tmpThis.id].setY(event.clientY);
						mouseCurrentPos[tmpThis.id].setX(event.clientX);
						mouseCurrentPos[tmpThis.id].setY(event.clientY);
						mapOldPosition[tmpThis.id].setX(mapCurrentPosition[tmpThis.id].getX());
						mapOldPosition[tmpThis.id].setY(mapCurrentPosition[tmpThis.id].getY());
						mouseBeingPressed[tmpThis.id] = true;
						EventUtil.preventDefault(event);
					break;
					case 'mouseup':
						mouseBeingPressed[tmpThis.id] = false;
						EventUtil.preventDefault(event);
					break;
					case 'mousemove':
					
						if (!mouseBeingPressed[tmpThis.id])
							break;
						
						mouseCurrentPos[tmpThis.id].setX(event.clientX);
						mouseCurrentPos[tmpThis.id].setY(event.clientY);
						mapCurrentPosition[tmpThis.id].setX(mapOldPosition[tmpThis.id].getX()+(mouseCurrentPos[tmpThis.id].getX()-mouseStartPos[tmpThis.id].getX()));
						mapCurrentPosition[tmpThis.id].setY(mapOldPosition[tmpThis.id].getY()+(mouseCurrentPos[tmpThis.id].getY()-mouseStartPos[tmpThis.id].getY()));
						
						if (mapDimensions[tmpThis.id].getX() > 0 && (mapCurrentPosition[tmpThis.id].getX() + originalSize[tmpThis.id].getX()) > mapDimensions[tmpThis.id].getX())
							mapCurrentPosition[tmpThis.id].setX(mapCurrentPosition[tmpThis.id].getX() + originalSize[tmpThis.id].getX());
						if (mapDimensions[tmpThis.id].getY() > 0 && (mapCurrentPosition[tmpThis.id].getY() + originalSize[tmpThis.id].getY()) > mapDimensions[tmpThis.id].getY())
							mapCurrentPosition[tmpThis.id].setY(mapCurrentPosition[tmpThis.id].getY() + originalSize[tmpThis.id].getY());
						
						if (mapCurrentPosition[tmpThis.id].getX() < 0)
							mapCurrentPosition[tmpThis.id].setX(0);
						if (mapCurrentPosition[tmpThis.id].getY() < 0)
							mapCurrentPosition[tmpThis.id].setY(0);
						EventUtil.preventDefault(event);
					break;
				}
			};
		}
		
		function calculateGameRatioSize()
		{
			var minRate = (minSize.getY()/originalSize[this.id].getY());
			GameRatioSize[this.id] = (Ventana.getHeight()/originalSize[this.id].getY());
			if (GameRatioSize[this.id] < minRate)
				GameRatioSize[this.id] = minRate;
		}
		
		function getEntityIDIndex(id)
		{
			var i;
			for (i=0; i < entidades[this.id].length; i++)
			{
				if (entidades[this.id][i].entityID == id)
					return i;
			}
			return -1; //no existe!!
		}
		
		function deleteEntity(entityID)
		{
			var tmpThis = this;
			return function(event) {
				if (currentActionType[tmpThis.id] != MPK_ACTIONSDELETE)
					return;
				var delIndex = getEntityIDIndex.call(tmpThis, entityID);
				if (delIndex < 0)
					return;
				entidades[tmpThis.id][delIndex].destroy();
				entidades[tmpThis.id].splice(delIndex, 1);
			};
		}
		
		FMKMap.prototype.importObjectsTypes = function(strJson)
		{
			var jsonArray = JSON.parse(strJson);
			DebugTool.setMessage(jsonArray);
		}
		
		FMKMap.prototype.setMapLimits = function(nx, ny)
		{
			if (nx > 0 && nx < originalSize[this.id].getX())
				nx = originalSize[this.id].getX();
			if (ny > 0 && ny < originalSize[this.id].getY())
				ny = originalSize[this.id].getY();
			mapDimensions[this.id].setX(nx); //0 o numeros negativos = sin limite
			mapDimensions[this.id].setY(ny); //0 o numeros negativos = sin limite
		}
		
		FMKMap.prototype.setMapSize = function(twidth, theight)
		{
			
			if (twidth < minSize.getX())
				twidth = minSize.getX();
			if (theight < minSize.getY())
				theight = minSize.getY();
			
			originalSize[this.id].setX(twidth);
			originalSize[this.id].setY(theight);
		}
		FMKMap.prototype.getMapMiddlePoint = function()
		{
			var midX = (mapCurrentPosition[this.id].getX() + originalSize[this.id].getX()/2);
			var midY = (mapCurrentPosition[this.id].getY() + originalSize[this.id].getY()/2);
			return new FCoord(midX, midY);
		}
		FMKMap.prototype.addEntity = function(tEntity)
		{
			if (!(tEntity instanceof FMKEntity))
			{
				throw new Error("El argumento en FMKMap.addEntity tiene que ser un objeto tipo FMKEntity");
				return false;
			}
			entidades[this.id].push(tEntity);
		}
		
		FMKMap.prototype.setAction = function(actionType)
		{
			var i;
			switch (actionType)
			{
				default: 
				case MPK_ACTIONSELECT:
					
				break;
					
				case MPK_ACTIONSMOVE:
					
				break;
				case MPK_ACTIONSMOVEMAP:
					if (actionType == currentActionType[this.id])
						break;
					EventUtil.addHandler(this.world.obj, "mousedown", mapMoveFunction.call(this));
					EventUtil.addHandler(this.world.obj, "mouseup", mapMoveFunction.call(this));
					EventUtil.addHandler(this.world.obj, "mousemove", mapMoveFunction.call(this));
				break;
				case MPK_ACTIONSDELETE:

					for (i=0; i < entidades[this.id].length; i++)
						EventUtil.addHandler(entidades[this.id][i].obj, "click", deleteEntity.call(this, entidades[this.id][i].entityID));

				break;
				case MPK_ACTIONSUNDO:
					
				break;
			}
			
			if (actionType != currentActionType[this.id] && currentActionType[this.id] == MPK_ACTIONSMOVEMAP)
			{
					EventUtil.removeHandler(this.world.obj, "mousedown", mapMoveFunction.call(this));
					EventUtil.removeHandler(this.world.obj, "mouseup", mapMoveFunction.call(this));
					EventUtil.removeHandler(this.world.obj, "mousemove", mapMoveFunction.call(this));
					//alert("cool");
			}
			if (actionType != currentActionType[this.id] && currentActionType[this.id] == MPK_ACTIONSDELETE)
			{
					for (i=0; i < entidades[this.id].length; i++)
						EventUtil.removeHandler(entidades[this.id][i].obj, "click", deleteEntity.call(this, entidades[this.id][i].entityID));
			}
			currentActionType[this.id] = actionType;
			
		}

		FMKMap.prototype.entityInVisibleArea = function(index)
		{
			var WindowVisible = Ventana.visibleArea();

			var iniX = (-mapCurrentPosition[this.id].getX()+entidades[this.id][index].getWorldX())*GameRatioSize[this.id];

			var finX = (-mapCurrentPosition[this.id].getX()+(entidades[this.id][index].getWorldX())+entidades[this.id][index].getCurrentWidth())*GameRatioSize[this.id];
			var iniY = (-mapCurrentPosition[this.id].getY()+entidades[this.id][index].getWorldY())*GameRatioSize[this.id];

			var finY = ((-mapCurrentPosition[this.id].getY()+entidades[this.id][index].getWorldY())+entidades[this.id][index].getCurrentHeight())*GameRatioSize[this.id];
			if (finX > WindowVisible.xi && finY > WindowVisible.yi && iniX < WindowVisible.xf && iniY < WindowVisible.yf)
				return true;
			return false;
		}
		
		FMKMap.prototype.fixEntityPosition = function(index)
		{
			var realX =  $(entidades[this.id][index].obj).position().left;
			var realY =  $(entidades[this.id][index].obj).position().top;
			
			var newXPos = realX/GameRatioSize[this.id]+mapCurrentPosition[this.id].getX();
			var newYPos = realY/GameRatioSize[this.id]+mapCurrentPosition[this.id].getY();
			
			entidades[this.id][index].setWorldX(newXPos);
			entidades[this.id][index].setWorldY(newYPos);
		}
		
		FMKMap.prototype.paint = function()
		{
			
			var i;
			var visibleInArea = false;
			calculateGameRatioSize.call(this);
			for (i=0; i < entidades[this.id].length; i++)
			{

				if (currentActionType[this.id] == MPK_ACTIONSMOVE)
					entidades[this.id][i].setDragMode(true, false, false);
				else
					entidades[this.id][i].setDragMode(false);

				if (!this.world.isFather(entidades[this.id][i].obj) && entidades[this.id][i])
					this.world.addChild(entidades[this.id][i].obj);

				$(entidades[this.id][i].obj).css("position", "absolute");
				//entidades[this.id][i].refreshWorldPositions(metersToPixels(this.gravity), this.getFPS());

				if (entidades[this.id][i].isBeingDragged())
				{
					this.fixEntityPosition(i);
					continue;
				}
				
				visibleInArea = this.entityInVisibleArea(i);
				if (!visibleInArea)
				{
					$(entidades[this.id][i].obj).css("display", "none");

				} else {

					$(entidades[this.id][i].obj).css("display", "block");
					
					if (entidades[this.id][i].zIndex > 0)
						$(entidades[this.id][i].obj).css('z-index', entidades[this.id].length+entidades[this.id][i].zIndex);
					else
						$(entidades[this.id][i].obj).css('z-index', i);

					//Aca recien se hace el 'paint'
					$(entidades[this.id][i].obj).css("top", Math.round((-mapCurrentPosition[this.id].getY()+entidades[this.id][i].getWorldY())*GameRatioSize[this.id]) + "px");
					$(entidades[this.id][i].obj).css("left", Math.round((-mapCurrentPosition[this.id].getX()+entidades[this.id][i].getWorldX())*GameRatioSize[this.id]) + "px");

					$(entidades[this.id][i].obj).css("width", Math.round(entidades[this.id][i].getCurrentWidth()*GameRatioSize[this.id]) + "px");
					$(entidades[this.id][i].obj).css("height", Math.round(entidades[this.id][i].getCurrentHeight()*GameRatioSize[this.id])+ "px");
				} 
			}
			
			//La mitad de FPS para que no se sobrecarge tanto al pedo un programa simple de mapeo es esto, no el juego!!
			this.addTimeout(function(tthis) { return function() {
				tthis.paint();
				//alert("lol");
			}; }(this), (this.getFPS()*2), this.id);
			
			
		}
		
		/**
		*	 * FUNCIONES SOBRE EXPORTAR E IMPORTAR INFORMACIÓN *
		**/
		
		/*
		* .:Array del codigo de un mapa:.
		* @param tSystem (FMKSystem) [se necesita para poder generar el json de los tipos de objetos]
		*
		*
		* dataArray[0] = array con la informacion del mapa
		* 	dataArray[0][0] = nombre del mapa
		* 	dataArray[0][1][0] = resolucion del mapa x
		* 	dataArray[0][1][1] = resolucion del mapa y
		* 	dataArray[0][2][0] = limite del mapa x
		* 	dataArray[0][2][1] = limite del mapa y
		* 	dataArray[0][3][0] = autor del mapa
		* 	dataArray[0][3][1] = version
		* dataArray[1] = Array con la informacion de todos los TIPOS de entidades (TIPOS!!! NO ENTIDADES, TIPOS!!) [ver FMKSystem para ver la estructura de datos]
		* dataArray[2] = Array con informacion de todas las entidades insertadas en el mapa [ver FMKEntity para ver la estructura de datos]
		*/
		
		FMKMap.prototype.clearALLData = function(tSystem)
		{
			var i, len=entidades[this.id].length;

			this.clearTimeouts(this.id); //detengo la funcion paint
			for (i=0; i < len; i++)
				entidades[this.id][i].destroy();
			entidades[this.id].length = 0;
			tSystem.clear();
		}

		FMKMap.prototype.loadMapJSON = function(tSystem, strData)
		{
			//if (!isValidJSONString(strData))
			//	return;

			//Limpiar todo
			this.clearALLData(tSystem);

			var dataArray = JSON.parse(strData);

			this.mapName = dataArray[0][0];
			this.setMapSize(dataArray[0][1][0], dataArray[0][1][1]);
			this.setMapLimits(dataArray[0][2][0], dataArray[0][2][1]);

			tSystem.importEntitiesData(dataArray[1]);

			
			var i, j, len, tmpEntity, tmpIndex;
			for (i=0, len=dataArray[2].length; i < len; i++)
			{
				tmpIndex = tSystem.getEntityTypeIndex(dataArray[2][i][0], dataArray[2][i][1]);
				
				if (tmpIndex < 0)
					continue; //Error, la entidad en el mapa no esta especificada en los tipos de entidades!!, problema serio esto
				
				tmpEntity = tSystem.getTypeAsElement(tmpIndex);
				tmpEntity.zIndex = dataArray[2][i][5];
				tmpEntity.setWorldX(dataArray[2][i][4][0]);
				tmpEntity.setWorldY(dataArray[2][i][4][1]);
				tmpEntity.playAnimation(dataArray[2][i][3]);
				tmpEntity.setParametersNumber(dataArray[2][i][2].length);
				
				for (j=0; j < dataArray[2][i][2].length; j++)
					tmpEntity.setParameterVal(j, dataArray[2][i][2][j]);
				
				this.addEntity(tmpEntity);
			}
			//alert("lol");
			this.paint();
			
		}
		/**
		* FUNCION CRUCIAL DEL SISTEMA, ES LA QUE CREA LA FUNCION JAVASCRIPT YA DEL MAPA PARA SER USADA
		*/
		FMKMap.prototype.exportMapJS = function(tSystem)
		{
			var strExport = "/*\n** [CODIGO GENERADO AUTOMATICAMENTE POR Stradex Engine: Map System] **\n*Para poder importar este mapa simplemente se debe llamar a la funcion creada desde el MAIN del juego\n* y pasarle como parametro un FMap\n*/\n\n";
			strExport += "function loadMap_" + this.mapName.replace(' ', '_') + "(tMap)\n{\n\tvar tmpEntity;\n\n";
			
			//Aca va lo fuerte
			strExport += "\ttMap.changeName(\"" + this.mapName + "\");\n";
			//Comentado por que POR AHORA todavia no esta habilitada en el FGame la resolucion por mapa individualmente
			strExport += "\t//tMap.setResolution(" + originalSize[this.id].getX() + ", " + originalSize[this.id].getY() + ");\n\n";
			var i, j, tmpParams, len=entidades[this.id].length;
			for (i=0; i < len; i++)
			{
				strExport += "\t//Objeto nro " + (i+1) + "\n";
				strExport += "\ttmpEntity = new " + entidades[this.id][i].getClassType() + "(";
				tmpParams = entidades[this.id][i].getParams();
				for (j=0; j < tmpParams.length; j++)
				{
					if (j < (tmpParams.length-1))
					{
						if (isNumeric(tmpParams[j]))
							strExport += tmpParams[j] + ", ";
						else
							strExport += "\"" + tmpParams[j] + "\", ";
					} else {
						if (isNumeric(tmpParams[j]))
							strExport += tmpParams[j];
						else
							strExport += "\"" + tmpParams[j] + "\"";
					}
				}
				strExport += ");\n";
				strExport += "\ttmpEntity.setClassName(\"" + entidades[this.id][i].getClassName() + "\");\n";
				if (entidades[this.id][i].zIndex > 0)
					strExport += "\ttmpEntity.setZIndex(" + entidades[this.id][i].zIndex + ");\n";
				strExport += "\ttmpEntity.onSpawn = function()\n \t{\n\t\t" + entidades[this.id][i].getClassType() + ".prototype.onSpawn.call(this);\n";
				strExport += "\t\tthis.playAnimation(\"" + entidades[this.id][i].getCurrentAnim() + "\");\n";
				strExport += "\t\tthis.setWorldX(" + Math.round(entidades[this.id][i].getWorldX()) + ");\n";
				strExport += "\t\tthis.setWorldY(" + Math.round(entidades[this.id][i].getWorldY()) + ");\n";
				strExport += "\n\t};\n\ttMap.addEntity(tmpEntity);\n\n";
			}
			strExport += "}";
			return strExport;
		}
		
		FMKMap.prototype.saveMap = function(tSystem)
		{
			var dataArray = new Array();
			dataArray[0] = new Array();

			dataArray[0][0] = this.mapName;
			dataArray[0][1] = new Array();
			dataArray[0][1][0] = originalSize[this.id].getX();
			dataArray[0][1][1] = originalSize[this.id].getY();
			dataArray[0][2] = new Array();
			dataArray[0][2][0] = mapDimensions[this.id].getX();
			dataArray[0][2][1] = mapDimensions[this.id].getY();
			//Lo de autores y version en el proximo release
			dataArray[1] = tSystem.exportEntitiesData();
			dataArray[2] = new Array();
			var i, len;
			for (i=0, len=entidades[this.id].length; i < len; i++)
				dataArray[2][i] = entidades[this.id][i].getDataArray();
			
			return dataArray;
		}
		
		FMKMap.prototype.saveMapJSON = function(tSystem)
		{
			return JSON.stringify(this.saveMap(tSystem));
		}
		
		FMKMap.prototype.saveMapToJSONTextArea = function(tSystem)
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

			$(textArea).val(this.saveMapJSON(tSystem));
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
		FMKMap.prototype.exportMapToJSTextArea = function(tSystem)
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

			$(textArea).val(this.exportMapJS(tSystem));
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
	})();
}

Base.setCallback(LoadMapBase);