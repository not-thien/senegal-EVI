// Just some map calibration
Map.centerObject(ROI);
print(ROI.area(20).divide(1000*1000));

// need an array to hold all the images
var yearlyAverages = [];
for (var year = 2013; year < 2021; year++) { // loop thru all the years we wanna look at
  var startDate = year + "-01-01"
  var endDate = year + "-12-31"
  
  // preprocessing the landsat images
  var pp_L8 = L8
  .filterBounds(Senegal)
  .filterDate(startDate, endDate)
  .filterMetadata("CLOUD_COVER", "less_than", 1)
  .max() // just the highest possible values of everything first [ISSUE #1]
  // by its definition as a reducer, .max() grabs the highest value "across the stack of all matching bands". 
  // this might mean that when we calculate EVI after this, it's using the highest value of RED, BLUE, and NIR throughout a single year...
  // that means we need to calculate EVI of every single day (DOTY) and just keep track of the highest EVI recorded in each pixel
  .clip(Senegal);
  
  // EVI calculated via the USGS definition of EVI equation
  var yearEvi = pp_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
  'NIR': pp_L8.select('B5'),
  'RED': pp_L8.select('B4'),
  'BLUE': pp_L8.select('B2')
  });
  
  yearlyAverages.push(yearEvi);
}

// IGNORE THIS IGNORE THIS IGNORE THIS ~~~~~~~~~~~~~~~~~
// var pp_L8 = L8
// .filterBounds(ROI)
// .filterDate("2013-04-11", "2016-11-14")
// .filterMetadata("CLOUD_COVER", "less_than", 1)
// .mean()
// .clip(ROI);
// print(pp_L8);

// var evi = pp_L8.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
//   'NIR': pp_L8.select('B5'),
//   'RED': pp_L8.select('B4'),
//   'BLUE': pp_L8.select('B2')
// });
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// need the average of those EVI images
var averageMaxEvi = ee.ImageCollection(yearlyAverages).mean();

Map.addLayer(averageMaxEvi, {min: -1, max: 1, palette: ['blue', 'white', 'green']});

// take each year as an ee.ImageCollection, get the max, and then find the average of those 7 years
var rgbVis = {
  min: [-1],
  max: [1],
  palette: ['blue', 'white', 'green']
}

var visualized = averageMaxEvi.visualize(rgbVis);

Export.image.toDrive({
  image: visualized,
  description: 'AverageMaxEVI',
  scale: 30,
  region: Senegal,
  maxPixels: 1e9
});
