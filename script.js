$('#fromatob').attr('checked', false);
$('#isochrones').attr('checked', false);

var osm = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BYSA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken:
    'pk.eyJ1Ijoicm9iZXJ0ayIsImEiOiJjaWs5Z3k1ejgwOTY4djltNDV5N2NjaWwzIn0.6Htqjxd5Knc5rZQ7vOpkNw'
});

var orto = L.tileLayer('https://api.mapbox.com/styles/v1/pkoller/ck4bk97hb07971co30hd6t2w2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGtvbGxlciIsImEiOiJjazRiazZyZ2cwZWZ1M2Ruem9sMXQ0ZDF2In0.xlC7ztlp641QGxk8W7pd2w', {
maxZoom: 18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
});

var map = L.map('map',{
  center: [52.4044,16.9217],
  zoom: 9
});

osm.addTo(map);

var baseMaps = {
    "OpenStreetMap": osm,
    "Ortofotomapa": orto
};

L.control.layers(null,baseMaps,{position: 'topleft'}).addTo(map);
L.control.scale().addTo(map);

var stacje = "http://localhost:8080/geoserver/geo/wfs?service=WFS&version=1.1.0&typename=geo:stacje_kolejowe&request=GetFeature&typeNames=namespace:featuretype&outputFormat=application/json"
var tory = "http://localhost:8080/geoserver/geo/wfs?service=WFS&version=1.1.0&typename=geo:tory_kolejowe&request=GetFeature&typeNames=namespace:featuretype&outputFormat=application/json"
var drogi = "http://localhost:8080/geoserver/geo/wfs?service=WFS&version=1.1.0&typename=geo:drogi_500_noded&request=GetFeature&typeNames=namespace:featuretype&outputFormat=application/json"

var stacje_icon = L.icon({
  iconUrl: 'images/path26.png',
  iconSize: [25, 25],
  iconAnchor: [0, 15],
  popupAnchor: [20, -28]
});

window.odjazdname = "xd";
window.przyjazdname = "xd";

$.ajax({
    type: "POST",
    url: stacje,
    dataType: 'json',
    success: function (response) {
		  layerGroup1 = L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: stacje_icon});
      },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup('<h1><center>'+feature.properties.nazwa+'</h1><h3><center>Liczba torów: '+feature.properties.liczba_torow+'</center></h3><h3><center>Liczba peronów: '+feature.properties.liczba_peronow+'</center></h3><h3><center><button class="przyodj" id="roz1" onclick="showOrHide2()">ODJAZDY</button><button class="przyodj" onclick="showOrHide3()">  PRZYJAZDY</button></center></h3>');
          layer.on("click",function(e){map.setView(e.latlng, 13);
            window.odjazdname = feature.properties.odjazdy;window.odjazdname = window.odjazdname.replace(/;/g,"<br><hr>");document.getElementById("roc").innerHTML = "<h2>"+feature.properties.nazwa.toUpperCase() + "</h2><br><hr>" +window.odjazdname;
            window.przyjazdname = feature.properties.przyjazdy;window.przyjazdname = window.przyjazdname.replace(/;/g,"<br><hr>");document.getElementById("roc2").innerHTML = "<h2>"+feature.properties.nazwa.toUpperCase() + "</h2><br><hr>" +window.przyjazdname;         
          })
		  }
      }).addTo(map);
    }
});

$.ajax({
    type: "POST",
    url: tory,
    dataType: 'json',
    success: function (response) {
		  layerGroup = L.geoJSON(response, {
        onEachFeature: function (feature, layer) {
			    layer.bindPopup('<h3>Numer toru: '+feature.properties.numer+'</h3><h3>Klasa toru: '+feature.properties.typ+'</h3><h3>Maksymalna prędkość toru: '+feature.properties.maks+' km/h</h3>');
          layer.on("click",function(e){map.setView(e.latlng, 9);})
          if (feature.properties.typ == 'główna') {
            layer.setStyle({
              color: 'red',
              weight: 6,
          });} else if (feature.properties.typ == 'odgałęziona') {
            layer.setStyle({
              color: 'blue',
              weight: 6,
          });} else if (feature.properties.typ == 'główna') {
            layer.setStyle({
              color: 'green',
              weight: 6,
          });}
		  }
      }).addTo(map);
    }
});

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

var modal2 = document.getElementById("myModal2");
var btn2 = document.getElementById("rozkladyBtn");
var span2 = document.getElementsByClassName("close2")[0];

btn2.onclick = function() {
  modal2.style.display = "block";
}

span2.onclick = function() {
  modal2.style.display = "none";
}

var modal3 = document.getElementById("rozklado");
var span3 = document.getElementsByClassName("close3")[0];

span3.onclick = function() {
  rozklado.style.display = "none";
}

var modal4 = document.getElementById("rozkladp");
var span4 = document.getElementsByClassName("close4")[0];

span4.onclick = function() {
  rozkladp.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
  if (event.target == modal3) {
    modal3.style.display = "none";
  }
});

$("ul a").hover(function() {
  $("#pic").removeClass().addClass($(this).attr('rel'));
});

$.ajax({
    type: "POST",
    url: stacje,
    dataType: 'json',
    success: function (response) {
      var nav=$("<nav></nav>");
      var mylist=$("<ul id='rozklady_lista'></ul>");
      for (var i = 0; i < response.features.length; i++) {
        var butt = '<li class="stacje" onclick="funct();map.setView(['+response.features[i].properties.y+","+response.features[i].properties.x+'],13);">'+response.features[i].properties.nazwa+'</li>';
        mylist.append($(butt));
      } 
      nav.append(mylist);
      nav.appendTo($("#lista2"));
    }
});

function funct(){
  var MyModal2 = document.getElementById("myModal2");
  MyModal2.style.display = "none";
};

function search() { 
    let input = document.getElementById('myInput').value 
    input=input.toLowerCase(); 
    let x = document.getElementsByClassName('stacje'); 
      
    for (i = 0; i < x.length; i++) {  
        if (!x[i].innerHTML.toLowerCase().includes(input)) { 
            x[i].style.display="none"; 
        } 
        else { 
            x[i].style.display="list-item";                  
        } 
    } 
} 

var value=1000;
var marker;
var result;
$(document).ready(function(){
 $("button[id='set']").click(function(){
 value=$("#test").val();
 });
});

function isochrones(e) {
  if(map.hasLayer(result))map.removeLayer(result);
	if(map.hasLayer(marker))map.removeLayer(marker);
	if(marker!=null)marker=null;
	if(marker==null){
	marker = new L.marker()
	marker.setLatLng(e.latlng)
	.addTo(map);
	}
	if(marker!=null){
	value=$("#test").val();
	var x=e.latlng.lng.toFixed(3);
	var y=e.latlng.lat.toFixed(3);
	var viewparams = ['dim:' + value/100000, 'x:' + x, 'y:' + y];
	var gs_url = "http://localhost:8080/geoserver/wms";
	var defaultParam = {
	service: 'WFS',
	version: '1.1.0',
	request: 'GetFeature',
	typeName: 'geo:isochrona',
	maxFeatures: 1000,
	outputFormat: 'json',
	format_options: 'callback:getJson',
	srsName: 'epsg:4326',
	viewparams: viewparams.join(';')
	}
  }
var parameters = L.Util.extend(defaultParam);
var URL = gs_url + L.Util.getParamString(parameters);


$.ajax({
	url : URL,
	type: 'GET',
	dataType : 'json',
	jsonpCallback : 'getJson',
	success : function (data) {
		result = L.geoJson(data, {
			style: function (feature) {
					return {
						color: "blue",
						fillColor: "blue",
						weight: 3
			};
		},
	}	);
 map.addLayer(result);
 //map.fitBounds(result.getBounds());
 }
})
};


function isChecked()
{
  if (document.getElementById('isochrones').checked) 
  {
    map.on('click',isochrones)
    map.removeLayer(layerGroup);
    map.removeLayer(layerGroup1);
    $.ajax({
      type: "POST",
      url: stacje,
      dataType: 'json',
      success: function (response) {
        layerGroup1 = L.geoJSON(response, {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, redMarker);
        },
          onEachFeature: function (feature, layer) {
            var marker1 = layer.bindPopup('<h4><center>'+feature.properties.nazwa+'</center></h4>');
            marker1.on('mouseover', function (e) {
              this.openPopup();
            });
            marker1.on('mouseout', function (e) {
              this.closePopup();
            });
          }
        }).addTo(map);
      }
  })} else {
    location.reload();
  }
}

var startPoint=null;
var destPoint=null;
var route;

function fromatob(e){
if(map.hasLayer(route))map.removeLayer(route);
 if(startPoint==null){
 startPoint=new L.Marker({icon:greenIcon});
 startPoint.setLatLng(e.latlng)
 .addTo(map)
 .bindPopup("<b>Punkt początkowy</b><br>Współrzędne: "+e.latlng.lng.toFixed(2)+","+e.latlng.lat.toFixed(2)).openPopup();
 }else if (destPoint==null){
 destPoint=new L.Marker({icon:greenIcon});
 destPoint.setLatLng(e.latlng)
 .addTo(map)
 .bindPopup("<b>Punkt końcowy</b><br>Współrzędne: "+e.latlng.lng.toFixed(2)+","+e.latlng.lat.toFixed(2)).openPopup();
 }
 if(startPoint!=null && destPoint!=null){
 var x1=startPoint.getLatLng().lng;
 var y1=startPoint.getLatLng().lat;
 var x2=destPoint.getLatLng().lng;
 var y2=destPoint.getLatLng().lat;
 var viewparams = [
 'x1:' + x1, 'y1:' + y1,
 'x2:' + x2, 'y2:' + y2
 ];
var defaultParam = {
 service: 'WFS',
 version: '1.3.0',
 request: 'GetFeature',
 typeName: 'geo:route', //podać prawidłową nazwę dla workspace:widok_SQL
 maxFeatures: 100,
 outputFormat: 'application/json',
 format_options: 'callback:getJson',
 srsName: 'epsg:4326', //układ współrzędnych mapy interesu
 viewparams: viewparams.join(';')
};
var parameters = L.Util.extend(defaultParam);
var ms_url = "http://localhost:8080/geoserver/wms";
var URL = ms_url + L.Util.getParamString(parameters);
//uruchomienie funkcji ajax jQery do pobrania obiektów trasy w postaci geoJSON
$.ajax({
 url : URL,
 type: 'GET',
 dataType : 'json',
 jsonpCallback : 'getJson',
 success : function (data) {
 route = L.geoJson(data, {
 style: function (feature) {
 return {
 color: "red",//kolor wytyczonej trasy
 weight: 5
 };
 },
 onEachFeature: function (feature, layer) {
 var popupContent = "<b>Wytyczona trasa</b></br>Odległość: " + feature.properties.dlugosc_km+" km"; //popup dla trasy
 layer.bindPopup(popupContent);}
});
route.addTo(map);
 }
});
}}

var redMarker = {
  radius: 8,
  fillColor: "#ff0000"
}

function isChecked2()
{
  if (document.getElementById('fromatob').checked) 
  {
  map.on('click',fromatob);
  map.removeLayer(layerGroup);
  map.removeLayer(layerGroup1);
  $.ajax({
    type: "POST",
    url: stacje,
    dataType: 'json',
    success: function (response) {
		  layerGroup1 = L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, redMarker);
      },
        onEachFeature: function (feature, layer) {
          var marker1 = layer.bindPopup('<h4><center>'+feature.properties.nazwa+'</center></h4>');
          marker1.on('mouseover', function (e) {
            this.openPopup();
          });
          marker1.on('mouseout', function (e) {
            this.closePopup();
          });
        }
      }).addTo(map);
    }
});
} else {
    location.reload();
  }
}

var clearButton = document.getElementById("clear");
clearButton.addEventListener('click'
, function(e) {
if(map.hasLayer(startPoint))map.removeLayer(startPoint);
if(map.hasLayer(destPoint))map.removeLayer(destPoint);
 if(map.hasLayer(route))map.removeLayer(route);
if(startPoint!=null)startPoint=null;
 if(destPoint!=null)destPoint=null;
});

function showDiv() {
  document.getElementById("trasa1").style.display = "block";
}

function closeDiv() {
	document.getElementById("trasa1").style.display = "none";
}

function showOrHide() {
	if(document.getElementById("trasa1").style.display == "block")closeDiv()
	else showDiv()
}

function showDiv1() {
  document.getElementById("isodiv").style.display = "block";
}

function closeDiv1() {
	document.getElementById("isodiv").style.display = "none";
}

function showOrHide1() {
	if(document.getElementById("isodiv").style.display == "block")closeDiv1()
	else showDiv1()
}

function showDiv2() {
  document.getElementById("rozklado").style.display = "block";
}

function closeDiv2() {
	document.getElementById("rozklado").style.display = "none";
}

function showOrHide2() {
	if(document.getElementById("rozklado").style.display == "block")closeDiv2()
	else showDiv2()
}

function showDiv3() {
  document.getElementById("rozkladp").style.display = "block";
}

function closeDiv3() {
	document.getElementById("rozkladp").style.display = "none";
}

function showOrHide3() {
	if(document.getElementById("rozkladp").style.display == "block")closeDiv3()
	else showDiv3()
}

if(document.getElementById("isodiv").style.display == "block") alert("jebut")
if(document.getElementById("isodiv").style.display == "block")document.getElementById("trasa1").style.display == "none";
if(document.getElementById("trasa1").style.display == "block")document.getElementById("isodiv").style.display == "none";



