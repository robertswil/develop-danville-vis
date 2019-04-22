function populationAgeTornado(){
    // Create a group element for appending chart elements
    var ageChartG = svg.append('g')
        .attr('id','ageChartG')
        .attr('class','population')
        .attr('transform','translate('+(svgWidth/2+padding.l)+','+5.25*padding.t+')');

    ageChartG.append('text')
        .attr('class','charttitle')
        .attr('text-anchor','middle')
        .attr('transform','translate('+(svgWidth/4-padding.l)+',-45)')
        .style('font-family','PT Sans, sans-serif')
        .text('Population by Age Group, 2017');

    // Compute chart dimensions
    var ageWidth = (svgWidth/2 - padding.l - padding.r);
    var ageHeight = (svgHeight/7 - padding.t - padding.b);

    // Create a d3-tooltip object and inject in html
    var ageTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d) {
            // Inject html, when creating your html I recommend editing the html within your index.html first
            return "<table><thead><tr><td>Age</td></tr></thead>"
                    + "<tbody><tr><td>"+d.age+"</td></tr></tbody>"
                    + "<thead><tr><td>Percent</td></tr></thead>"
                    + "<tbody><tr><td>"+(100*d.number/totalPerScope[d.scope]).toFixed(1)+"%</td></tr></tbody>"
        });

    // Initialize tooltip on the svg, this adds the tooltip div to the <body> element
    svg.call(ageTip);

    d3.csv('./data/PopulationBySelectedAgeGroups2017.csv',
        // Load data and use this function to process each row
        function(row) {
            return {
                'age': row['age'],
                'scope': row['scope'],
                'number': +row['number']
            };
        },
        function(error, age) {
            // Log and return from an error
            if(error) {
                console.error('Error while loading ./data/PopulationBySelectedAgeGroups2017.csv dataset.');
                console.error(error);
                return;
            }

            totalPerScope = d3.nest()
                .key(function(d){ return d.scope;})
                .rollup(function(v){ return d3.sum(v, function(d){return d.number;})})
                .object(age);

            var names = d3.map(age, function(d){
                return d.age;
            }).keys().reverse();
            var categories = d3.map(age, function(d){
                return d.scope;
            }).keys();

            colorScale = d3.scaleOrdinal()
                .domain(categories)
                .range(['#b2641a', '#b23d1a']);

            yScaleAge = d3.scaleBand()
                .domain(names)
                .rangeRound([0, ageHeight])
                .padding(0.1);

            ageChartG.append('g')
                .attr('id','xAxisAgeLeft')
                .attr('class','axis');
            ageChartG.append('g')
                .attr('id','xAxisAgeRight')
                .attr('class','axis')
                .attr('transform','translate('+(ageWidth/2+7)+',0)');
            ageChartG.append('text')
                .attr('text-anchor','middle')
                .attr('transform','translate('+(ageWidth/4)+','+(-20)+')')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text('Labor Market Area');
            ageChartG.append('text')
                .attr('text-anchor','middle')
                .attr('transform','translate('+(3*ageWidth/4+7)+','+(-20)+')')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text('Boyle County');

            xScaleAgeLeft = d3.scaleLinear()
                .domain([0,40])
                .range([ageWidth/2, 0]);
            xScaleAgeRight = d3.scaleLinear()
                .domain([0,40])
                .range([0, ageWidth/2]);
        
            xAxisAgeLeft = d3.axisTop(xScaleAgeLeft).ticks(6);
            xAxisAgeRight = d3.axisTop(xScaleAgeRight).ticks(6);
            d3.select('#xAxisAgeLeft')
                .call(xAxisAgeLeft);
            
            d3.select('#xAxisAgeRight')
                .call(xAxisAgeRight);
        
            ageChartG.selectAll('.ageRect.data')
                .data(age)
                .enter()
                .append('rect')
                .attr('class','ageRect data')
                .attr('width',function(d){
                    if(d.scope == 'Labor Market Area'){
                        return xScaleAgeLeft(40-100*d.number/totalPerScope[d.scope]);
                    }else if(d.scope == 'Boyle County'){
                        return xScaleAgeRight(100*d.number/totalPerScope[d.scope]);
                    }
                })
                .attr('height',yScaleAge.bandwidth())
                .attr('transform',function(d){
                    if(d.scope == 'Labor Market Area'){
                        var tx = ageWidth/2 - xScaleAgeLeft(40-100*d.number/totalPerScope[d.scope]);
                    }else if(d.scope == 'Boyle County'){
                        var tx = ageWidth/2+7;
                    }
                    var ty = yScaleAge(d.age);
                    return 'translate('+tx+','+ty+')';
                })
                .style('fill',function(d){return colorScale(d.scope);})
                .style('fill-opacity','0.7')
                .on('mouseover',ageTip.show)
                .on('mouseout',ageTip.hide);

            var nested = d3.nest().key(function(d){return d.scope;}).entries(age)[0].values;
            ageChartG.selectAll('.rectLabel')
                .data(nested)
                .enter()
                .append('text')
                .attr('class','rectLabel')
                .attr('text-anchor','start')
                .attr('transform',function(d){
                    var ty = yScaleAge(d.age)+11;
                    return 'translate('+0+','+ty+')';
                })
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text(function(d){return d.age;})
        });
    }
    // Remember code outside of the data callback function will run before the data loads