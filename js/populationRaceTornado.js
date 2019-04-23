function populationRaceTornado(){
    // Create a group element for appending chart elements
    var raceChartG = svg.append('g')
        .attr('id','raceChartG')
        .attr('class','population')
        .attr('transform','translate('+padding.l+','+5.25*padding.t+')');

    raceChartG.append('text')
        .attr('class','charttitle')
        .attr('transform','translate(65,-45)')
        .style('font-family','PT Sans, sans-serif')
        .text('Population by Race and Hispanic Origin, 2017');

    // Compute chart dimensions
    var raceWidth = (svgWidth/2 - padding.l - padding.r);
    var raceHeight = (svgHeight/7 - padding.t - padding.b);

    // Create a d3-tooltip object and inject in html
    var raceTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d) {
            // Inject html, when creating your html I recommend editing the html within your index.html first
            return "<table><thead><tr><td>Race</td></tr></thead>"
                    + "<tbody><tr><td>"+d.race+"</td></tr></tbody>"
                    + "<thead><tr><td>Percent</td></tr></thead>"
                    + "<tbody><tr><td>"+(100*d.number/totalPerScopeRace[d.scope]).toFixed(1)+"%</td></tr></tbody>"
        });

    // Initialize tooltip on the svg, this adds the tooltip div to the <body> element
    svg.call(raceTip);

    d3.csv('./data/PopulationByRaceAndHispanicOrigin2017.csv',
        // Load data and use this function to process each row
        function(row) {
            return {
                'race': row['race'],
                'scope': row['scope'],
                'number': +row['number']
            };
        },
        function(error, dataset) {
            // Log and return from an error
            if(error) {
                console.error('Error while loading ./data/PopulationByRaceAndHispanicOrigin2017.csv dataset.');
                console.error(error);
                return;
            }

            race = dataset.sort(function(x,y){
                return d3.descending(x.number, y.number);
            });

            totalPerScopeRace = d3.nest()
                .key(function(d){ return d.scope;})
                .rollup(function(v){ return d3.sum(v, function(d){return d.number;})})
                .object(race);
                console.log(totalPerScopeRace);

            var names = d3.map(race, function(d){
                return d.race;
            }).keys();
            var categories = d3.map(race, function(d){
                return d.scope;
            }).keys();

            colorScale = d3.scaleOrdinal()
                .domain(categories)
                .range(['#b2641a', '#b23d1a']);

            yScaleRace = d3.scaleBand()
                .domain(names)
                .rangeRound([0, raceHeight])
                .padding(0.1);

            raceChartG.append('g')
                .attr('id','xAxisRaceLeft')
                .attr('class','axis');
            raceChartG.append('g')
                .attr('id','xAxisRaceRight')
                .attr('class','axis')
                .attr('transform','translate('+(raceWidth/2+7)+',0)');
            raceChartG.append('text')
                .attr('id','xLabelLeft')
                .attr('text-anchor','middle')
                .attr('transform','translate('+(raceWidth/4)+','+(-20)+')')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text('Labor Market Area');
            raceChartG.append('text')
                .attr('id','xLabelRight')
                .attr('text-anchor','middle')
                .attr('transform','translate('+(3*raceWidth/4+7)+','+(-20)+')')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text('Boyle County');

            xScaleLeft = d3.scaleLinear()
                .domain([0,100])
                .range([raceWidth/2, 0]);
            xScaleRight = d3.scaleLinear()
                .domain([0,100])
                .range([0, raceWidth/2]);
        
            xAxisRaceLeft = d3.axisTop(xScaleLeft).ticks(6);
            xAxisRaceRight = d3.axisTop(xScaleRight).ticks(6);
            d3.select('#xAxisRaceLeft')
                .call(xAxisRaceLeft);
            
            d3.select('#xAxisRaceRight')
                .call(xAxisRaceRight);
        
            raceChartG.selectAll('.raceRect.data')
                .data(race)
                .enter()
                .append('rect')
                .attr('class','raceRect data')
                .attr('width',function(d){
                    if(d.scope == 'Labor Market Area'){
                        return xScaleLeft(100-100*d.number/totalPerScopeRace[d.scope]);
                    }else if(d.scope == 'Boyle County'){
                        return xScaleRight(100*d.number/totalPerScopeRace[d.scope]);
                    }
                })
                .attr('height',yScaleRace.bandwidth())
                .attr('transform',function(d){
                    if(d.scope == 'Labor Market Area'){
                        var tx = raceWidth/2 - xScaleLeft(100-100*d.number/totalPerScopeRace[d.scope]);
                    }else if(d.scope == 'Boyle County'){
                        var tx = raceWidth/2+7;
                    }
                    var ty = yScaleRace(d.race);
                    return 'translate('+tx+','+ty+')';
                })
                .style('fill',function(d){return colorScale(d.scope);})
                .on('mouseover',raceTip.show)
                .on('mouseout',raceTip.hide);

            var nested = d3.nest().key(function(d){return d.scope;}).entries(race)[0].values;
            raceChartG.selectAll('.rectLabel')
                .data(nested)
                .enter()
                .append('text')
                .attr('class','rectLabel')
                .attr('text-anchor','start')
                .attr('transform',function(d){
                    var ty = yScaleRace(d.race)+11;
                    return 'translate('+0+','+ty+')';
                })
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text(function(d){return d.race;})
        });
    }
    // Remember code outside of the data callback function will run before the data loads