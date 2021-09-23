# Looking for Land Degradation in Senegal, Using EVI (Enhanced Vegetation Index)
## A little context: 
* These maps and graphs were generated from [Google Earth Engine](https://developers.google.com/earth-engine/guides/getstarted) satellite data.
* Using those fancy data readings from satellites, EVI can be calculated using different parts of the color spectrum and [some math](https://www.usgs.gov/core-science-systems/nli/landsat/landsat-enhanced-vegetation-index?qt-science_support_page_related_con=0#qt-science_support_page_related_con)
* If you want more details on how satellite imagery and GEE works at a fundamental level, check out [this post](https://gis.stackexchange.com/questions/304180/what-are-the-min-and-max-values-of-map-addlayer-on-google-earth-engine)
* These maps and graphs were made in hopes of finding out where the most degraded lands are in Senegal (aka, where usable soil has deteriorated in quality over the past years). 
* The focus region was the Peanut Basin in Senegal:
![map showing where senegal's peanut basin region is](https://www.researchgate.net/profile/Ewan-Robinson/publication/267370492/figure/fig1/AS:514884001595392@1499769320661/The-location-of-study-area-in-Senegal-The-dark-border-indicates-the-extent-of-the-former.png)

---
# The Maps and Graphs 

## Annual Max EVI
![Map of Senegal's annual max EVI](mapsANDgraphs/yearlyMaxEVI_FINAL.png)  
The above map takes the highest EVI per year (from -1 to 1) and averages it out throughout all available years. [**Here's the GEE script**](https://code.earthengine.google.com/7195eb5c856b6f3567ed75ccd704bd98), if you'd like.  
*Basically, the greener it is, the higher the max EVI is for that region.*

![graph of EVI at a sample point, with annual maximums](mapsANDgraphs/eviMaximumsGraph.png)  
This graph is the EVI over time of a sample point in Senegal's Peanut Basin. The red dotted lines illustrate the max EVI per year.  
This is the first stage of land degradation analysis. Maximum annual EVIs reflect the greenest times of the year: right after the rainy season. 

## Annual EVI Differences
![Map of Senegal's seasonal differences in EVI](mapsANDgraphs/seasonalDiffEVI_FINAL.png)  
[**Here's the GEE script for this one**](https://code.earthengine.google.com/f948968ca7d10071904dce5f3ccc5182). Based off of the previous algorithm, this map highlights where the greatest differences in EVI are.  
In a single given year, big differences in *greenness* of an area in Senegal indicate farmed lands and where seasonality strongly affects plants and soil.  

![graph showing the differences in max and min EVI per year](mapsANDgraphs/eviDifferences.png)  
The above graph was based off of a single sample point in the Peanut Basin.  
The differences in EVI in the sample are greatest in the last few months of the year, which correlates with the peak of the dry season in the Peanut Basin (November to May).  

## EVI Linear Change
![Map of EVI trends throughout Senegal](mapsANDgraphs/linearChangeEVI_FINAL.png)   
Using [**Google Earth Engine's linear fitting function**](https://code.earthengine.google.com/402a26173dd1e43bc5360c04f49a5e2a), this above map was generated.  
Using the EVI maximums previously generated, the annual trends of EVI change can be visualized for all of Senegal. Basically, whereever the highest EVI per year has been going down over the past few years, that area will show up as more yellow and orange. If the EVI has been increasing over the past years, that area will look more blue.  
The max EVIs were recorded as independent variables; and depending on the time that passed, the slope of the linear fit would've been more positive or negative. That slope is an indicator of changing EVI.

## Bottom 10th Percentile
![map of 10% most negative EVI changes](mapsANDgraphs/eviPercentile_FINAL.png)
Took the previous linear fit one step further. [**This map**](https://code.earthengine.google.com/173017bc85e30ab42cb1aedb971f8656) lights up where the bottom 10th percentile of the previously shown EVI rates of change. Where there is white, that's where the most extreme and negative EVI slopes are. In other words, those regions are where it's been getting less and less green, as the years have gone by. Those are the areas we'll be most likely to tell NGOs and other Senegal farmer relief programs to target as **high priority** land degradation.  

---

# How Do I make use out of These?
## For those new to Google Earth Engine (*GEE*):
1. Register as a [GEE developer](https://developers.google.com/earth-engine/guides/getstarted) to edit my scripts and make your own!
2. Familiarize yourself with the syntax and [how the Engine works](https://youtu.be/I-wFYm4Hnhg?t=1492)

## How to Re-Purpose my scipts (this approach works for all of them):
1. Once in the GEE editor, add a new Geometry layer as either a rectangle or a polygon
2. That's it! Click run to do some EVI analysis in your region of interest (*ROI*)
3. In the rightside _**Tasks**_, there will be an option to download the map to your Google Drive. Run that task if you want a .tif file of your ROI

![EVI chart over time for a POI](mapsANDgraphs/ee-chart.png)

## For simple EVI Time Series, like this one above ^^
* Use [**this link**](https://code.earthengine.google.com/8891b3145229b3ae596aa0edbb24f94c) to pick a point of interest and see what their EVI over the past decade looks like.
* The code might have an EVIpoint already defined. Simply overwrite it with whatever coordinates you're interested in, and then run the script