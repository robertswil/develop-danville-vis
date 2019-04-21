function totalPopulationMultiples(){
    // Create a group element for appending chart elements
    var totalPopChartG = svg.append('g')
        .attr('id','totalPopChartG')
        .attr('class','population')
        .attr('transform','translate('+2.4*padding.l+','+(2.5*padding.t+26)+')');

    totalPopChartG.append('text')
        .attr('class','charttitle')
        .attr('text-anchor','middle')
        .attr('transform','translate('+(svgWidth/2-2.4*padding.l)+',-36)')
        .style('font-family','PT Sans, sans-serif')
        .text('Total Population and Percent Change by Market Area');

    // Compute chart dimensions
    var totalPopWidth = (svgWidth/2 - padding.l - padding.r);
    var totalPopHeight = (svgHeight/8 - padding.t - padding.b);

    d3.csv('./data/TotalPopulation.csv',
        // Load data and use this function to process each row
        function(row) {
            return {
                'scope': row['scope'],
                'year': +row['year'],
                'population': +row['population']
            };
        },
        function(error, dataset) {
            // Log and return from an error
            if(error) {
                console.error('Error while loading ./data/TotalPopulation.csv dataset.');
                console.error(error);
                return;
            }

            totalPop = dataset;
            
            //Wrangle the data
            var totalPopNest = d3.nest()
                .key(function(d){return d.scope;})
                .entries(totalPop);
            var keys = Object.keys(d3.nest()
                .key(function(d){return d.scope;})
                .object(totalPop));

            var interiorChartWidth = 200;

            for(i=0;i<totalPopNest.length;i++){
                makeTotalPopChart(totalPopNest[i].values,i);
            }
            
            function makeTotalPopChart(data, i){

                var thisG = totalPopChartG.append('g')
                    .attr('transform','translate('+(i*interiorChartWidth+3*i*padding.l)+',0)');

                var yScalePop = d3.scaleLinear()
                    .domain(d3.extent(data, function(d){return d.population;}))
                    .range([totalPopHeight+padding.b,0]).nice();
                var yAxisPop = d3.axisLeft(yScalePop).ticks(6);
                thisG.append('g')
                    .attr('class','axis')
                    .call(yAxisPop);

                var percentChange = [];
                for(k=1;k<data.length;k++){
                    percentChange.push({
                        year: data[k].year,
                        change: (data[k].population-data[k-1].population)/data[k-1].population
                    });
                }

                var yScalePer = d3.scaleLinear()
                    .domain([-0.01,0.05])
                    .range([totalPopHeight+padding.b,0]).nice();
                var yAxisPer = d3.axisRight(yScalePer).ticks(6).tickFormat(d3.format('.0%'));
                thisG.append('g')
                    .attr('class','axis')
                    .attr('transform','translate('+interiorChartWidth+',0)')
                    .call(yAxisPer);
            
                var xScalePop = d3.scaleLinear()
                    .domain(d3.extent(data, function(d){ return d.year;}))
                    .range([0, interiorChartWidth])
                var xAxisPop = d3.axisBottom(xScalePop).ticks(5).tickFormat(d3.format('d'));
                thisG.append('g')
                    .attr('id','xAxisPop')
                    .attr('class','axis')
                    .attr('transform','translate('+0+','+(totalPopHeight+padding.b)+')')
                    .call(xAxisPop);
                thisG.append('text')
                    .attr('id','xLabel')
                    .attr('text-anchor','middle')
                    .attr('transform','translate('+(interiorChartWidth/2)+','+(totalPopHeight+padding.b+32)+')')
                    .style('font-family','PT Sans, sans-serif')
                    .style('font-size','12px')
                    .text(keys[i]);

                var totalLine = d3.line()
                    .x(function(d){ return xScalePop(d.year);})
                    .y(function(d){ return yScalePop(d.population);});
                thisG.append('path')
                    .attr('class','line')
                    .attr('d',totalLine(data))
                    .style('stroke','#b2641a')
                    .style('stroke-width','1.5px')
                    .style('stroke-opacity','0.7')
                    .style('fill','none');

                var percentLine = d3.line()
                    .x(function(d){ return xScalePop(d.year);})
                    .y(function(d){ return yScalePer(d.change);});
                thisG.append('path')
                    .attr('class','line')
                    .attr('d',percentLine(percentChange))
                    .style('stroke','#b23d1a')
                    .style('stroke-width','1.5px')
                    .style('stroke-opacity','0.7')
                    .style('fill','none');
            }
        });

    //Legend
    totalPopChartG.append('circle')
        .attr('r','3px')
        .attr('transform','translate(730,-38)')
        .style('fill','#b2641a')
        .style('fill-opacity','0.7');
    totalPopChartG.append('text')
        .attr('class','charttitle')
        .attr('transform','translate(745,-36)')
        .style('font-family','PT Sans, sans-serif')
        .style('font-size','12px')
        .text('Total population');
    totalPopChartG.append('circle')
        .attr('r','3px')
        .attr('transform','translate(730,-24)')
        .style('fill','#b23d1a')
        .style('fill-opacity','0.7');
    totalPopChartG.append('text')
        .attr('class','charttitle')
        .attr('transform','translate(745,-22)')
        .style('font-family','PT Sans, sans-serif')
        .style('font-size','12px')
        .text('Percent change');

    // Remember code outside of the data callback function will run before the data loads
}