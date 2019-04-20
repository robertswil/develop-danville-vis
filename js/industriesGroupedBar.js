function industriesGroupedBars(){
    // Create a group element for appending chart elements
    var industriesChartG = svg.append('g')
        .attr('id','industriesChartG')
        .attr('class','economics')
        .attr('transform','translate('+5*padding.l+','+4*padding.t+')');

    industriesChartG.append('text')
        .attr('class','charttitle')
        .attr('transform','translate(65,-36)')
        .style('font-family','PT Sans, sans-serif')
        .text('Employment by Major Industry, 2017');

    // Compute chart dimensions
    var industriesWidth = (svgWidth/2 - padding.l - padding.r);
    var industriesHeight = (svgHeight/6 - padding.t - padding.b);

    options = {
        absolute: false,
        percent: true
    };
    domains = {
        absolute: [0, 60000],
        percent: [0, 40]
    };

    d3.csv('./data/EmploymentByMajorIndustryByPlaceOfWork2017.csv',
        // Load data and use this function to process each row
        function(row) {
            return {
                'name': row['name'],
                'scope': row['scope'],
                'employment': +row['employment']
            };
        },
        function(error, dataset) {
            // Log and return from an error
            if(error) {
                console.error('Error while loading ./data/EmploymentByMajorIndustryByPlaceOfWork2017.csv dataset.');
                console.error(error);
                return;
            }

            industries = dataset.sort(function(x,y){
                return d3.descending(x.employment, y.employment);
            });

            totalEmployment = d3.nest()
                .key(function(d){ return d.scope;})
                .rollup(function(v){ return d3.sum(v, function(d){return d.employment;})})
                .object(industries);

            var names = d3.map(industries, function(d){
                return d.name;
            }).keys();
            var categories = d3.map(industries, function(d){
                return d.scope;
            }).keys();

            colorScale = d3.scaleOrdinal()
                .domain(categories)
                .range(['#b2641a', '#b23d1a']);

            yScaleOuter = d3.scaleBand()
                .domain(names)
                .rangeRound([0, industriesHeight+padding.b])
                .paddingInner(0.1);
            yScaleInner = d3.scaleBand()
                .domain(categories)
                .rangeRound([0, yScaleOuter.bandwidth()])
                .padding(0.05);
            yAxisIndustries = d3.axisLeft(yScaleOuter);
            industriesChartG.append('g')
                .attr('id','yAxisIndustries')
                .attr('class','axis')
                .call(yAxisIndustries);

            industriesChartG.append('g')
                .attr('id','xAxisIndustriesBottom')
                .attr('class','axis')
                .attr('transform','translate('+0+','+(industriesHeight+padding.b)+')');
            industriesChartG.append('text')
                .attr('id','xLabel')
                .attr('transform','translate('+(industriesWidth/2-2*padding.l)+','+(industriesHeight+padding.b+32)+')')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text(function(){
                    if(options.absolute){
                        return 'Total Employment';
                    }else{
                        return 'Percent Employment'
                    }
                });

            industriesChartG.append('g')
                .attr('id','xAxisIndustriesTop')
                .attr('class','axis')
                .attr('transform','translate('+0+',0)');

            if(options.absolute){
                xScale = d3.scaleLinear()
                    .domain(domains.absolute)
                    .range([0, industriesWidth - padding.l-padding.r]);
            }else{
                xScale = d3.scaleLinear()
                    .domain(domains.percent)
                    .range([0, industriesWidth - padding.l-padding.r]);
            }
        
            xAxisIndustriesBottom = d3.axisBottom(xScale).ticks(6);
            xAxisIndustriesTop = d3.axisTop(xScale).ticks(6);
        
            d3.select('#xAxisIndustriesBottom')
                .call(xAxisIndustriesBottom);
            
            d3.select('#xAxisIndustriesTop')
                .call(xAxisIndustriesTop);
        
            industriesChartG.selectAll('.industryRect.data')
                .data(industries)
                .enter()
                .append('rect')
                .attr('class','industryRect data')
                .attr('width',function(d){
                    if(options.absolute){
                        return xScale(d.employment);
                    }else{
                        return xScale(100*d.employment/totalEmployment[d.scope]);
                    }
                })
                .attr('height',yScaleInner.bandwidth())
                .attr('transform',function(d){
                    var tx = 0;
                    var ty = yScaleOuter(d.name) + yScaleInner(d.scope);
                    return 'translate('+tx+','+ty+')';
                })
                .style('fill',function(d){return colorScale(d.scope);});

            var industriesLegend = industriesChartG.append('g')
                .attr('id','industriesLegend')
                .attr('transform','translate('+(0.5*industriesWidth)+','+(0.8*industriesHeight)+')');

            industriesLegend.selectAll('.rect')
                .data(categories)
                .enter()
                .append('rect')
                .attr('class','industryRect')
                .attr('width',yScaleInner.bandwidth())
                .attr('height',yScaleInner.bandwidth())
                .attr('transform',function(d,i){
                    return 'translate(0,'+i*(yScaleInner.bandwidth()+2)+')';
                })
                .style('fill',function(d){return colorScale(d);});

            industriesLegend.selectAll('text')
                .data(categories)
                .enter()
                .append('text')
                .attr('class','chartlegend')
                .attr('transform', function(d,i){
                    var tx = yScaleInner.bandwidth()+4;
                    var ty = i*(yScaleInner.bandwidth()+2)+10;
                    return 'translate('+tx+','+ty+')';
                })
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text(function(d){return d;});

            var industriesButton = industriesChartG.append('g')
                .attr('id','industriesButton')
                .attr('transform','translate('+(0.49*industriesWidth)+','+(1*industriesHeight)+')')
                .on('click', update);
            industriesButton.append('rect')
                .attr('width','130px')
                .attr('height','20px')
                .attr('rx','5')
                .attr('ry','5')
                .style('fill','#9999ff')
                .style('fill-opacity','0.3')
                .style('stroke','#111')
                .style('stroke-width','0.5px');
            industriesButton.append('text')
                .attr('transform','translate(31,14)')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .text('Switch views');

            update();
        });

    // Remember code outside of the data callback function will run before the data loads

    function update(){
        if(options.absolute){
            xScale.domain(domains.absolute);
        }else{
            xScale.domain(domains.percent);
        }

        d3.select('#xAxisIndustriesBottom').transition().call(xAxisIndustriesBottom);
        d3.select('#xAxisIndustriesTop').transition().call(xAxisIndustriesTop);

        industriesChartG.selectAll('.industryRect.data')
            .transition()
            .attr('width',function(d){
                if(options.absolute){
                    return xScale(d.employment);
                }else{
                    return xScale(100*d.employment/totalEmployment[d.scope]);
                }
            });
        industriesChartG.select('#xLabel')
            .text(function(){
                if(options.absolute){
                    return 'Total Employment';
                }else{
                    return 'Percent Employment'
                }
            });

        if(options.absolute){
            options.absolute = false;
            options.percent = true;
        }else{
            options.absolute = true;
            options.percent = false;
        }
    }
}