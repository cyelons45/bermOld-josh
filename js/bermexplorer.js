      	dojo.require("dijit.layout.BorderContainer");
      	dojo.require("dijit.layout.ContentPane");
      	dojo.require("esri.map");
      	dojo.require("dijit.layout.TabContainer");
      	dojo.require("esri.tasks.query");
      	dojo.require("dojo.dom");
      	dojo.require("dojo.on");
      	dojo.require("dojo.domReady");
      	dojo.require("dojo.parser");
      	dojo.require("dijit.Toolbar");
      	dojo.require("dijit.form.Button");
      	dojo.require("esri.toolbars.draw");
      	dojo.require("dijit.dijit"); // optimize: load dijit layer
      	dojo.require("esri.dijit.BasemapToggle");
      	dojo.require("esri.urlUtils");
      	dojo.require("esri.config");
      	dojo.require("esri.layers.FeatureLayer");
      	dojo.require("esri.layers.LabelLayer");
      	dojo.require("dojox.layout.ExpandoPane");
      	dojo.require("dijit.layout.AccordionContainer");
      	dojo.require("esri.dijit.HomeButton");
      	dojo.require("dojox.widget.TitleGroup");
      	dojo.require("dijit.TitlePane");
      	dojo.require("dijit.form.CheckBox");










      	var map, queryTask, monument, coll_date, beacharea, beacharea2, viewData, CRT_TXT, gapLayer14, featureLayer14, overlapLayer14, gapLayer15, featureLayer15, overlapLayer15, gapLayer16, featureLayer16, overlapLayer16,
      	    gapLayer17, featureLayer17, overlapLayer17, gapLayer18, featureLayer18, overlapLayer18, featureLayerAll;

      	var OVERLAY_TRAILS; // an ArcGIS Dynamic Service Layer showing the trails
      	var HIGHLIGHT_TRAIL; // Graphics layer showing a highlight on the selected trail, e.g. on clicking a trail
      	var HIGHLIGHT_MARKER; // Graphics layer showing a marker over the selected highlighted trail, e.g. on cursor movement over the elevation chart
      	var HIGHLIGHT_TRAIL_SYMBOL; // a symbol for the 1 Graphic that will be present in HIGHLIGHT_TRAIL
      	var HIGHLIGHT_MARKER_SYMBOL; // a symbol for the 1 Graphic that will be present in HIGHLIGHT_MARKER

      	var HIGHLIGHT_COLOR = [255, 255, 0]; // when a trail segment is clicked and highlighted, what color highlight?
      	var HIGHLIGHT_COLOR2 = [255, 0, 0]; // when a trail's elevation profile is used, what color marker to indicate the location?

      	function init() {

      	    viewData = "radio2014";

      	    //    esri.urlUtils.addProxyRule({
      	    //          urlPrefix: "gis.dhec.sc.gov/arcgis/rest/services/",
      	    //          proxyUrl: "/proxy40/proxy.ashx"
      	    //        });

      	    var startExtent = new esri.geometry.Extent({ "xmin": -9067189.9263, "ymin": 3763300.4847, "xmax": -8688062.2660, "ymax": 4023186.3808, "spatialReference": { wkid: 102100 } });
      	    map = new esri.Map("mapdiv", {
      	        extent: startExtent,
      	        showAttribution: false,
      	        basemap: "satellite"
      	    });

      	    var basemapToggle = new esri.dijit.BasemapToggle({
      	        map: map,
      	        basemap: "streets"
      	    }, "BasemapToggle");

      	    basemapToggle.startup();




      	    esri.config.defaults.map.logoLink = "http://www.scdhec.gov/"

      	    dojo.connect(map, "onLoad", function() {
      	        var initExtent = map.extent;
      	        dojo.create("div", {
      	            className: "esriSimpleSliderHomeButton",
      	            onclick: function() {
      	                map.graphics.clear();
      	                map.setExtent(initExtent);
      	                HIGHLIGHT_TRAIL.clear();
      	                document.getElementById("elevationgraph").innerHTML = "";
      	                HidePrint();
      	                if (dijit.byId("footer")._showing) {
      	                    toggleChartHeight();
      	                }
      	            }
      	        }, dojo.query(".esriSimpleSliderIncrementButton")[0], "after");
      	    });

      	    dojo.connect(map, "onExtentChange", function() {
      	        var contentId = document.getElementById("tocDiv");
      	        var scale = esri.geometry.getScale(map);
      	        //alert (scale);
      	        if (scale < 150001) { esri.show(contentId); } else { esri.hide(contentId); }
      	    });

      	    // gsvc = new esri.tasks.GeometryService("https://gis.dhec.sc.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
      	    gsvc = new esri.tasks.GeometryService("https://giswebtest.dhec.sc.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
      	    esri.show(divSplashScreenContainer);

      	    //Add beach point layer

      	    var bermbeachLayer = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/5", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(bermbeachLayer);
      	    dojo.connect(bermbeachLayer, "onClick", function(event) {
      	        handleBeachClick(event);

      	    });


      	    var textSymbol = {
      	        type: "text", // autocasts as new TextSymbol()
      	        color: [255, 255, 255],
      	        haloColor: [51, 204, 51],
      	        haloSize: 50,
      	        text: '${Name}',
      	        xoffset: 32,
      	        yoffset: -5,
      	        font: { // autocast as new Font()
      	            size: 6,
      	            family: "esri.symbol.Font.STYLE_BOLD, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,Verdana",
      	            weight: "bold"
      	        }
      	    };
      	    var labsymbol = new esri.symbol.TextSymbol(textSymbol);
      	    var labrenderer = new esri.renderer.SimpleRenderer(labsymbol);
      	    var labelLayer = new esri.layers.LabelLayer();
      	    labelLayer.addFeatureLayer(bermbeachLayer, labrenderer);
      	    map.addLayer(labelLayer);


      	    var MonumentLayer = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/23", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(MonumentLayer);

      	    var textSymbol = {
      	        type: "text", // autocasts as new TextSymbol()
      	        color: [255, 255, 255],
      	        haloColor: [51, 204, 51],
      	        haloSize: 50,
      	        text: '${TRAN_ID}',
      	        xoffset: 1,
      	        yoffset: 5,
      	        font: { // autocast as new Font()
      	            size: 6,
      	            family: "esri.symbol.Font.STYLE_BOLD, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,Verdana",
      	            weight: "bold"
      	        }
      	    };
      	    var labsymbol = new esri.symbol.TextSymbol(textSymbol);

      	    var labrenderer = new esri.renderer.SimpleRenderer(labsymbol);
      	    var labelLayer = new esri.layers.LabelLayer();
      	    labelLayer.addFeatureLayer(MonumentLayer, labrenderer);
      	    map.addLayer(labelLayer);






      	    //****************************************************************************************** */
      	    // GAP LAYERS
      	    gapLayer14 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/3", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(gapLayer14);

      	    gapLayer15 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/9", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(gapLayer15);

      	    gapLayer15.hide();


      	    gapLayer16 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/14", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(gapLayer16);

      	    gapLayer16.hide();

      	    gapLayer17 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/18", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(gapLayer17);

      	    gapLayer17.hide();

      	    gapLayer18 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/22", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(gapLayer18);

      	    gapLayer18.hide();

      	    // Adding Transacts to map
      	    featureLayer14 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/2", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(featureLayer14);

      	    dojo.connect(featureLayer14, "onClick", function(event) {
      	        handleMapClick(event);
      	    });

      	    featureLayer15 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/8", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(featureLayer15);

      	    featureLayer15.hide();

      	    dojo.connect(featureLayer15, "onClick", function(event) {
      	        handleMapClick(event);
      	    });


      	    featureLayer16 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/13", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(featureLayer16);

      	    featureLayer16.hide();

      	    dojo.connect(featureLayer16, "onClick", function(event) {
      	        handleMapClick(event);
      	    });


      	    featureLayer17 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/17", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(featureLayer17);

      	    featureLayer17.hide();

      	    dojo.connect(featureLayer17, "onClick", function(event) {
      	        handleMapClick(event);
      	    });

      	    featureLayer18 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/21", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(featureLayer18);

      	    featureLayer18.hide();

      	    dojo.connect(featureLayer18, "onClick", function(event) {
      	        handleMapClick(event);
      	    });


      	    // OVERL_CONTIG LAYER TO MAP
      	    overlapLayer14 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/1", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(overlapLayer14);



      	    overlapLayer15 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/7", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(overlapLayer15);

      	    overlapLayer15.hide();


      	    overlapLayer16 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/12", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(overlapLayer16);

      	    overlapLayer16.hide();

      	    overlapLayer17 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/16", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(overlapLayer17);

      	    overlapLayer17.hide();

      	    overlapLayer18 = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/20", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(overlapLayer18);

      	    overlapLayer18.hide();


      	    //ADDING BERMLINES LAYER TO MAP
      	    featureLayerAll = new esri.layers.FeatureLayer("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/10", {

      	        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      	        //          infoTemplate: popupTemplate2,
      	        outFields: ["*"]
      	    });


      	    map.addLayer(featureLayerAll);

      	    featureLayerAll.hide();

      	    dojo.connect(featureLayerAll, "onClick", function(event) {
      	        handleCompareClick(event);
      	        //alert("not yet");
      	    });




      	    //reset map extent after chart div expands
      	    map.on("resize", function(extent) {

      	        var resizeTimer;

      	        var divExtent = new esri.geometry.Extent(map.extent.xmin, map.extent.ymin, map.extent.xmax, map.extent.ymax,
      	            new esri.SpatialReference({ wkid: 102100 }));

      	        clearTimeout(resizeTimer);
      	        resizeTimer = setTimeout(function() {

      	            map.setExtent(divExtent);

      	        }, 500);

      	    });



      	    dojo.connect(bermbeachLayer, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(bermbeachLayer, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });


      	    dojo.connect(featureLayer14, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(featureLayer14, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });

      	    dojo.connect(featureLayer15, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(featureLayer15, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });

      	    dojo.connect(featureLayer16, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(featureLayer16, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });


      	    dojo.connect(featureLayer17, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(featureLayer17, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });


      	    dojo.connect(featureLayer18, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(featureLayer18, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });




      	    dojo.connect(featureLayerAll, "onMouseOver", function() {
      	        map.setMapCursor("pointer");
      	    });

      	    dojo.connect(featureLayerAll, "onMouseOut", function() {
      	        map.setMapCursor("default");
      	    });



      	    HIGHLIGHT_TRAIL = new esri.layers.GraphicsLayer({ opacity: 0.50 });
      	    HIGHLIGHT_MARKER = new esri.layers.GraphicsLayer();
      	    map.addLayer(HIGHLIGHT_TRAIL);
      	    map.addLayer(HIGHLIGHT_MARKER);
      	    var outline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1);
      	    HIGHLIGHT_MARKER_SYMBOL = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, outline, new dojo.Color(HIGHLIGHT_COLOR2));
      	    HIGHLIGHT_TRAIL_SYMBOL = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(HIGHLIGHT_COLOR), 8);


      	}

      	function hideSplash() {
      	    esri.hide(divSplashScreenContainer);
      	}


      	function handleMapClick(event) {

      	    // compose the query: just the name field, and in this 50 meter "radius" from our click
      	    var query = new esri.tasks.Query();
      	    query.returnGeometry = true;
      	    query.outFields = ["*"];
      	    query.geometry = new esri.geometry.Extent({
      	        "xmin": event.mapPoint.x - 50,
      	        "ymin": event.mapPoint.y - 50,
      	        "xmax": event.mapPoint.x + 50,
      	        "ymax": event.mapPoint.y + 50,
      	        "spatialReference": event.mapPoint.spatialReference
      	    });
      	    //ADD TRANSACTS
      	    if (viewData === "radio2014") {
      	        var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/2");
      	    }

      	    if (viewData === "radio2015") {
      	        var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/8");
      	    }
      	    if (viewData === "radio2016") {
      	        var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/13");
      	    }
      	    if (viewData === "radio2017") {
      	        var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/17");
      	    }
      	    if (viewData === "radio2018") {
      	        var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/21");
      	    }


      	    //    var task = new esri.tasks.QueryTask("https://gis.dhec.sc.gov/arcgis/rest/services/environment/BERM16/MapServer/2");
      	    //    var task = new esri.tasks.QueryTask("https://gis.dhec.sc.gov/arcgis/rest/services/environment/BERM16/MapServer/8");
      	    task.execute(query, function(featureSet) {
      	        handleMapClickResults(featureSet);
      	    });
      	}

      	// handle the Query result
      	function handleMapClickResults(features) {
      	    // start by clearing previous results
      	    HIGHLIGHT_TRAIL.clear();
      	    HIGHLIGHT_MARKER.clear();

      	    // grab the first hit; nothing found? bail
      	    if (!features.features.length) return;
      	    var feature = features.features[0];

      	    // highlight using the given vector geometry...
      	    HIGHLIGHT_TRAIL.add(feature);
      	    feature.setSymbol(HIGHLIGHT_TRAIL_SYMBOL);
      	    var transectExtent = feature.geometry.getExtent().expand(2.0);
      	    map.setExtent(transectExtent);

      	    //    alert(feature.attributes.TRAN_ID);
      	    var beachtransectid = feature.attributes.TRAN_ID;

      	        //alert (beachtransectid);
      	    monument = feature.attributes.TRAN_ID;
      	    coll_date = feature.attributes.COL_DATE;
      	    beacharea2 = feature.attributes.BEACH;
      	    // beacharea2 = feature.attributes;
      	    CRT_TXT = beacharea2 + " - Transect " + monument + " , Collected " + coll_date;



      	    var path = []; //ADD POINTS

      	    if (viewData === "radio2014") {
      	        var tranQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/0");
      	    }

      	    if (viewData === "radio2015") {
      	        var tranQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/6");
      	    }

      	    if (viewData === "radio2016") {
      	        var tranQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/11");
      	    }
      	    if (viewData === "radio2017") {
      	        var tranQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/15");
      	    }

      	    if (viewData === "radio2018") {
      	        var tranQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/19");
      	    }
      	    //************************************************************************************************************ */






      	    // console.log(tranQueryTask)
      	    var tranQuery = new esri.tasks.Query();
      	    tranQuery.returnGeometry = true;
      	    tranQuery.outFields = ["TRAN_ID", "POINT_X", "POINT_Y", "Elevation", "DFM", "STATIC_ID"];

      	    tranQuery.where = "TRAN_ID = '" + beachtransectid + "'";

      	    tranQueryTask.execute(tranQuery, function(featureSet) {

      	        var resultFeatures = featureSet.features;
      	        var resultCount = featureSet.features.length;

      	            //alert (featureSet.features.length);
      	        for (var i = 0; i < resultCount; i++) {

      	            var featureAttributes = featureSet.features[i].attributes;

      	            pointx = featureSet.features[i].attributes["POINT_X"];
      	            pointy = featureSet.features[i].attributes["POINT_Y"];
      	            pointelev = featureSet.features[i].attributes["Elevation"];
      	            pointdist = featureSet.features[i].attributes["DFM"];
      	            pointstatid = featureSet.features[i].attributes["STATIC_ID"];
      	            path.push([pointx, pointy, pointelev, pointdist, pointstatid]);

      	        }



      	        //alert(JSON.stringify(path))
      	        var points = makeElevationProfileFromPath(path);
      	        renderElevationProfileChart(points, 'elevationgraph');

      	    });

      	    //alert(JSON.stringify(path))
      	    // ['ELEVATION'? "Elevation":"Elevation"];

      	}

      	function makeElevationProfileFromPath(path) {
      	    var start_elevft = Math.round(path[0][2]);

      	    var points = [];
      	    var total_m = 0;
      	    for (var i = 0, l = path.length; i < l; i++) {
      	        var lon = path[i][0];
      	        var lat = path[i][1];
      	        //        var elevft = Math.round( path[i][2] );
      	        var elevft = path[i][2];
      	        var dist = path[i][3];
      	        var statid = path[i][4];

      	        //Old Coordinate Distance Calculation
      	        //        if (i) {
      	        //            var plon = path[i-1][0];
      	        //            var plat = path[i-1][1];
      	        //var R = 6371; // km
      	        //var dLat = (lat-plat)*Math.PI/180;
      	        //var dLon = (lon-plon)*Math.PI/180;
      	        //var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      	        //        Math.cos(plat*Math.PI/180) * Math.cos(lat*Math.PI/180) *
      	        //        Math.sin(dLon/2) * Math.sin(dLon/2);
      	        //var c = 2 * Math.asin(Math.sqrt(a));
      	        //var d = R * c;
      	        //var slen = d
      	        //            total_m += slen;
      	        //        }

      	        //        var miles  = 3280.84 * total_m;

      	        var miles = dist;

      	        // tooltip content: elevation is +- X feet relative to the starting node
      	        var delev = Math.abs(start_elevft - elevft);
      	        delev = (elevft >= start_elevft ? '+' : '-') + delev;
      	        var text = "Elevation: " + elevft + " ft";
      	        // ready, stick it on
      	        points.push({ lon: lon, lat: lat, elevft: elevft, miles: miles, text: text, statid: statid });
      	    }
            // console.log(points)
      	    return points;
      	}



      	function renderElevationProfileChart(points, containerid) {
      	    var lowest = 1000000;
      	    var data = [];

      	    for (var i = 0, l = points.length; i < l; i++) {
      	        data.push({ x: points[i].miles, y: points[i].elevft, name: points[i].text, lon: points[i].lon, lat: points[i].lat, statid: points[i].statid });
      	        if (points[i].elevft < lowest) lowest = points[i].elevft;
      	    }
      console.log(data)
      	    Highcharts.setOptions({
      	        lang: {
      	            contextButtonTitle: 'Export PNG',
      	        }
      	    });

      	    var chart = new Highcharts.Chart({

      	        chart: {
      	            type: 'area',
      	            backgroundColor: '#416999',
      	            zoomType: 'x',
      	            marginBottom: 42,
      	            renderTo: containerid
      	        },


      	        title: {
      	            text: CRT_TXT,
      	            margin: 10,
      	            style: {
      	                color: '#FFFFFF',
      	                fontSize: '12px'
      	            }
      	        },
      	        xAxis: {
      	            title: {
      	                text: 'Distance (ft)',
      	                margin: 0,
      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            },
      	            labels: {
      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            }
      	        },
      	        yAxis: {
      	            title: {
      	                text: 'Elevation (ft)',

      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            },
      	            labels: {
      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            },
      	            tickInterval: 5,
      	            min: lowest,
      	            allowDecimals: false
      	        },
      	        legend: {
      	            enabled: false
      	        },
      	        tooltip: {
      	            crosshairs: [true, false],
      	            formatter: function() {
      	                return this.point.name;
      	            }
      	        },
      	        plotOptions: {
      	            area: {
      	                marker: {
      	                    enabled: false,
      	                    symbol: 'circle',
      	                    radius: 2,

      	                    states: {
      	                        hover: {
      	                            enabled: true
      	                        }
      	                    }
      	                }
      	            },
      	            series: {
      	                turboThreshold: 0,
      	                point: {
      	                    events: {
      	                        mouseOver: function() {
      	                            var point = new esri.geometry.Point(this.lon, this.lat, new esri.SpatialReference({ wkid: 4326 }));
      	                            if (HIGHLIGHT_MARKER.graphics.length) {
      	                                HIGHLIGHT_MARKER.graphics[0].setGeometry(point);
      	                            } else {
      	                                HIGHLIGHT_MARKER.add(new esri.Graphic(point, HIGHLIGHT_MARKER_SYMBOL));
      	                            }
      	                        }
      	                    }
      	                },
      	                events: {
      	                    mouseOut: function() {
      	                        HIGHLIGHT_MARKER.clear();
      	                    }
      	                },
      	            }
      	        },
      	        series: [{ name: 'Elevation', data: data, color: '#ddcbbb', negativeFillColor: '#99d0f3' }],
                 // series: [`${console.log(data)}`],
                // res:`console.log(${data})`
      	        exporting: {
      	            buttons: {
      	                contextButton: {
      	                    menuItems: null,
      	                    onclick: function() {
      	                        save_chart($('#elevationgraph').highcharts(), 'chart');
      	                    }
      	                }
      	            }
      	        }

      	    });

      	    //    $('#save_btn').click(function() {
      	    //        save_chart($('#elevationgraph').highcharts(), 'chart');
      	    //    });


      	    if (!dijit.byId("footer")._showing) {
      	        toggleChartHeight();
      	    }

      	    ShowPrint();

      	}

      	//Zoom to returned geometry - called at 'OnChange' event of the dropdown list
      	function zoomToBeach(beacharea) {

      	    var selectionObject = document.getElementById("BeachSelectDD");
      	    var strBeach = selectionObject.options[selectionObject.selectedIndex].value;


      	    beachvalue = strBeach;

      	    //To query Beach by name and pass to ZoomToBeachGeometry function
      	    var beachQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/4"); //****Change here****
      	    var beachQuery = new esri.tasks.Query();
      	    beachQuery.returnGeometry = true;
      	    beachQuery.outFields = ["*"];
      	    beachQuery.where = "NAME = '" + strBeach + "'";
      	    beachQueryTask.execute(beachQuery, function(featureSet) {
      	        var resultItems = [];
      	        var resultFeatures = featureSet.features;
      	        var resultCount = featureSet.features.length;



      	        map.graphics.clear();
      	        var beachgraphic = featureSet.features[0];
      	        var beachselSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([102, 178, 255, 0.6]), 9);
      	        beachgraphic.setSymbol(beachselSymbol);
      	        map.graphics.add(beachgraphic);

      	        //   map.goTo(beachQueryTask.fu)

      	        multiextent = esri.graphicsExtent(featureSet.features);

      	        map.setExtent(multiextent.expand(1.5));

      	    });
      	    HIGHLIGHT_TRAIL.clear();
      	    document.getElementById("elevationgraph").innerHTML = "";
      	    HidePrint();
      	    if (dijit.byId("footer")._showing) {
      	        toggleChartHeight();
      	    }
      	}

      	function ShowDownloadContainer() {
      	    if (dojo.coords("downloadNode").h > 0) {

      	        //alert ("closing");
      	        //alert (dojo.coords("downloadNode").h);
      	        dojo.replaceClass(dojo.byId("downloadNode"), "hideContainerHeight", "showContainerHeight");

      	    } else {

      	        //alert ("opening");
      	        //alert (dojo.coords("downloadNode").h);
      	        dojo.replaceClass(dojo.byId("downloadNode"), "showContainerHeight", "hideContainerHeight");

      	    }
      	}

      	function ShowLegendContainer() {
      	    if (dojo.coords("legendNode").h > 0) {

      	        dojo.replaceClass(dojo.byId("legendNode"), "hideContainerHeight", "showLegendContainerHeight");

      	    } else {

      	        dojo.replaceClass(dojo.byId("legendNode"), "showLegendContainerHeight", "hideContainerHeight");

      	    }
      	}

      	//Create print window

      	function CreatePrint() {
      	    //alert (beachvalue);
      	    var beachmap = monument;
      	    var printtxt = CRT_TXT;
      	    var printData = viewData;
      	    var printDataYear;
      	    window.beachmap = beachmap;
      	    window.printtxt = printtxt;
      	    window.printData = printData;
      	    window.printDataYear = printData;
      	    window.open("printMap.htm");


      	}

      	//Show print button

      	function ShowPrint() {
      	    var contentId = document.getElementById("imgPrint");
      	    contentId.style.display = "block";

      	}

      	//Hide print button

      	function HidePrint() {
      	    var contentId = document.getElementById("imgPrint");
      	    contentId.style.display = "none";
      	}

      	EXPORT_WIDTH = 1232;

      	function save_chart(chart, filename) {
      	    var render_width = EXPORT_WIDTH;
      	    var render_height = render_width * chart.chartHeight / chart.chartWidth

      	    var svg = chart.getSVG({
      	        exporting: {
      	            sourceWidth: chart.chartWidth,
      	            sourceHeight: chart.chartHeight
      	        }
      	    });


      	    var canvas = document.createElement('canvas');
      	    canvas.height = render_height;
      	    canvas.width = render_width;

      	 canvas(canvas, svg, {
      	        scaleWidth: render_width,
      	        scaleHeight: render_height,
      	        ignoreDimensions: true
      	    });

      	    download(canvas, filename + '.png');
      	}

      	function download(canvas, filename) {
      	    download_in_ie(canvas, filename) || download_with_link(canvas, filename);
      	}

      	// Works in IE10 and newer
      	function download_in_ie(canvas, filename) {
      	    return (navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob(canvas.msToBlob(), filename));
      	}

      	// Works in Chrome and FF. Safari just opens image in current window, since .download attribute is not supported
      	function download_with_link(canvas, filename) {
      	    var a = document.createElement('a')
      	    a.download = filename
      	    a.href = canvas.toDataURL("image/png")
      	    document.body.appendChild(a);
      	    a.click();
      	    a.remove();
      	}

      	function handleBeachClick(event) {

      	    // compose the query: just the name field, and in this 50 meter "radius" from our click
      	    var query = new esri.tasks.Query();


      	    query.returnGeometry = true;
      	    query.outFields = ["*"];
      	    query.geometry = new esri.geometry.Extent({
      	        "xmin": event.mapPoint.x - 5000,
      	        "ymin": event.mapPoint.y - 5000,
      	        "xmax": event.mapPoint.x + 5000,
      	        "ymax": event.mapPoint.y + 5000,
      	        "spatialReference": event.mapPoint.spatialReference
      	    });
      	    var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/5");
      	    task.execute(query, function(featureSet) {
      	        handleBeachClickResults(featureSet);
      	    });

      	}


      	// handle the Beach Click Query result
      	function handleBeachClickResults(features) {


      	    // grab the first hit; nothing found? bail
      	    if (!features.features.length) return;
      	    var feature = features.features[0];


      	    var beachSelect = feature.attributes.NAME;

      	    //To query Beach by name and pass to ZoomToBeachGeometry function
      	    var beachQueryTask = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/4"); //****Change here****
      	    var beachQuery = new esri.tasks.Query();
      	    beachQuery.returnGeometry = true;
      	    beachQuery.outFields = ["*"];
      	    beachQuery.where = "NAME = '" + beachSelect + "'";
      	    beachQueryTask.execute(beachQuery, function(featureSet) {
      	        var resultItems = [];
      	        var resultFeatures = featureSet.features;
      	        var resultCount = featureSet.features.length;


      	        map.graphics.clear();
      	        var beachgraphic = featureSet.features[0];
      	        var beachselSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([102, 178, 255, 0.6]), 9);
      	        beachgraphic.setSymbol(beachselSymbol);
      	        map.graphics.add(beachgraphic);



      	        multiextent = esri.graphicsExtent(featureSet.features);

      	        map.setExtent(multiextent.expand(1.5));

      	    });
      	    HIGHLIGHT_TRAIL.clear();
      	    document.getElementById("elevationgraph").innerHTML = "";
      	    HidePrint();
      	    if (dijit.byId("footer")._showing) {
      	        toggleChartHeight();
      	    }

      	}


      	function toggleChartHeight() {

      	    var node = dijit.byId("footer");

      	    if (node._showing) {
      	        node._hideWrapper();
      	        node._showAnim && node._showAnim.stop();
      	        node._hideAnim.play();


      	    } else {
      	        node._hideAnim && node._hideAnim.stop();
      	        node._showAnim.play();

      	    }
      	    node._showing = !node._showing;
      	    node.domNode.setAttribute("aria-expanded", node._showing);


      	}



      	//New Comparison Section


      	function handleCompareClick(event) {

      	    // compose the query: just the name field, and in this 50 meter "radius" from our click
      	    var query = new esri.tasks.Query();
      	    query.returnGeometry = true;
      	    query.outFields = ["*"];
      	    query.geometry = new esri.geometry.Extent({
      	        "xmin": event.mapPoint.x - 50,
      	        "ymin": event.mapPoint.y - 50,
      	        "xmax": event.mapPoint.x + 50,
      	        "ymax": event.mapPoint.y + 50,
      	        "spatialReference": event.mapPoint.spatialReference
      	    });


      	    var task = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/10");


      	    task.execute(query, function(featureSet) {
      	        handleCompareClickResults(featureSet);
      	    });
      	}



      	// handle the Compare Query results
      	function handleCompareClickResults(features) {
      	    // start by clearing previous results
      	    HIGHLIGHT_TRAIL.clear();
      	    HIGHLIGHT_MARKER.clear();

      	    // grab the first hit; nothing found? bail
      	    if (!features.features.length) return;
      	    var feature = features.features[0];

      	    // highlight using the given vector geometry...
      	    HIGHLIGHT_TRAIL.add(feature);
      	    feature.setSymbol(HIGHLIGHT_TRAIL_SYMBOL);
      	    var transectExtent = feature.geometry.getExtent().expand(2.0);
      	    map.setExtent(transectExtent);

      	    //    alert(feature.attributes.TRAN_ID);
      	    var beachtransectid = feature.attributes.TRAN_ID;
      	    //alert (beachtransectid);
      	    monument = feature.attributes.TRAN_ID;

      	    CRT_TXT = "Transect " + monument + " Comparison ";


      	    var comppath1 = [];
      	    var comppath2 = [];
      	    var comppath3 = [];
      	    var comppath4 = [];
      	    var comppath5 = [];


      	    var compQueryTask1 = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/0");
      	    var compQueryTask2 = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/6");
      	    var compQueryTask3 = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/11");
      	    var compQueryTask4 = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/15");
      	    var compQueryTask5 = new esri.tasks.QueryTask("https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/19");


      	    var compQuery1 = new esri.tasks.Query();
      	    compQuery1.returnGeometry = true;
      	    compQuery1.outFields = ["TRAN_ID", "POINT_X", "POINT_Y", "Elevation", "DFCP", "STATIC_ID"];
      	    compQuery1.where = "TRAN_ID = '" + beachtransectid + "'";
      	    compQueryTask1.execute(compQuery1, function(featureSet) {

      	        var compFeatures1 = featureSet.features;
      	        var compCount1 = featureSet.features.length;
      	        //alert (featureSet.features.length);
      	        for (var i = 0; i < compCount1; i++) {

      	            var featureAttributes = featureSet.features[i].attributes;

      	            pointx = featureSet.features[i].attributes["POINT_X"];
      	            pointy = featureSet.features[i].attributes["POINT_Y"];
      	            pointelev = featureSet.features[i].attributes["Elevation"];
      	            pointdist = featureSet.features[i].attributes["DFCP"];
      	            pointstatid = featureSet.features[i].attributes["STATIC_ID"];
      	            comppath1.push([pointx, pointy, pointelev, pointdist, pointstatid]);

      	        }


      	        var compQuery2 = new esri.tasks.Query();
      	        compQuery2.returnGeometry = true;
      	        compQuery2.outFields = ["TRAN_ID", "POINT_X", "POINT_Y", "Elevation", "DFCP", "STATIC_ID"];
      	        compQuery2.where = "TRAN_ID = '" + beachtransectid + "'";
      	        compQueryTask2.execute(compQuery2, function(featureSet) {

      	            var compFeatures2 = featureSet.features;
      	            var compCount2 = featureSet.features.length;
      	            //alert (featureSet.features.length);
      	            for (var i = 0; i < compCount2; i++) {

      	                var featureAttributes = featureSet.features[i].attributes;

      	                pointx = featureSet.features[i].attributes["POINT_X"];
      	                pointy = featureSet.features[i].attributes["POINT_Y"];
      	                pointelev = featureSet.features[i].attributes["Elevation"];
      	                pointdist = featureSet.features[i].attributes["DFCP"];
      	                pointstatid = featureSet.features[i].attributes["STATIC_ID"];
      	                comppath2.push([pointx, pointy, pointelev, pointdist, pointstatid]);

      	            }


      	            var compQuery3 = new esri.tasks.Query();
      	            compQuery3.returnGeometry = true;
      	            compQuery3.outFields = ["TRAN_ID", "POINT_X", "POINT_Y", "Elevation", "DFCP", "STATIC_ID"];
      	            compQuery3.where = "TRAN_ID = '" + beachtransectid + "'";
      	            compQueryTask3.execute(compQuery3, function(featureSet) {

      	                var compFeatures3 = featureSet.features;
      	                var compCount3 = featureSet.features.length;
      	                //alert (featureSet.features.length);
      	                for (var i = 0; i < compCount3; i++) {

      	                    var featureAttributes = featureSet.features[i].attributes;

      	                    pointx = featureSet.features[i].attributes["POINT_X"];
      	                    pointy = featureSet.features[i].attributes["POINT_Y"];
      	                    pointelev = featureSet.features[i].attributes["Elevation"];
      	                    pointdist = featureSet.features[i].attributes["DFCP"];
      	                    pointstatid = featureSet.features[i].attributes["STATIC_ID"];
      	                    comppath3.push([pointx, pointy, pointelev, pointdist, pointstatid]);

      	                }



      	                var compQuery4 = new esri.tasks.Query();
      	                compQuery4.returnGeometry = true;
      	                compQuery4.outFields = ["TRAN_ID", "POINT_X", "POINT_Y", "Elevation", "DFCP", "STATIC_ID"];
      	                compQuery4.where = "TRAN_ID = '" + beachtransectid + "'";
      	                compQueryTask4.execute(compQuery4, function(featureSet) {

      	                    var compFeatures4 = featureSet.features;
      	                    var compCount4 = featureSet.features.length;
      	                    //alert (featureSet.features.length);
      	                    for (var i = 0; i < compCount4; i++) {

      	                        var featureAttributes = featureSet.features[i].attributes;

      	                        pointx = featureSet.features[i].attributes["POINT_X"];
      	                        pointy = featureSet.features[i].attributes["POINT_Y"];
      	                        pointelev = featureSet.features[i].attributes["Elevation"];
      	                        pointdist = featureSet.features[i].attributes["DFCP"];
      	                        pointstatid = featureSet.features[i].attributes["STATIC_ID"];
      	                        comppath4.push([pointx, pointy, pointelev, pointdist, pointstatid]);

      	                    }


      	                    var compQuery5 = new esri.tasks.Query();
      	                    compQuery5.returnGeometry = true;
      	                    compQuery5.outFields = ["TRAN_ID", "POINT_X", "POINT_Y", "Elevation", "DFCP", "STATIC_ID"];
      	                    compQuery5.where = "TRAN_ID = '" + beachtransectid + "'";
      	                    compQueryTask5.execute(compQuery5, function(featureSet) {

      	                        var compFeatures5 = featureSet.features;
      	                        var compCount5 = featureSet.features.length;
      	                        //alert (featureSet.features.length);
      	                        for (var i = 0; i < compCount5; i++) {

      	                            var featureAttributes = featureSet.features[i].attributes;

      	                            pointx = featureSet.features[i].attributes["POINT_X"];
      	                            pointy = featureSet.features[i].attributes["POINT_Y"];
      	                            pointelev = featureSet.features[i].attributes["Elevation"];
      	                            pointdist = featureSet.features[i].attributes["DFCP"];
      	                            pointstatid = featureSet.features[i].attributes["STATIC_ID"];
      	                            comppath5.push([pointx, pointy, pointelev, pointdist, pointstatid]);

      	                        }



      	                        var points1 = makeElevationProfileFromPath(comppath1);
      	                        var points2 = makeElevationProfileFromPath(comppath2);
      	                        var points3 = makeElevationProfileFromPath(comppath3);
      	                        var points4 = makeElevationProfileFromPath(comppath4);
      	                        var points5 = makeElevationProfileFromPath(comppath5);
      	                        renderComparisonElevationProfileChart(points1, points2, points3, points4, points5, 'elevationgraph');
      	                    });

      	                });
      	            });
      	        });

      	    });

      	}




      	function renderComparisonElevationProfileChart(points1, points2, points3, points4, points5, containerid) {
      	    var lowest = 1000000;
      	    var compdata1 = [];
      	    var compdata2 = [];
      	    var compdata3 = [];
      	    var compdata4 = [];
      	    var compdata5 = [];

      	    for (var i = 0, l = points1.length; i < l; i++) {
      	        compdata1.push({ x: points1[i].miles, y: points1[i].elevft, name: points1[i].text, lon: points1[i].lon, lat: points1[i].lat });
      	        if (points1[i].elevft < lowest) lowest = points1[i].elevft;
      	    }

      	    for (var i = 0, l = points2.length; i < l; i++) {
      	        compdata2.push({ x: points2[i].miles, y: points2[i].elevft, name: points2[i].text, lon: points2[i].lon, lat: points2[i].lat });
      	        if (points2[i].elevft < lowest) lowest = points2[i].elevft;
      	    }

      	    for (var i = 0, l = points3.length; i < l; i++) {
      	        compdata3.push({ x: points3[i].miles, y: points3[i].elevft, name: points3[i].text, lon: points3[i].lon, lat: points3[i].lat });
      	        if (points3[i].elevft < lowest) lowest = points3[i].elevft;
      	    }
      	    for (var i = 0, l = points4.length; i < l; i++) {
      	        compdata4.push({ x: points4[i].miles, y: points4[i].elevft, name: points4[i].text, lon: points4[i].lon, lat: points4[i].lat });
      	        if (points4[i].elevft < lowest) lowest = points4[i].elevft;
      	    }
      	    for (var i = 0, l = points5.length; i < l; i++) {
      	        compdata5.push({ x: points5[i].miles, y: points5[i].elevft, name: points5[i].text, lon: points5[i].lon, lat: points5[i].lat });
      	        if (points5[i].elevft < lowest) lowest = points5[i].elevft;
      	    }

      	    Highcharts.setOptions({
      	        lang: {
      	            contextButtonTitle: 'Export PNG',
      	        }
      	    });

      	    var chart = new Highcharts.Chart({

      	        chart: {
      	            type: 'spline',
      	            backgroundColor: '#416999',
      	            zoomType: 'x',
      	            marginBottom: 42,
      	            renderTo: containerid
      	        },


      	        title: {
      	            text: CRT_TXT,
      	            margin: 10,

      	            style: {
      	                color: '#FFFFFF',
      	                fontSize: '12px'
      	            }
      	        },
      	        xAxis: {
      	            min: 0,
      	            title: {
      	                text: 'Distance (ft)',
      	                margin: 0,
      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            },
      	            labels: {
      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            }
      	        },
      	        yAxis: {
      	            title: {
      	                text: 'Elevation (ft)',

      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            },
      	            labels: {
      	                style: {
      	                    color: '#FFFFFF'
      	                }
      	            },
      	            tickInterval: 5,
      	            min: lowest,
      	            allowDecimals: false
      	        },
      	        legend: {
      	            enabled: true,
      	            itemStyle: {
      	                color: '#FFFFFF'
      	            },
      	            align: 'center',
      	            verticalAlign: 'top',
      	            floating: true,
      	            x: 300,
      	            y: 0
      	        },
      	        tooltip: {
      	            crosshairs: [true, false],
      	            formatter: function() {
      	                return this.point.name;
      	            }
      	        },
      	        plotOptions: {
      	            area: {
      	                marker: {
      	                    enabled: false,
      	                    symbol: 'circle',
      	                    radius: 2,

      	                    states: {
      	                        hover: {
      	                            enabled: true
      	                        }
      	                    }
      	                }
      	            },
      	            series: {
      	                turboThreshold: 0,
      	                point: {
      	                    events: {
      	                        //                        mouseOver: function() {
      	                        //                            var point = new esri.geometry.Point(this.lon,this.lat,new esri.SpatialReference({ wkid: 4326 }));
      	                        //                            if (HIGHLIGHT_MARKER.graphics.length) {
      	                        //                                HIGHLIGHT_MARKER.graphics[0].setGeometry(point);
      	                        //                            } else {
      	                        //                                HIGHLIGHT_MARKER.add(new esri.Graphic(point,HIGHLIGHT_MARKER_SYMBOL));
      	                        //                            }
      	                    }
      	                }
      	            },
      	            events: {
      	                //                    mouseOut: function() {
      	                //                        HIGHLIGHT_MARKER.clear();
      	                //                    }
      	                //                },
      	            }
      	        },
      	        series: [{ name: '2014', data: compdata1, color: '#FFA500' }, { name: '2015', data: compdata2, color: '#2FFF00' }, { name: '2016', data: compdata3, color: '#ff00ff' },
      	            { name: '2017', data: compdata4, color: '#fffc00' }, { name: '2018', data: compdata5, color: '#8B008B' }
      	        ],

      	        exporting: {
      	            buttons: {
      	                contextButton: {
      	                    menuItems: null,
      	                    onclick: function() {
      	                        save_chart($('#elevationgraph').highcharts(), 'chart');
      	                    }
      	                }
      	            }
      	        }

      	    });


      	    if (!dijit.byId("footer")._showing) {
      	        toggleChartHeight();
      	    }

      	    //ShowPrint();

      	}


      	//End New Comparison Section




      	function toggleData(mode) {

      	    HIGHLIGHT_TRAIL.clear();
      	    HIGHLIGHT_MARKER.clear();
      	    document.getElementById("elevationgraph").innerHTML = "";
      	    HidePrint();
      	    if (dijit.byId("footer")._showing) {
      	        toggleChartHeight();
      	    }

      	    if (mode === "radio2014") {
      	        viewData = "radio2014";

      	        gapLayer15.hide();
      	        featureLayer15.hide();
      	        overlapLayer15.hide();
      	        featureLayerAll.hide();

      	        gapLayer16.hide();
      	        featureLayer16.hide();
      	        overlapLayer16.hide();
      	        featureLayerAll.hide();

      	        gapLayer17.hide();
      	        featureLayer17.hide();
      	        overlapLayer17.hide();
      	        featureLayerAll.hide();

      	        gapLayer18.hide();
      	        featureLayer18.hide();
      	        overlapLayer18.hide();
      	        featureLayerAll.hide();

      	        gapLayer14.show();
      	        featureLayer14.show();
      	        overlapLayer14.show();

      	    }
      	    if (mode === "radio2015") {
      	        viewData = "radio2015";

      	        gapLayer14.hide();
      	        featureLayer14.hide();
      	        overlapLayer14.hide();
      	        featureLayerAll.hide();

      	        gapLayer16.hide();
      	        featureLayer16.hide();
      	        overlapLayer16.hide();
      	        featureLayerAll.hide();


      	        gapLayer17.hide();
      	        featureLayer17.hide();
      	        overlapLayer17.hide();
      	        featureLayerAll.hide();


      	        gapLayer18.hide();
      	        featureLayer18.hide();
      	        overlapLayer18.hide();
      	        featureLayerAll.hide();

      	        gapLayer15.show();
      	        featureLayer15.show();
      	        overlapLayer15.show();

      	    }
      	    if (mode === "radio2016") {
      	        viewData = "radio2016";

      	        gapLayer14.hide();
      	        featureLayer14.hide();
      	        overlapLayer14.hide();
      	        featureLayerAll.hide();

      	        gapLayer15.hide();
      	        featureLayer15.hide();
      	        overlapLayer15.hide();
      	        featureLayerAll.hide();


      	        gapLayer17.hide();
      	        featureLayer17.hide();
      	        overlapLayer17.hide();
      	        featureLayerAll.hide();


      	        gapLayer18.hide();
      	        featureLayer18.hide();
      	        overlapLayer18.hide();
      	        featureLayerAll.hide();


      	        gapLayer16.show();
      	        featureLayer16.show();
      	        overlapLayer16.show();

      	    }

      	    if (mode === "radio2017") {
      	        viewData = "radio2017";

      	        gapLayer14.hide();
      	        featureLayer14.hide();
      	        overlapLayer14.hide();
      	        featureLayerAll.hide();

      	        gapLayer15.hide();
      	        featureLayer15.hide();
      	        overlapLayer15.hide();
      	        featureLayerAll.hide();


      	        gapLayer16.hide();
      	        featureLayer16.hide();
      	        overlapLayer16.hide();
      	        featureLayerAll.hide();


      	        gapLayer18.hide();
      	        featureLayer18.hide();
      	        overlapLayer18.hide();
      	        featureLayerAll.hide();


      	        gapLayer17.show();
      	        featureLayer17.show();
      	        overlapLayer17.show();

      	    }

      	    if (mode === "radio2018") {
      	        viewData = "radio2018";

      	        gapLayer14.hide();
      	        featureLayer14.hide();
      	        overlapLayer14.hide();
      	        featureLayerAll.hide();

      	        gapLayer15.hide();
      	        featureLayer15.hide();
      	        overlapLayer15.hide();
      	        featureLayerAll.hide();


      	        gapLayer16.hide();
      	        featureLayer16.hide();
      	        overlapLayer16.hide();
      	        featureLayerAll.hide();


      	        gapLayer17.hide();
      	        featureLayer17.hide();
      	        overlapLayer17.hide();
      	        featureLayerAll.hide();


      	        gapLayer18.show();
      	        featureLayer18.show();
      	        overlapLayer18.show();

      	    }


      	    if (mode === "radioAll") {
      	        viewData = "radioAll";

      	        gapLayer14.hide();
      	        featureLayer14.hide();
      	        overlapLayer14.hide();
      	        gapLayer15.hide();
      	        featureLayer15.hide();
      	        overlapLayer15.hide();
      	        gapLayer16.hide();
      	        featureLayer16.hide();
      	        overlapLayer16.hide();
      	        gapLayer17.hide();
      	        featureLayer17.hide();
      	        overlapLayer17.hide();
      	        gapLayer18.hide();
      	        featureLayer18.hide();
      	        overlapLayer18.hide();
      	        featureLayerAll.show();

      	    }

      	}


      	dojo.addOnLoad(init);
