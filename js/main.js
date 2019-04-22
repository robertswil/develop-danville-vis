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
    .text('Visualizing Data Gathered at DevelopDanville.com');
svg.append('text')
    .attr('class','subsubheading')
    .attr('transform','translate('+10+','+(10)+')')
    .text('Built by Wil Roberts');

//Append link to DevelopDanville.com
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

//Append link to DevelopDanville.com
svg.append('text')
    .attr('class','subsubheading')
    .attr('transform','translate('+10+','+25+')')
    .text('Data source');

svg.append('path')
    .attr('d','M19.175,4.856L15.138,0.82c-0.295-0.295-0.817-0.295-1.112,0L8.748,6.098c-0.307,0.307-0.307,0.805,0,1.112l1.462,1.462l-1.533,1.535L7.215,8.746c-0.307-0.307-0.805-0.307-1.112,0l-5.278,5.276c-0.307,0.307-0.307,0.805,0,1.112l4.037,4.037c0.154,0.153,0.355,0.23,0.556,0.23c0.201,0,0.403-0.077,0.556-0.23l5.28-5.276c0.148-0.148,0.23-0.347,0.23-0.556c0-0.209-0.083-0.409-0.23-0.556l-1.464-1.464l1.533-1.535l1.462,1.462c0.153,0.153,0.355,0.23,0.556,0.23c0.201,0,0.402-0.077,0.556-0.23l5.278-5.278c0.147-0.147,0.23-0.347,0.23-0.556C19.406,5.203,19.322,5.004,19.175,4.856zM9.585,13.339l-4.167,4.164l-2.925-2.925l4.166-4.164l0.906,0.905l-0.67,0.668c-0.307,0.307-0.307,0.805,0,1.112c0.154,0.153,0.356,0.23,0.556,0.23c0.203,0,0.403-0.077,0.556-0.23l0.67-0.668L9.585,13.339z M13.341,9.578l-0.906-0.906l0.663-0.662c0.307-0.307,0.307-0.805,0-1.112c-0.307-0.307-0.805-0.307-1.112,0L11.322,7.56l-0.906-0.906l4.166-4.166l2.925,2.925L13.341,9.578z')
    .attr('transform','translate(64,17) scale(0.5)')
    .style('fill','black')
    .style('stroke','none');

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
                d3.select('#dataLink')
                    .attr('xlink:href',function(){
                        if(showingEconomics){return 'http://www.thinkkentucky.com/cmnty/BusInd.aspx?cw=114';}
                        else{return 'http://www.thinkkentucky.com/cmnty/Demog.aspx?cw=114';}
                    });
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
                d3.select('#dataLink')
                    .attr('xlink:href',function(){
                        if(showingEconomics){return 'http://www.thinkkentucky.com/cmnty/BusInd.aspx?cw=114';}
                        else{return 'http://www.thinkkentucky.com/cmnty/Demog.aspx?cw=114';}
                    });
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

    //Change the link
    svg.append('a')
        .attr('id','dataLink')
        .attr('xlink:href',function(){
            if(showingEconomics){return 'http://www.thinkkentucky.com/cmnty/BusInd.aspx?cw=114';}
            else{return 'http://www.thinkkentucky.com/cmnty/Demog.aspx?cw=114';}
        })
        .attr('xlink:show','new')
        .append('rect')
        .attr('id','linkRect')
        .attr('width','65px')
        .attr('height','12')
        .attr('transform','translate('+10+','+15+')')
        .attr('fill','black')
        .style('fill-opacity','0')
        .style('stroke','none');
}

function removeClassed(theClass){
    d3.selectAll('.'+theClass).remove();
}
