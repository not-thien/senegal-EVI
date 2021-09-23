var L8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");

// Just some map calibration
Map.centerObject(geometry);
// print(ROI.area(20).divide(1000*1000));

// a fxn to add a time stamp to the images
var createTimeBand = function(image) {
  return image.addBands(image.metadata('DATE_PRODUCT_GENERATED').divide(1e10));
};

// need an array to hold all the images
var yearlyMaxes = [];

// loop thru all the years we wanna look at
for (var year = 2013; year < 2021; year++) { 
  var startDate = year + "-01-01"
  var endDate = year + "-12-31"
  
  // preprocessing the landsat images & adding timestamps
  var pp_L8 = L8
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .map(createTimeBand)
  .max() 
  .clip(geometry);
  
  // EVI calculated via the USGS definition of EVI equation
  var yearEvi = pp_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': pp_L8.select('SR_B5'),
  'RED': pp_L8.select('SR_B4'),
  'BLUE': pp_L8.select('SR_B2')
  })
  .rename('evi')
  .addBands(pp_L8.select('DATE_PRODUCT_GENERATED')); // making sure the timestamp carries over
  
  // add the new image to the list
  yearlyMaxes.push(yearEvi);
}

// convert the list into an actual IC
var timedEviMaxes = ee.ImageCollection(yearlyMaxes);
// print(timedEviMaxes);

// reduce the ImageCollection w/ linear fit w/ time as x-axis and EVI as y-axis
var linearFit = timedEviMaxes.select(['DATE_PRODUCT_GENERATED', 'evi']).reduce(ee.Reducer.linearFit());
print('info on the LF: ', linearFit);

// visualize it
Map.addLayer(linearFit, {min: [0, -15, 0], max: [-0.15, 50, 0.15], bands: ['scale', 'offset', 'scale']}, 'EVI linear fit');

var rgbVis = {
  min: [0, -15, 0],
  max: [-0.15, 50, 0.15],
  bands: ['scale', 'offset', 'scale']
}

var visualized = linearFit.visualize(rgbVis);

Export.image.toDrive({
  image: visualized,
  description: 'EVILinearChange',
  scale: 1000,
  region: geometry,
  maxPixels: 1e9
});
