var ROI = null; // DEFINE THIS PER YOUR USE. SEE SenegalROIs.js for premade ROIs.
var L8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
// Just some map calibration
Map.centerObject(geometry);
// print(ROI.area(20).divide(1000*1000));

// need an array to hold all the images
var yearlyAvgDiffs = [];

for (var year = 2013; year < 2021; year++) { // loop thru all the years we wanna look at
  var startDate = year + "-01-01"
  var endDate = year + "-12-31"
  
  // preprocessing the landsat images for Max EVI
  var max_L8 = L8
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .max() // just the highest possible values of everything
  .clip(geometry);
  
  // repeat but for min EVI
  var min_L8 = L8
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .min() // just the lowest possible values of everything
  .clip(geometry);
  
  
  // calculate the EVI via USGS definition of EVI
  var yearMaxEvi = ee.Image(max_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': max_L8.select('SR_B5'),
  'RED': max_L8.select('SR_B4'),
  'BLUE': max_L8.select('SR_B2')
  }));
  
  var yearMinEvi = ee.Image(min_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': min_L8.select('SR_B5'),
  'RED': min_L8.select('SR_B4'),
  'BLUE': min_L8.select('SR_B2')
  }));
  
  // some bug checking stuff
// print(yearMinEvi);
  
  // get the diff EVI's and make em into an image
  // var diffEvi = yearMaxEvi.subtract(yearMinEvi);
  var diffEvi = yearMinEvi.subtract(yearMaxEvi);
  // print(diffEvi.select('constant'));
  
  // add it to the ImageCollection of annual EVI differences
  yearlyAvgDiffs.push(diffEvi);
}

// calculate the average of EVI differences year-to-year
var averageEviDiff = ee.ImageCollection(yearlyAvgDiffs).mean();

// visualize it
Map.addLayer(averageEviDiff, {min: 0, max: 2, palette: ['black', 'white']});

var rgbVis = {
  min: [0],
  max: [2],
}

var visualized = averageEviDiff.visualize(rgbVis);

Export.image.toDrive({
  image: visualized,
  description: 'eviSeasonalDiff',
  scale: 1000,
  region: geometry,
  maxPixels: 1e9
});

// side note: the methodology for calculating the min and max EVI is a little... dubious. a better approach,
// if I were to redo it, it would be to recalculate the EVI for every single day in a given year, and find the
// lowest and highest evi that way. Sadly, I am otherwise preoccupied and cannot. Feel free, however, to use
// this script as inpsiration for a better algorithm. 