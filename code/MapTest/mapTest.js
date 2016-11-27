/*
** [CODIGO GENERADO AUTOMATICAMENTE POR Stradex Engine: Map System] **
*Para poder importar este mapa simplemente se debe llamar a la funcion creada desde el MAIN del juego
* y pasarle como parametro un FMap
*/

function loadMap_HellShit(tMap)
{
	var tmpEntity;

	tMap.changeName("HellShit");
	//tMap.setResolution(1024, 768);

	//Objeto nro 1
	/*tmpEntity = new FArcho();
	tmpEntity.onSpawn = function()
 	{
		FArcho.prototype.onSpawn.call(this);
		this.playAnimation("derecha");
		this.setWorldX(232);
		this.setWorldY(37);

	};
	tMap.addEntity(tmpEntity);*/

	//Objeto nro 2
	tmpEntity = new FBloque(10, 10);
	tmpEntity.setZIndex(2);
	tmpEntity.onSpawn = function()
 	{
		FBloque.prototype.onSpawn.call(this);
		this.playAnimation("idle");
		this.setWorldX(226);
		this.setWorldY(108);

	};
	tMap.addEntity(tmpEntity);

	//Objeto nro 3
	tmpEntity = new FBloque(10, 10);
	tmpEntity.setZIndex(2);
	tmpEntity.onSpawn = function()
 	{
		FBloque.prototype.onSpawn.call(this);
		this.playAnimation("idle");
		this.setWorldX(326);
		this.setWorldY(109);

	};
	tMap.addEntity(tmpEntity);

	//Objeto nro 4
	tmpEntity = new FBloque(10, 10);
	tmpEntity.setZIndex(2);
	tmpEntity.onSpawn = function()
 	{
		FBloque.prototype.onSpawn.call(this);
		this.playAnimation("idle");
		this.setWorldX(275);
		this.setWorldY(109);

	};
	tMap.addEntity(tmpEntity);

	//Objeto nro 5
	tmpEntity = new FBloque(10, 10);
	tmpEntity.setZIndex(2);
	tmpEntity.onSpawn = function()
 	{
		FBloque.prototype.onSpawn.call(this);
		this.playAnimation("idle");
		this.setWorldX(504);
		this.setWorldY(393);

	};
	tMap.addEntity(tmpEntity);

	//Objeto nro 6
	tmpEntity = new FItem(1, 1);
	tmpEntity.setZIndex(2);
	tmpEntity.onSpawn = function()
 	{
		FItem.prototype.onSpawn.call(this);
		this.playAnimation("idle");
		this.setWorldX(511);
		this.setWorldY(364);

	};
	tMap.addEntity(tmpEntity);

	//Objeto nro 7
	tmpEntity = new FPlataforma(0, 0, 150, 0, 100);
	tmpEntity.onSpawn = function()
 	{
		FPlataforma.prototype.onSpawn.call(this);
		this.playAnimation("idle");
		this.setWorldX(377);
		this.setWorldY(110);

	};
	tMap.addEntity(tmpEntity);

}