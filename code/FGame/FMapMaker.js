var MapperSystem;
var MapWorld;

var MPK_SELECTTOOL = 0;
var MPK_MOVETOOL = 1;
var MPK_MOVEMAPTOOL = 2;
var MPK_DELETETOOL = 3;
var MPK_UNDOTOOL = 4;

function startMapMaker()
{
	//Cosas sobre el diseño primero
	var btnMapProperties = new FObject(document.getElementById("btn_mapsettings"));
	var btnObjProperties = new FObject(document.getElementById("btn_objsettings"));
	
	var btnModifyMapSettings = new FObject(document.getElementById("btn_mapmodify"));
	var btnLoadMap = new FObject(document.getElementById("btn_loadmap"));


	var btnObjAdd = new FObject(document.getElementById("btn_addnewobj"));
	var btnObjInsert = new FObject(document.getElementById("btn_insertobj"));	
	$(document.getElementById("obj_settings")).hide();
	$(document.getElementById("map_load")).hide();
	$(document.getElementById("obj_addtomap")).hide();
		
	btnMapProperties.listenMouseEvents(true, true);
	btnObjProperties.listenMouseEvents(true, true);
	btnModifyMapSettings.listenMouseEvents(true, true);
	btnLoadMap.listenMouseEvents(true, true);
	btnObjAdd.listenMouseEvents(true, true);
	btnObjInsert.listenMouseEvents(true, true);	
	
	btnMapProperties.onClick = function()
	{
		$(document.getElementById("map_settings")).show();
		$(document.getElementById("obj_settings")).hide();
		
		$(document.getElementById("map_config")).show();
		$(document.getElementById("map_load")).hide();
		
	}
	btnLoadMap.onClick = function()
	{
		$(document.getElementById("map_config")).hide();
		$(document.getElementById("map_load")).show();
	}
	btnModifyMapSettings.onClick = function()
	{
		$(document.getElementById("map_config")).show();
		$(document.getElementById("map_load")).hide();
	}
	btnObjProperties.onClick = function()
	{
		$(document.getElementById("map_settings")).hide();
		$(document.getElementById("obj_settings")).show();
		
		$(document.getElementById("obj_loadall")).show();
		$(document.getElementById("obj_addtomap")).hide();
	}
	btnObjAdd.onClick = function()
	{
		$(document.getElementById("obj_loadall")).show();
		$(document.getElementById("obj_addtomap")).hide();
	}
	btnObjInsert.onClick = function()
	{
		$(document.getElementById("obj_loadall")).hide();
		$(document.getElementById("obj_addtomap")).show();
	}
	
	
	//Map Mapker

	MapperSystem = new FMKSystem();

	//Testeo TODO ACA ES TESTEO
	MapWorld = new FMKMap(document.getElementById("worldSpace"));

	var EjemploEntidad = new FMKEntity(250, 250);
	EjemploEntidad.setWorldX(300);
	EjemploEntidad.setWorldY(300);
	EjemploEntidad.addAnimation("idle", "archoSurvival/sprites/Player/mteleport_01.png");
	EjemploEntidad.playAnimation("idle");		

	MapWorld.paint();

	$('#select_objanims').change(objectAnimChanged);
	$('#select_objects').change(objectSelectedToAdd);
	$('#btn_loadall').click(addObjectsTypes);
	$('#btn_addobjtomap').click(addObjectToMap);

	//Work Bar
	
	(new FObject(document.getElementById("tool_select"))).listenMouseEvents(true, true);
	(new FObject(document.getElementById("tool_back"))).listenMouseEvents(true, true);
	(new FObject(document.getElementById("tool_delete"))).listenMouseEvents(true, true);
	(new FObject(document.getElementById("tool_moveentity"))).listenMouseEvents(true, true);
	(new FObject(document.getElementById("tool_movemap"))).listenMouseEvents(true, true);

	$('#tool_back').css('border', 'none');
	$('#tool_delete').css('border', 'none');
	$('#tool_moveentity').css('border', 'none');
	$('#tool_movemap').css('border', 'none');
	$('#tool_select').css('border', 'none');

	$('#tool_select').click(function() { return function() { workBarButtonSelected(MPK_SELECTTOOL); }; }());
	$('#tool_back').click(function() { return function() { workBarButtonSelected(MPK_UNDOTOOL); }; }());
	$('#tool_delete').click(function() { return function() { workBarButtonSelected(MPK_DELETETOOL); }; }());
	$('#tool_moveentity').click(function() { return function() { workBarButtonSelected(MPK_MOVETOOL); }; }());
	$('#tool_movemap').click(function() { return function() { workBarButtonSelected(MPK_MOVEMAPTOOL); }; }());

	//Propiedades del mapa
	
	$('#btn_refreshmapdata').click(refreshMapData);
	$('#btn_getmapcode').click(getMapCode);
	$('#btn_loadmapcode').click(loadMapCode);
	$('#btn_getmapexportcode').click(exportMapJSCode);

}

function loadMapCode(event)
{
	MapWorld.loadMapJSON(MapperSystem, $('#txt_allmapcode').val());
	refreshObjectsTypes();
}

function exportMapJSCode(event)
{
	//WIIII
	MapWorld.exportMapToJSTextArea(MapperSystem);
}

function getMapCode(event)
{
	MapWorld.saveMapToJSONTextArea(MapperSystem);
}

function refreshMapData(event)
{
	if ($('#txt_resx').val().length > 0 && isNumeric($('#txt_resx').val()) && $('#txt_resy').val().length > 0 && isNumeric($('#txt_resy').val()))
		MapWorld.setMapSize(parseInt($('#txt_resx').val()), parseInt($('#txt_resy').val()));
	
	if ($('#txt_dimx').val().length > 0 && isNumeric($('#txt_dimx').val()) && $('#txt_dimy').val().length > 0 && isNumeric($('#txt_dimy').val()))
		MapWorld.setMapLimits(parseInt($('#txt_dimx').val()), parseInt($('#txt_dimy').val()));

	if ($('#txt_mapname').val().replace(' ', '').length > 0)
		MapWorld.mapName = $('#txt_mapname').val();
	
	DebugTool.setTimeMessage("Información actualizada correctamente", 2500, true);
}

function workBarButtonSelected(type)
{

	MapWorld.setAction(type);
	switch(type)
	{
		case MPK_SELECTTOOL:
			$('#tool_back').css('border', 'none');
			$('#tool_delete').css('border', 'none');
			$('#tool_moveentity').css('border', 'none');
			$('#tool_movemap').css('border', 'none');
			$('#tool_select').css('border', '1px solid #9f261d');
		break;
		case MPK_MOVETOOL:
			$('#tool_back').css('border', 'none');
			$('#tool_delete').css('border', 'none');
			$('#tool_moveentity').css('border', '1px solid #9f261d');
			$('#tool_movemap').css('border', 'none');
			$('#tool_select').css('border', 'none');
		break;
		case MPK_MOVEMAPTOOL:
			$('#tool_back').css('border', 'none');
			$('#tool_delete').css('border', 'none');
			$('#tool_moveentity').css('border', 'none');
			$('#tool_movemap').css('border', '1px solid #9f261d');
			$('#tool_select').css('border', 'none');
		break;
		case MPK_DELETETOOL:
			$('#tool_back').css('border', 'none');
			$('#tool_delete').css('border', '1px solid #9f261d');
			$('#tool_moveentity').css('border', 'none');
			$('#tool_movemap').css('border', 'none');
			$('#tool_select').css('border', 'none');
		break;
		case MPK_UNDOTOOL:
			$('#tool_back').css('border', '1px solid #9f261d');
			$('#tool_delete').css('border', 'none');
			$('#tool_moveentity').css('border', 'none');
			$('#tool_movemap').css('border', 'none');
			$('#tool_select').css('border', 'none');
		break;
	}
}

function refreshObjectsTypes()
{
	var i, len, tmpData;
	
	var objectSelect = document.getElementById("select_objects");

	for (i=0, len=MapperSystem.elementsTypesCount(); i < len; i++)
	{
		tmpData = MapperSystem.getTypeAsArray(i);
		var toption = document.createElement("option");
		toption.text = tmpData[0] + " - " + tmpData[1];
		objectSelect.add(toption, i);

		//MapWorld.addEntity(MapperSystem.getTypeAsElement(i));
	}
	$('#txt_allobjsjson').val("");	
}
function addObjectsTypes(event)
{
	//alert("cagun");
	MapperSystem.decodeEntitiesJSON($('#txt_allobjsjson').val());

	refreshObjectsTypes();
	
	DebugTool.setTimeMessage("Objetos caragados correctamente", 2500, true);
}
function addObjectToMap(event)
{
	var index = $("#select_objects").prop('selectedIndex');
	if (index < 0)
		return;
	
	var animIndex = $("#select_objanims").prop('selectedIndex');
	if (animIndex < 0)
		animIndex = 0;
	
	var toAddEntity = MapperSystem.getTypeAsElement(index, animIndex);
	
	var spawnPoint =  MapWorld.getMapMiddlePoint();
	toAddEntity.setWorldX(spawnPoint.getX());
	toAddEntity.setWorldY(spawnPoint.getY());
	
	var paramsContainer = new FObject(document.getElementById("obj_parametros"));
	var paramsInputs = paramsContainer.getChildsCSS("input");
	
	var i=0, len=paramsInputs.length;
	var blankParams = false;
	for (i=0; i < len; i++)
	{
		if ($(paramsInputs[i].obj).val() == "")
		{
			blankParams = true
			toAddEntity.obj = null;
			toAddEntity = null;
			DebugTool.setTimeMessage("No se pueden dejar parametros en blanco!!!", 2500, true);
			return;
		}
		toAddEntity.setParameterVal(i, $(paramsInputs[i].obj).val());
	}

	if ($('#txt_zindex').val().length > 0 && isNumeric($('#txt_zindex').val()))
		toAddEntity.zIndex = parseInt($('#txt_zindex').val());
	
	toAddEntity.getDataArray();
	
	MapWorld.addEntity(toAddEntity);
	
}
function objectSelectedToAdd(event)
{
	var index = $("#select_objects").prop('selectedIndex');
	if (index < 0)
		return;

	var tmpData = MapperSystem.getTypeAsArray(index);
	var i=0, len=tmpData[3].length;
	//Veamos si existe alguna imagen para el objeto
	if (len > 0)
	{
		$('#obj_miniatura').css('background-image', 'url(' + tmpData[3][0][1] + ')');
		$('#select_objanims').show();
	} else {
		$('#select_objanims').hide();
	}
	$('#select_objanims').empty();
	for (i=0;  i < len; i++)
	{
		var toption = document.createElement("option");
		toption.text = tmpData[3][i][0];
		document.getElementById('select_objanims').add(toption, i);
	}
	
	$('#obj_parametros').empty();
	var totalParams = tmpData[2];

	for (i=0; i < totalParams; i++)
	{
		if (i==0)
			$('#obj_parametros').append('<div style="color: #fafafa; font-size: 0.75em; margin: 10px 0px;"><b>Parametros</b></div>');
		$('#obj_parametros').append('<input type="text" id="param_' + i + '" />');
	}
}

function objectAnimChanged(event)
{
	var elemIndex = $("#select_objects").prop('selectedIndex');
	var animIndex = $("#select_objanims").prop('selectedIndex');
	if (elemIndex < 0 && animIndex < 0)
		return;
	
	var tmpData = MapperSystem.getTypeAsArray(elemIndex);
	if (animIndex >= tmpData[3].length)
		return;
	$('#obj_miniatura').css('background-image', 'url(' + tmpData[3][animIndex][1] + ')');
}

Base.setCallback(startMapMaker);
