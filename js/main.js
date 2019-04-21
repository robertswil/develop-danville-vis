var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 120, r: 40, b: 40, l: 40};

//Make the title text for the page
svg.append('text')
    .attr('class','heading')
    .attr('text-anchor','middle')
    .attr('transform','translate('+svgWidth/2+','+(padding.t-32)+')')
    .text('Develop Danville');
svg.append('text')
    .attr('class','subheading')
    .attr('text-anchor','middle')
    .attr('transform','translate('+svgWidth/2+','+(padding.t+20)+')')
    .text('Visualizing Data Gathered from DevelopDanville.com');
svg.append('text')
    .attr('class','subsubheading')
    .attr('transform','translate('+10+','+(10)+')')
    .text('Built by Wil Roberts');

//Append link to source
svg.append('a')
    .attr('xlink:href','https://www.developdanville.com')
    .attr('xlink:show','new')
    .append('rect')
    .attr('id','linkRect')
    .attr('width','180px')
    .attr('height','30')
    .attr('transform','translate('+(svgWidth/2+50)+','+(padding.t)+')')
    .attr('fill','black')
    .style('fill-opacity','0')
    .style('stroke','none');

var showingEconomics = true;

top20BubblesAndTable();
industriesGroupedBars();
expansionTimeline();
makeNavButtons();


function makeNavButtons(){
    svg.append('g')
        .attr('id','makeEconomics')
        .attr('class','fancy')
        .attr('transform','translate('+(svgWidth-110)+','+36+')')
        .on('click',function(){
            if(!showingEconomics){
                showingEconomics = true;
                removeClassed('population');
                top20BubblesAndTable();
                industriesGroupedBars();
                expansionTimeline();
                d3.select('#makePopulation').selectAll('text')
                    .style('fill-opacity','0.6');
                d3.select('#makePopulation').selectAll('rect')
                    .style('stroke-opacity','0.3');
                d3.select(this).selectAll('text')
                    .style('fill-opacity','1');
                d3.select(this).selectAll('rect')
                    .style('stroke-opacity','1');
            }
        })
        .on('mouseover',function(){
            if(!showingEconomics){
                d3.select(this).selectAll('rect')
                        .style('stroke-opacity','1');
            }
        })
        .on('mouseout',function(){
            if(!showingEconomics){
                d3.select(this).selectAll('rect')
                        .style('stroke-opacity','0.3');
            }
        });
    d3.select('#makeEconomics')
        .append('rect')
        .attr('width','100px')
        .attr('height','20px')
        .style('fill','white')
        .style('stroke','black')
        .style('stroke-width','2px')
        .style('stroke-opacity','1');
    d3.select('#makeEconomics')
        .append('text')
        .attr('text-anchor','middle')
        .attr('transform','translate(50,13)')
        .style('font-family','Vidaloka, serif')
        .style('font-size','10px')
        .style('fill-opacity','1')
        .text('Economic Data');

    svg.append('g')
        .attr('id','makePopulation')
        .attr('class','fancy')
        .attr('transform','translate('+(svgWidth-110)+','+(36+10+20)+')')
        .on('click',function(){
            if(showingEconomics){
                showingEconomics = false;
                removeClassed('economics');
                totalPopulationMultiples();
                populationRaceTornado();
                populationAgeTornado();
                d3.select('#makeEconomics').selectAll('text')
                    .style('fill-opacity','0.6');
                d3.select('#makeEconomics').selectAll('rect')
                    .style('stroke-opacity','0.3');
                d3.select(this).selectAll('text')
                    .style('fill-opacity','1');
                d3.select(this).selectAll('rect')
                    .style('stroke-opacity','1');
            }
        })
        .on('mouseover',function(){
            if(showingEconomics){
                d3.select(this).selectAll('rect')
                        .style('stroke-opacity','1');
            }
        })
        .on('mouseout',function(){
            if(showingEconomics){
                d3.select(this).selectAll('rect')
                        .style('stroke-opacity','0.3');
            }
        });    
    d3.select('#makePopulation')
        .append('rect')
        .attr('width','100px')
        .attr('height','20px')
        .style('fill','white')
        .style('stroke','black')
        .style('stroke-width','2px')
        .style('stroke-opacity','0.3');
    d3.select('#makePopulation')
        .append('text')
        .attr('text-anchor','middle')
        .attr('transform','translate(50,13)')
        .style('font-family','Vidaloka, serif')
        .style('font-size','10px')
        .style('fill-opacity','0.6')
        .text('Population Data');
}

function removeClassed(text){
    d3.selectAll('.'+text).remove();
}
