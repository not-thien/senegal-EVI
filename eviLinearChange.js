// Just some map calibration
Map.centerObject(ROI);
print(ROI.area(20).divide(1000*1000));

// a fxn to add a time stamp to the images
var createTimeBand = function(image) {
  return image.addBands(image.metadata('FILE_DATE').divide(1e10));
};

// need an array to hold all the images
var yearlyMaxes = [];

// loop thru all the years we wanna look at
for (var year = 2013; year < 2021; year++) { 
  var startDate = year + "-01-01"
  var endDate = year + "-12-31"
  
  // preprocessing the landsat images & adding timestamps
  var pp_L8 = L8
  .filterBounds(Senegal)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .map(createTimeBand)
  .max() 
  .clip(Senegal);
  
  // EVI calculated via the USGS definition of EVI equation
  var yearEvi = pp_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': pp_L8.select('B5'),
  'RED': pp_L8.select('B4'),
  'BLUE': pp_L8.select('B2')
  })
  .rename('evi')
  .addBands(pp_L8.select('FILE_DATE')); // making sure the timestamp carries over
  // print('yearly EVI image: ', yearEvi);
  
  // add the new image to the list
  yearlyMaxes.push(yearEvi);
}

// convert the list into an actual IC
var timedEviMaxes = ee.ImageCollection(yearlyMaxes);
// print(timedEviMaxes);

// reduce the ImageCollection w/ linear fit w/ time as x-axis and EVI as y-axis
var linearFit = timedEviMaxes.select(['FILE_DATE', 'evi']).reduce(ee.Reducer.linearFit());
print('info on the LF: ', linearFit);

// visualize it
Map.addLayer(linearFit, {min: [0, -50, 0], max: [-0.8, 275, 1], bands: ['scale', 'offset', 'scale']}, 'EVI linear fit');

var rgbVis = {
  min: [0, -50, 0],
  max: [-0.8, 275, 1],
  bands: ['scale', 'offset', 'scale']
}

var visualized = linearFit.visualize(rgbVis);

Export.image.toDrive({
  image: visualized,
  description: 'EVILinearChange',
  scale: 30,
  region: Senegal,
  maxPixels: 1e9
});
