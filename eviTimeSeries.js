var ROI = ee.Geometry.Rectangle([-16.5, 13.6, -13.4, 15.5]);
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_RT");

// Just some map calibration
Map.centerObject(ROI);
print(ROI.area(20).divide(1000*1000));
var pp_L8 = L8.map(function(image) { return image.clip(ROI) }).filterMetadata("CLOUD_COVER", "less_than", 1);
// print("L8 time stamp: ", L8.propertyNames());
// print("L8 time stamp: ", L8.first().get('system:time_start'));

// calculate EVI for the ROI for each image in L8, and keep the time stamp
var EVI = function(image) {
  return image.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': image.select('B5'),
  'RED': image.select('B4'),
  'BLUE': image.select('B2')
  }).copyProperties(image, ['system:time_start'])
};
var ROIEVI = pp_L8.map(EVI);

// create a time series for a single point's EVI
var EVIpoint = ee.Geometry.Point([-15.6843, 14.1784]);
var maxEVIchart = ui.Chart.image.series({
  imageCollection: ROIEVI,
  region: EVIpoint,
  scale: 50
}).setOptions({
  interpolateNulls: true,
  lineWidth: 1,
  pointSize: 3,
  title: 'EVI over Time at a Single Location',
  vAxis: {title: 'EVI'},
  hAxis: {title: 'Date'} });
  
print(maxEVIchart);  
