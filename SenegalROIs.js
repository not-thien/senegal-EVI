// some interesting cities and villages 
var Dakar = ee.Geometry.Point([-17.4642, 14.7177]);
var Diafilon = ee.Geometry.Point([-15.845941511006105,12.930687012145626]);

// some ROIs
var deltaRegion = ee.Geometry.Rectangle([-16.5, 13.9, -14.9, 14.4]);
var dryPlace = ee.Geometry.Rectangle([-13.7, 14.5, -15.1, 15.6]);
var PeanutBasin = ee.Geometry.Rectangle([-16.5, 13.6, -13.4, 15.5]);
Map.addLayer(PeanutBasin, {color: 'blue'}, "Delta Region", true);

// the whole of Senegal
var Senegal = /* color: #d63000 */ ee.Geometry.Polygon(
        [[[-16.766191296371048,15.518611084574594],
 [-17.052922745119375,15.095712913610903],
 [-17.316594620119375,14.86222663533739],
 [-17.602239151369375,14.766636461991284],
 [-17.481389541994375,14.57533019726475],
 [-17.349553604494375,14.649746940628939],
 [-17.228703995119375,14.554063647830498],
 [-17.052922745119375,14.362572801377151],
 [-16.844182510744375,14.096341628598783],
 [-16.811223526369375,13.691076395746222],
 [-16.629949112306875,13.546931200079051],
 [-16.520085831056875,13.568291581479903],
 [-15.564275284181873,13.568291581479903],
 [-15.437932510744373,13.61634540916609],
 [-15.322576065431873,13.723096701833143],
 [-15.075383682619373,13.760448202576436],
 [-14.877629776369373,13.744441145725027],
 [-14.707341690431873,13.600328549524107],
 [-14.559026260744373,13.61634540916609],
 [-14.482121963869373,13.520228025200193],
 [-14.399724502931873,13.429414877043962],
 [-14.223943252931873,13.424071854331995],
 [-14.114079971681873,13.504204683369572],
 [-13.982244034181873,13.530909654596172],
 [-13.866887588869373,13.477496722603268],
 [-13.844914932619373,13.36529076510039],
 [-14.108586807619373,13.311840973251332],
 [-14.278874893556873,13.258379381048012],
 [-14.416203995119373,13.317186484176936],
 [-14.624944229494373,13.392011222171318],
 [-14.943547745119373,13.434757780787203],
 [-15.097356338869373,13.63769953483199],
 [-15.262151260744373,13.50954591695303],
 [-15.383000870119373,13.413385452177213],
 [-15.514836807619373,13.413385452177213],
 [-15.822453995119373,13.370635093575226],
 [-15.822453995119373,13.17816496323502],
 [-16.657414932619375,13.220949268828514],
 [-16.778264541994375,13.113974483434847],
 [-16.822209854494375,12.878466597472748],
 [-16.789250870119375,12.353135681139777],
 [-16.701360245119375,12.320937797147469],
 [-16.239934463869375,12.438977308085322],
 [-15.690618057619373,12.417519552847592],
 [-15.119328995119373,12.674895005644675],
 [-13.119817276369373,12.578409386083703],
 [-13.097844620119373,12.449705521218416],
 [-12.845159073244373,12.428248651842427],
 [-12.383733291994373,12.267265878568958],
 [-11.768498916994373,12.353135681139777],
 [-11.351018448244375,12.353135681139777],
 [-11.340032120119375,12.449705521218416],
 [-11.405950088869375,12.632017002258655],
 [-11.362004776369375,12.760629343374811],
 [-11.351018448244375,13.049767245660568],
 [-11.559758682619375,13.349257069195914],
 [-11.724553604494373,13.445443231192305],
 [-11.823430557619373,13.349257069195914],
 [-11.889348526369373,13.49886333020452],
 [-11.977239151369373,13.56295166617967],
 [-12.065129776369373,13.712423751489109],
 [-11.944280166994373,13.797793741233555],
 [-11.933293838869373,13.915126453411023],
 [-11.966252823244373,14.043057900201582],
 [-11.966252823244373,14.277412992297654],
 [-12.131047745119373,14.415781240892759],
 [-12.098088760744373,14.617857136549578],
 [-12.164006729494373,14.777259673701758],
 [-13.383489151369373,16.143177100474198],
 [-13.789983291994373,16.185385140518147],
 [-14.328313370119373,16.68064812796567],
 [-16.261907120119375,16.60696582996359],
 [-16.507732497269508,16.06400069898331],
 [-16.766191296371048,15.518611084574594]]]);
// Map.addLayer(Senegal, {color: 'd63000'}, "Senegal", true);

// exports.ARGpoint1=ARGpoint1; <--- Not sure what this does? Or what exports.doc = "" was for...