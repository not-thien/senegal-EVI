// Just some map calibration
Map.centerObject(ROI);
print(ROI.area(20).divide(1000*1000));

// need an array to hold all the images
var yearlyAvgDiffs = [];

for (var year = 2013; year < 2021; year++) { // loop thru all the years we wanna look at
  var startDate = year + "-01-01"
  var endDate = year + "-12-31"
  
  // preprocessing the landsat images for Max EVI
  var max_L8 = L8
  .filterBounds(Senegal)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .max() // just the highest possible values of everything
  .clip(Senegal);
  
  // repeat but for min EVI
  var min_L8 = L8
  .filterBounds(Senegal)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .min() // just the lowest possible values of everything
  .clip(Senegal);
  
  
  // calculate the EVI via USGS definition of EVI
  var yearMaxEvi = max_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': max_L8.select('B5'),
  'RED': max_L8.select('B4'),
  'BLUE': max_L8.select('B2')
  });
  
  var yearMinEvi = min_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': min_L8.select('B5'),
  'RED': min_L8.select('B4'),
  'BLUE': min_L8.select('B2')
  });
  
  // some bug checking stuff
  print(yearMinEvi);
  print(yearMaxEvi);
  print("looped");
  
  // get the diff EVI's and make em into an image
  var diffEvi = yearMaxEvi.select('constant').subtract(yearMinEvi.select('constant'));
  
  // add it to the ImageCollection of annual EVI differences
  yearlyAvgDiffs.push(diffEvi);
}

// calculate the average of EVI differences year-to-year
var averageEviDiff = ee.ImageCollection(yearlyAvgDiffs).mean();

// visualize it
Map.addLayer(averageEviDiff, {min: -5, max: 10, palette: ['black', 'white']});

var rgbVis = {
  min: [-5],
  max: [10],
}

var visualized = averageEviDiff.visualize(rgbVis);

Export.image.toDrive({
  image: visualized,
  description: 'EVILinearChange',
  scale: 30,
  region: Senegal,
  maxPixels: 1e9
});
