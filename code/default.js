
var tmp;
var tfather = 0;
var dExecs = 0;
/*
var Imagenes = new Array("design/low_alexander.jpg", "design/low_TESTEO.jpg", "design/low_spqr.jpg", "design/low_castor_and_polux.jpg", "design/low_sombrero.jpg");*/

var Imagenes = new Array("design/empresa.jpg", "design/excavaciones.jpg", "design/inicio.jpg", "design/demoliciones.jpg", "design/revestimientos.jpg", "design/techos.jpg");
function Iniciar()
{
	var Telem = new FObject(document.getElementById("elem"));
	var cacun = new FEntity(document.getElementById("archo"));
	cacun.addAnimation("derecha", "archoSurvival/sprites/Enemies/Archo/derecha", "png", 3, true, 6);
	cacun.addAnimation("death", "archoSurvival/sprites/Enemies/Archo/death", "png", 8, true, 6);
	cacun.addAnimation("izquierda", "archoSurvival/sprites/Enemies/Archo/izquierda", "png", 3, true, 6);
	cacun.playAnimation("derecha");
	Telem.setWidth(80, true);
	Telem.setHeight(80, true);
	Telem.setOpacity(1.0);
	Telem.setObjSize();
	Telem.center(true, true);
	
	tmp = new FObject(document.getElementById("test"));
	var Father = new FObject(tmp.obj.parentNode);
	//new FImage("design/TESTEO.jpg");
	$(Telem.obj).css("background-repeat", "no-repeat");
	$(Telem.obj).css("background-size", "100% auto");
	Telem.smartSetBackgroundImage("design/alexander.jpg");
	var Hijos = Telem.getChildsCSS("div#miid.clase >a.test");
	tfather = new FObject(tmp.obj.parentNode);
	tmp.addEvent('FMouseOver', miFunc, [0, 1]);
	tmp.addEvent('FMouseOut', miFunc, [0, 1]); 
	//tmp.setDragMode(true, true);
	tmp.resize(300, 300, 1000, false, true);
	var CordA = new FCoord(2, 2);
	var CordB = new FCoord(3, 4);
	var CordC = new FCoord(1, 3);
	$(tmp.obj).css('background', 'none');
	tmp.setBackgroundImage("design/911 Please.JPG");
	tmp.transBackgroundImage("design/3D bug.png", 2500, 1);
	//CordB.mode = true;
	CordB.getDOMObjPos(document.getElementById("test"), true);
	var div = document.createElement("div");
	div.style.width = "150px";
	div.style.height = "150px";
	div.style.position = "absolute";
	div.style.background = "#ff0000";
	div.style.zIndex = 5;
	div.style.left = tmp.getPosXCSS(true);
	div.style.top = tmp.getPosYCSS(true);
	document.body.appendChild(div);
	var objDiv = new FObject(div);
	var TWin = new FWin();
	TWin.autoRefresh(true);
	//testFunc(TWin);
	//alert(CordA.distance(CordB));
	//alert(CordA.distance(CordC));
	//tmp.addCSS("padding: 50px");
	tmp.fadeOut(5000);
	//tmp.mover(10, 100, 1500, true, true);
	tmp.moveTo(Telem, 5000, true, true);
	var Caca = new FObject(document.getElementById("caca"));
	Caca.smartSetImage("design/TESTEO.jpg");
	
	var Galeria = new FGalery(document.getElementById("mygalery"), Imagenes);
	Galeria.tMode = 4;
	Galeria.touchScroll = true;
	var GaleriaTwo = new FGalery(document.getElementById("mygalery2"), Imagenes);
	GaleriaTwo.tMode = 2;
	GaleriaTwo.touchScroll = true;
	var GaleriaThree = new FGalery(document.getElementById("mygalery3"), Imagenes);
	GaleriaThree.tMode = 0;
	GaleriaThree.touchScroll = true;

	//tmp.transZoom(5000, 5.1);
	//tmp.transRotar(5000, -45);
	//tmp.loopAll();
}
function testFunc(tWin)
{
	var Area = tWin.visibleArea();
	//tfather.refreshData();
	//alert(tmp.inVisibleArea());
	//alert(tmp.isInside(tfather));
	setTimeout(function(t_func, t_win) { return function() {
		t_func(t_win);
	}; }(arguments.callee, tWin), 10000);

	
}
function miFunc(elem, evento, params, idEvent)
{
	switch (evento.type)
	{
		case 'mouseover':

			//elem.addCSS("border: 2px solid #fa0000;");
			elem.fadeIn(500);
			//elem.transRotar(5000, 765, true);
			elem.transBackgroundImage("design/911 Please.JPG", 1500, 2)
			//elem.transZoom(5000, 5.5, true);
		break;
		case 'mouseout':
			//elem.clearCSS();
			elem.fadeOut(500, 0.75);
			//elem.transRotar(5000, -45, true);
			elem.transBackgroundImage("design/3D bug.png", 1500, 2);
			//elem.reverseAll();
			//elem.transZoom(5000, 1.0, true);
		break;
	}
	//elem.removeEvent(idEvent);
}

Base.setCallback(Iniciar); //Se ejecuta Iniciar una vez que las librerias estan listas
