var L8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
// Just some map calibration
Map.centerObject(geometry);
// print(ROI.area(20).divide(1000*1000));

// need an array to hold all the images
var yearlyAverages = [];
for (var year = 2013; year < 2021; year++) { // loop thru all the years we wanna look at
  var startDate = year + "-01-01"
  var endDate = year + "-12-31"
  
  // preprocessing the landsat images
  var pp_L8 = L8
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .max() // just the highest possible values of everything first [ISSUE #1]
  // by its definition as a reducer, .max() grabs the highest value "across the stack of all matching bands". 
  // this might mean that when we calculate EVI after this, it's using the highest value of RED, BLUE, and NIR throughout a single year...
  // that means we need to calculate EVI of every single day (DOTY) and just keep track of the highest EVI recorded in each pixel
  .clip(geometry);
  
  // EVI calculated via the USGS definition of EVI equation
  var yearEvi = pp_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': pp_L8.select('SR_B5'),
  'RED': pp_L8.select('SR_B4'),
  'BLUE': pp_L8.select('SR_B2')
  });
  
  yearlyAverages.push(yearEvi);
}

// need the average of those EVI images
var averageMaxEvi = ee.ImageCollection(yearlyAverages).mean();

Map.addLayer(averageMaxEvi, {min: 0, max: 1, palette: ['8c510a', 'd8b365', 'f6e8c3', 'f5f5f5', 'd9f0d3', '7fbf7b', '1b7837']});

// take each year as an ee.ImageCollection, get the max, and then find the average of those 7 years
var rgbVis = {
  min: [0],
  max: [1],
  palette:['8c510a', 'd8b365', 'f6e8c3', 'f5f5f5', 'd9f0d3', '7fbf7b', '1b7837']
};

var visualized = averageMaxEvi.visualize(rgbVis);

Export.image.toDrive({
  image: visualized,
  description: 'AverageMaxEVI',
  scale: 1000,
  region: geometry,
  maxPixels: 1e9
});