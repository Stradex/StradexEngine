

var miJuego;
var gameTimer;
var mapScoreLimit = 0;
var pauseTimer = 50;
var shootTime=0;
var MiValor;
function Iniciar()
{

	miJuego = new FGameWorld(document.getElementById("world"));
	miJuego.setVisibleSize(1024, 768);
	gameTimer = new FMain();
	//Cargar Elementos
	//En todo juego con este motor, es mejor declarar primero nuestras clases personalizadas derivadas de FEntity, EJ: FBloque
	(function() {
		FBloque = function(x, y)
		{
			FEntity.call(this, "Bloque");
			
			this.MyClassTypeName = "FBloque";
			this.BInit(x, y);
		}
		fHeredarProto(FEntity, FBloque);
		
		FBloque.prototype.BInit = function(px, py)
		{
			this.setWorldX(px);
			this.setWorldY(py);
			this.addAnimation("idle", "archoSurvival/sprites/textures/cyberpunk/AElectric", "png", 1, false);
			this.playAnimation("idle");
			this.setSolid(true);
			this.setMasa(50.0);
			this.setImmovable(true);
		}
		
	})();
	(function() {
		FItem = function(x, y)
		{
			FEntity.call(this, "item");
			this.MyClassTypeName = "FItem";
			this.BInit(x, y);
		}
		fHeredarProto(FEntity, FItem);
		
		FItem.prototype.BInit = function(px, py)
		{
			this.setWorldX(px);
			this.setWorldY(py);
			this.addAnimation("idle", "archoSurvival/sprites/Enemies/Archo/caca", "png", 8, true);
			this.playAnimation("idle");
			this.setSolid(true);
			this.setGravity(true);
			this.addNonSolidWith("archo");
			//this.setMasa(5050.0);
			//this.setImmovable(true);
			this.enableColisionDetection();
		}
		
	})();
	(function() {
		FPlataforma = function(x, y, dX, dY, speed)
		{
			FBloque.call(this, x, y);
			
			this.MyClassTypeName = "FPlataforma";
			this.iniY = y;
			this.iniX = x;
			this.eX = x+dX;
			this.eY = y+dY;
			this.platSpeed = speed;
			this.reached = false;
			this.CInit();
		}
		fHeredarProto(FBloque, FPlataforma);
		
		FBloque.prototype.CInit = function()
		{
			if (!this.reached)
			{
				if (this.eX > this.iniX)
					this.setVelX(this.platSpeed, true);
				else
					this.setVelX(-this.platSpeed, true);

			} else {
				if (this.iniX > this.eX)
					this.setVelX(this.platSpeed, true);
				else
					this.setVelX(-this.platSpeed, true);
			}
			
			if (!this.reached && ((this.eX > this.iniX && this.getWorldX() >= this.eX) || (this.eX < this.iniX && this.getWorldX() <= this.eX)))
			{
				this.reached = true;
			} else if (this.reached && ((this.iniX > this.eX && this.getWorldX() >= this.iniX) || (this.iniX < this.eX && this.getWorldX() <= this.iniX)))
				this.reached = false;
			
			this.addTimeout(function(tthis) { return function() {
				tthis.CInit();
			//alert("lol");
			}; }(this), this.getFPS(), 149);
			
		}
		
	})();
	(function () {
		FArcho = function()
		{
			FEntity.call(this, "archo");

			this.MyClassTypeName = "FArcho";			
			this.airControl = 0.5; //control de aire
			this.maxXUserSpeed = 7.0;
			this.shootWait = 75;
			this.ArchInit();
		}
		
		fHeredarProto(FEntity, FArcho);
		
		FArcho.prototype.ArchInit = function()
		{
			this.listenKeyPressed(true);
			this.setGravity(true);
			this.setSolid(true);
			this.setMasa(75.0);
			//this.setImmovable(true);
			this.setWorldX(-2, true);
			this.addAnimation("death", "archoSurvival/sprites/Enemies/Archo/death", "png", 8, true, 6);
			//this.addAnimation("idle", "archoSurvival/sprites/Enemies/Archo/pisto", "png", 1, false, 6);
			this.addAnimation("derecha", "archoSurvival/sprites/Enemies/Archo/derecha", "png", 3, true, 6);
			this.addAnimation("izquierda", "archoSurvival/sprites/Enemies/Archo/izquierda", "png", 3, true, 6);
			this.playAnimation("derecha");
			this.setElasticidad(0.25);
			this.enableColisionDetection();
			
		}
		
	})();
	(function () {
		FProjectil = function(xpos, ypos, xspeed, yspeed)
		{
			FEntity.call(this, "projectil");
			this.MyClassTypeName = "FProjectil";
			this.setWorldX(xpos);
			this.setWorldY(ypos);
			this.projInit(xspeed, yspeed);
			this.destroyWhenOutside = true; //Va a ser destruido cuando esta fuera del mapa :D
		}
		
		fHeredarProto(FEntity, FProjectil);
		
		FProjectil.prototype.projInit = function(velx, vely)
		{
			this.addAnimation("idle", "archoSurvival/sprites/Enemies/Archo/pisto", "png", 1, false, 6);
			this.playAnimation("idle");
			this.setVelX(velx);
			this.setVelY(vely);
			this.enableColisionDetection();
			this.setSolid(false);
			this.setGravity(true);
		}
	})();
	var Archo = new FArcho(); //Creo una nueva entidad
	//Archo.addVelX(50.0);
	//Archo.listenMouseEvents(true);
	//Archo.onClick = function() { alert("caconia"); }
	var MiPlataforma = new FPlataforma(350, 600, 600, 0, GameUtil.metersToPixels(3));  


	//Informacion del mapa 1
	var	E1M1 = new FMap("HellShit");
	Archo.setWorldX(232);
	Archo.setWorldY(37);
	E1M1.addEntity(Archo);
	loadMap_HellShit(E1M1);
	alert("lol");
	
	/*E1M1.addEntity(new FBloque(0, 200));
	E1M1.addEntity(new FBloque(50, 200));
	E1M1.addEntity(new FItem(150, 90));
	E1M1.addEntity(new FItem(550, 90));
	E1M1.addEntity(new FItem(275, 90));
	E1M1.addEntity(new FItem(370, 565));
	E1M1.addEntity(new FItem(370, 355));
	E1M1.addEntity(new FBloque(0, 350));
	E1M1.addEntity(new FBloque(50, 350));
	E1M1.addEntity(new FBloque(50, 400));
	E1M1.addEntity(new FBloque(50, 450));
	E1M1.addEntity(new FBloque(50, 500));
	E1M1.addEntity(new FBloque(50, 550));
	E1M1.addEntity(new FBloque(50, 600));
	E1M1.addEntity(new FBloque(100, 600));
	E1M1.addEntity(new FBloque(150, 600));
	E1M1.addEntity(new FBloque(200, 600));
	E1M1.addEntity(new FBloque(250, 600));
	E1M1.addEntity(new FBloque(300, 600));
	E1M1.addEntity(new FBloque(350, 150));
	E1M1.addEntity(new FBloque(400, 150));
	E1M1.addEntity(new FPlataforma(450, 150, 700, 0, GameUtil.metersToPixels(2)));
	E1M1.addEntity(new FPlataforma(500, 150, 750, 0, GameUtil.metersToPixels(2)));
	E1M1.addEntity(new FPlataforma(550, 150, 800, 0, GameUtil.metersToPixels(2)));
	E1M1.addEntity(new FBloque(450, 400));
	E1M1.addEntity(new FBloque(400, 400));
	E1M1.addEntity(new FBloque(350, 400));
	E1M1.addEntity(new FBloque(300, 400));
	E1M1.addEntity(new FBloque(250, 400));
	E1M1.addEntity(new FBloque(350, 200));
	E1M1.addEntity(new FBloque(350, 250));
	E1M1.addEntity(new FBloque(300, 250));
	E1M1.addEntity(new FBloque(250, 250));
	E1M1.addEntity(new FBloque(520, 700));
	E1M1.addEntity(new FBloque(550, 300));
	E1M1.addEntity(new FBloque(650, 600));
	E1M1.addEntity(new FBloque(650, 350));
	E1M1.addEntity(new FBloque(850, 400));
	E1M1.addEntity(new FBloque(750, 500));
	

	E1M1.addEntity(new FItem(1360, 350));
	E1M1.addEntity(new FPlataforma(900, 400, 1300, 0, GameUtil.metersToPixels(2)));
	
	E1M1.addEntity(new FBloque(1350, 350));
	E1M1.addEntity(new FBloque(1350, 400));
	E1M1.addEntity(new FBloque(1400, 400));
	E1M1.addEntity(new FBloque(1450, 400));
	E1M1.addEntity(new FBloque(1500, 400));
	E1M1.addEntity(new FBloque(1550, 400));
	E1M1.addEntity(new FBloque(1550, 350));
	E1M1.addEntity(new FBloque(1550, 300));
	
	E1M1.addEntity(new FBloque(1550, 250));
	E1M1.addEntity(new FBloque(1550, 200));
	E1M1.addEntity(new FBloque(1500, 200));
	E1M1.addEntity(new FBloque(1450, 200));
	E1M1.addEntity(new FBloque(1400, 200));
	E1M1.addEntity(new FBloque(1350, 200));
	
	E1M1.addEntity(MiPlataforma);*/


	var	E1M2 = new FMap("E1M2");
	E1M2.addEntity(new FBloque(0, 200));
	E1M2.addEntity(new FBloque(50, 200));
	E1M2.addEntity(new FItem(150, 90));
	E1M2.addEntity(new FItem(550, 90));
	E1M2.addEntity(new FItem(275, 90));
	E1M2.addEntity(new FItem(370, 565));
	E1M2.addEntity(Archo);
	
	miJuego.addMap(E1M1);
	miJuego.addMap(E1M2);

	miJuego.loadMap("HellShit");
	miJuego.addNewCamera(1, 0, 0, true);
	miJuego.focusCameraOnEntity(1, Archo)
	
	mapScoreLimit = miJuego.entityCount("item");
	//miJuego.loadMap("E1M2");

	Archo.addTimeout(function(tthis) { return function() {
			ArchoMain(tthis);
			//alert("lol");
	}; }(Archo), Archo.getFPS(), 150);
	//Paint para el final de todo!!
	
	MiValor = new FDinamicValue(0);

	var miHud = new FHudRect(0.95, 0.95, 0.2, 0.05, MiValor, mapScoreLimit, FGAME_HUD_ALIGNDER, FGAME_HUD_ALIGNBOTTOM);
	//miHud.align = FGAME_HUD_ALIGNDER;
	miJuego.addHudElement(miHud);
	miJuego.paint();
	
	miJuego.addTimeout(function(tthis) { return function() {
			tthis.exportsObjectsToJSONTextArea();
			//alert("lol");
	}; }(miJuego), 5000, 150);
	
	//alert(miJuego.exportsObjectsToJSON());
	//alert("cacusa");
}
function ArchoMain(arch)
{
	if (miJuego.getScore()  == mapScoreLimit)
	{
			DebugTool.setMessage("Mapa completado!!");
		gameTimer.addTimeout(function(tjuego) { return function() {
		
		
			var archPlayer = new FArcho();
			tjuego.nextMap();
			tjuego.addEntity(archPlayer);
			mapScoreLimit = miJuego.entityCount("item");
			archPlayer.addTimeout(function(tthis) { return function() {
				ArchoMain(tthis);
				//alert("lol");
			}; }(archPlayer), archPlayer.getFPS(), 150);
		
			tjuego.paint();
		}; }(miJuego), 3000, 1);
		return;
	}
	var keysPresseds = arch.getKeyCharPressed();
	var i, len, noMovement;
	//var canArchJump = arch.canIJump(); - Usar en caso de bajo rendimiento
	noMovement = true;
	//alert("las");
	//DebugTool.setMessage(keysPresseds.length);
	if (arch.getWorldY() > 2000)
	{
		arch.setWorldY(0);
		arch.setWorldX(0);
		arch.setVelY(0, true);
		arch.setVelX(0, true);
	}
	if (keysPresseds.length > 0)
	{
		//alert(keysPresseds.length);

	for (i=0, len=keysPresseds.length; i < len; i++)
	{
		//DebugTool.setMessage(keysPresseds[i]);
		switch (keysPresseds[i].toLowerCase())
		{
			case 'w':
				if (miJuego.isGamePaused())
					break;
				if (arch.canIJump())
				{

					arch.setVelY(GameUtil.metersToPixels(-9.81));
					//arch.playAnimation("idle");
					//DebugTool.addMessage("saltar" + GameUtil.metersToPixels(-9.81));
				}
				/*
				noMovement = false;
				//arch.getUserVelX();
				if ((arch.canIJump() && arch.getUserVelY() > GameUtil.metersToPixels(-arch.maxXUserSpeed)) || (!arch.canIJump() && arch.getUserVelY() > GameUtil.metersToPixels(-arch.maxXUserSpeed*arch.airControl)))
				{
					if (arch.canIJump())
						arch.addUserVelY(-15.0);
					else
						arch.addUserVelY(-15.0*arch.airControl);
				}*/
			break;
			case  's':
				if (miJuego.isGamePaused())
					break;
				/*if ((arch.canIJump() && arch.getUserVelY() < GameUtil.metersToPixels(arch.maxXUserSpeed)) || (!arch.canIJump() && arch.getUserVelY() < GameUtil.metersToPixels(arch.maxXUserSpeed*arch.airControl)))
				{
					if (arch.canIJump())
						arch.addUserVelY(15.0);
					else
						arch.addUserVelY(15.0*arch.airControl);
				}
				*/
			break;
			case 'd':
				if (miJuego.isGamePaused())
					break;
				noMovement = false;
				//arch.getUserVelX();
				if ((arch.canIJump() && arch.getUserVelX() < GameUtil.metersToPixels(arch.maxXUserSpeed)) || (!arch.canIJump() && arch.getUserVelX() < GameUtil.metersToPixels(arch.maxXUserSpeed*arch.airControl)))
				{
					if (arch.canIJump())
						arch.addUserVelX(15.0);
					else
						arch.addUserVelX(15.0*arch.airControl);
				}
				arch.playAnimation("derecha");
			break;
			case 'a':
				if (miJuego.isGamePaused())
					break;
				noMovement = false;
				//arch.getUserVelX();
				if ((arch.canIJump() && arch.getUserVelX() > GameUtil.metersToPixels(-arch.maxXUserSpeed)) || (!arch.canIJump() && arch.getUserVelX() > GameUtil.metersToPixels(-arch.maxXUserSpeed*arch.airControl)))
				{
					if (arch.canIJump())
						arch.addUserVelX(-15.0);
					else
						arch.addUserVelX(-15.0*arch.airControl);
				}
				arch.playAnimation("izquierda");
			break;
			case 'p':
				if (pauseTimer > 0)
					break;
				if (!miJuego.isGamePaused())
					miJuego.pauseGame();
				else
					miJuego.resumeGame();
				pauseTimer = 25;

			break;
			case 'r': //disparar
				if (shootTime > 0)
					break;
				
				var velVector = (new FCoord(0, -1)).getPerpendicular();
				//velVector.rotar(arch.getAngleWithPoint(new FCoord(300, 200)));
				velVector.convertToUnitaryVector();

				if (arch.isAnimPlaying("izquierda"))
				{
					velVector.setY(-velVector.getY());
					velVector.setX(-velVector.getX());
				}
				//DebugTool.setMessage(velVector.getY());
				var Proj = new FProjectil(arch.getWorldX(), arch.getWorldY(), GameUtil.metersToPixels(15.0)*velVector.getX(), GameUtil.metersToPixels(15.0)*velVector.getY());
				Proj.onColision = function(tproj) {
					return function() { 
						if(tproj.getColisionWithClass("archo"))
							return;
						tproj.getColisionWith().destroy();
						tproj.destroy();
					};
				}(Proj);
				//velVector = velVector.getPerpendicular();
				miJuego.addEntity(Proj);
				shootTime = arch.shootWait;
			break;
		
		}
	}
	}
	if (pauseTimer > 0)
			pauseTimer--;
	if (shootTime > 0)
		shootTime--;
	if (!miJuego.isGamePaused())
	{
	if (noMovement && arch.canIJump())
	{
		if (arch.getUserVelX() > 5.0)
		{
			arch.addUserVelX(-4.0);
		} else if (arch.getUserVelX() < -5.0) {
			arch.addUserVelX(4.0);
		} else {
			arch.setUserVelX(0.0);
		}
	}

	if (arch.getColisionWithClass("item"))
	{
		arch.getColisionWithClass("item").destroy();
		miJuego.addScore(1);
		MiValor.setValue(MiValor.getValue()+1);
		DebugTool.destroyMessage();
		//alert("aca no llego ya mepa DX");
	}
		//DebugTool.setMessage("Score: " + miJuego.getScore() + " / " + mapScoreLimit);
		//DebugTool.setMessage("Angulo con: p(0, 0): " + arch.getAngleWithPoint(new FCoord(300, 200)));
		//arch.rotar(arch.getAngleWithPoint(new FCoord(300, 200)));
	} else {
		DebugTool.setMessage("Juego en pausa");
	}
	/*switch (arch.getKeyCharPressed())
	{
		case 'w':
			DebugTool.setTimeMessage(arch.getKeyCharPressed(), 150);
			if (!arch.isFalling())
				arch.addVelY(50);
		break;
	}*/
	
	arch.addTimeout(function(tthis) { return function() {
			ArchoMain(tthis);
			//alert("lol");
	}; }(arch), arch.getFPS(), 150)
}


Base.setCallback(Iniciar); //Se ejecuta Iniciar una vez que las librerias estan lista