function top20BubblesAndTable(){
        // Create a group element for appending chart elements
    var top20ChartG = svg.append('g')
        .attr('id','top20ChartG')
        .attr('class','economics')
        .attr('transform','translate('+padding.l+',0)');

    top20ChartG.append('text')
        .attr('class','charttitle')
        .attr('text-anchor','middle')
        .attr('transform','translate('+(svgWidth/2-padding.l)+','+(2.5*padding.t-10)+')')
        .style('font-family','PT Sans, sans-serif')
        .text('Top 20 By Employment and Year Established');

    // Compute chart dimensions
    var chartWidth = (svgWidth - padding.l - padding.r);
    var chartHeight = (svgHeight/5 - padding.t - padding.b);

    //Do the same for the table
    var top20TableG = svg.append('g')
        .attr('id','top20TableG')
        .attr('class','economics')
        .attr('transform','translate('+17*padding.l+','+4*padding.t+')');

    top20TableG.append('text')
        .attr('class','charttitle')
        .attr('transform','translate(94,-36)')
        .style('font-family','PT Sans, sans-serif')
        .text('Top 20 By Employment');

    // Compute table dimensions
    var tableWidth = (svgWidth/2.5 - padding.l - padding.r);
    var tableHeight = (svgHeight/6 - padding.t - padding.b);


    // Create a d3-tooltip object and inject in html
    var top20Tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d) {
            // Inject html, when creating your html I recommend editing the html within your index.html first
            return "<h5>"+d['name']+"</h5><table><thead><tr><td>Year Established</td><td># Employees</td></tr></thead>"
                    + "<tbody><tr><td>"+d.established+"</td><td>"+d.employees+"</td></tr></tbody>"
                    + "<thead><tr><td colspan=2>Description</td></tr></thead>"
                    + "<tbody><tr><td colspan=2>"+d.description+"</td></tr></tbody></table>"
        });

    // Initialize tooltip on the svg, this adds the tooltip div to the <body> element
    svg.call(top20Tip);

    d3.csv('./data/Top20ByEmployment.csv',
        // Load data and use this function to process each row
        function(row) {
            return {
                'name': row['name'],
                'description': row['description'],
                'employees': +row['employees'],
                'established': +row['established']
            };
        },
        function(error, dataset) {
            // Log and return from an error
            if(error) {
                console.error('Error while loading ./Top20ByEmployment.csv dataset.');
                console.error(error);
                return;
            }

            top20 = dataset.sort(function(x,y){
                return d3.descending(x.employees, y.employees);
            });
            //console.log(top20);

            //Make the chart
            var yearScale = d3.scaleLinear()
                .domain([1860, 2020])
                .range([0, chartWidth-padding.l-padding.r]);
            var yearAxis = d3.axisBottom(yearScale).tickFormat(d3.format('d'));

            var empExtent = d3.extent(top20, function(d){
                return d.employees;
            });
            //console.log(empExtent);
            var rScale = d3.scaleSqrt()
                .domain(empExtent)
                .range([4, 32]);

            top20ChartG.append('g')
                .attr('id','yearAxis')
                .attr('class','axis')
                .attr('transform','translate('+padding.l+','+(32+2.5*padding.t)+')')
                .call(yearAxis);

            var top20bubbles = top20ChartG.selectAll('.top20bubble')
                .data(top20)
                .enter()
                .append('g')
                .attr('class','top20bubble')
                .attr('transform', function(d){
                    var tx = yearScale(d.established)+padding.l;
                    var ty = 32 + 2.5*padding.t;
                    return 'translate('+tx+','+ty+')';
                })
                .on('mouseover',top20Tip.show)
                .on('mouseout',top20Tip.hide);

            top20bubbles.append('circle')
                .attr('id',function(d){return 'bubble'+d.name.substring(0,3);})
                .attr('r',function(d){return rScale(d.employees);})
                .attr('class','top20bubble')
                .on('mouseover',function(d){
                    d3.select('#entry'+d.name.substring(0,3)).selectAll('text')
                        .style('font-weight','bold');
                })
                .on('mouseout',function(d){
                    d3.select('#entry'+d.name.substring(0,3)).selectAll('text')
                        .style('font-weight','normal');
                });

            
            
            //==================================================================================================
            //Now make the table
            top20TableG.append('line')
                .attr('x1','0')
                .attr('x2',tableWidth)
                .attr('y1','0.5')
                .attr('y2','0.5')
                .attr('stroke','#000')
                .attr('shape-rendering','crisp-edges');
            top20TableG.append('line')
                .attr('x1','0')
                .attr('x2',tableWidth)
                .attr('y1','-4.5')
                .attr('y2','-4.5')
                .attr('stroke','#000')
                .attr('shape-rendering','crisp-edges');

            var yScaleText = d3.scaleBand()
                .domain(d3.map(top20, d => d.name).keys())
                .rangeRound([0, tableHeight+padding.b])
                .padding(4);

            top20TableG.append('text')
                .attr('transform','translate(120, -10)')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .style('font-weight','bold')
                .text('Employer');

            top20TableG.append('text')
                .attr('transform','translate(30, -10)')
                .style('font-family','PT Sans, sans-serif')
                .style('font-size','12px')
                .style('font-weight','bold')
                .text('# Employees');

            var tableEntries = top20TableG.selectAll('g')
                .data(top20)
                .enter()
                .append('g')
                .attr('id',function(d){return 'entry'+d.name.substring(0,3);})
                .attr('transform',function(d){
                    return 'translate(0,'+(yScaleText(d.name)+7)+')';
                })
                .on('mouseover', function(d){
                    d3.select('#bubble'+d.name.substring(0,3))
                        .style('fill','#b23d1a')
                        .style('fill-opacity','0.8')
                        .style('stroke-opacity','1');
                    d3.select(this).selectAll('text')
                        .style('font-weight','bold');
                })
                .on('mouseout', function(d){
                    d3.select('#bubble'+d.name.substring(0,3))
                        .style('fill','#b2641a')
                        .style('fill-opacity','0.7')
                        .style('stroke-opacity','0.3');
                    d3.select(this).selectAll('text')
                        .style('font-weight','normal');
                });
            
            tableEntries.each(function(){
                d3.select(this)
                    .append('text')
                    .attr('transform','translate(120,0)')
                    .style('font-family','PT Sans, sans-serif')
                    .style('font-size','12px')
                    .text(function(d){return d.name;});
            });

            tableEntries.each(function(){
                d3.select(this)
                    .append('text')
                    .attr('transform','translate(30,0)')
                    .style('font-family','PT Sans, sans-serif')
                    .style('font-size','12px')
                    .text(function(d){return d.employees;});
            });
        });

    // Remember code outside of the data callback function will run before the data loads
}