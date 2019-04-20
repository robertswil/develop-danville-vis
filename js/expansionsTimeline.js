function expansionTimeline(){
        // Create a group element for appending chart elements
    var expTimeG = svg.append('g')
        .attr('id','expTimeG')
        .attr('class','economics')
        .attr('transform','translate('+padding.l+','+4.5*padding.t+')');

    expTimeG.append('text')
        .attr('class','charttitle')
        .attr('text-anchor','middle')
        .attr('transform','translate('+(svgWidth/2-padding.l)+','+(2.5*padding.t-10)+')')
        .style('font-family','PT Sans, sans-serif')
        .text('Investments in New Locations and Expansions, 2016-present');

    // Compute chart dimensions
    var expWidth = (svgWidth - padding.l - padding.r);
    var expHeight = (svgHeight/5 - padding.t - padding.b);


    // Create a d3-tooltip object and inject in html
    var expTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d) {
            // Inject html, when creating your html I recommend editing the html within your index.html first
            return "<h5>"+d.name+"</h5><table><thead><tr><td colspan=2>Investment</td></tr></thead>"
                    + "<tbody><tr><td colspans=2>"+d.investmentString+"</td></tr></tbody>"
                    + "<thead><tr><td>Type</td><td>Sector</td></tr></thead>"
                    + "<tbody><tr><td>"+d.type+"</td><td>"+d.sector+"</td></tr></tbody>"
                    + "<thead><tr><td>Date</td><td>Operational?</td></tr></thead>"
                    + "<tbody><tr><td>"+d.dateString+"</td><td>"+d.operational+"</td></tr></tbody></table>"
        });

    // Initialize tooltip on the svg, this adds the tooltip div to the <body> element
    svg.call(expTip);

    formatComma = d3.format(',');
    parseTime = d3.timeParse('%m/%d/%Y');
    function parseInvestment(v){
        if(v>0){
            return '$'+formatComma(v);
        }else{
            return "--unk--";
        }
    }

    d3.csv('./data/RecentLocationsAndExpansions2016Present.csv',
        // Load data and use this function to process each row
        function(row) {
            return {
                'date': parseTime(row['date']),
                'dateString': row['date'],
                'type': row['type'],
                'sector': row['sector'],
                'name': row['company'],
                'description': row['description'],
                'employment': +row['employment'],
                'investment': +row['investment'],
                'investmentString': parseInvestment(+row['investment']),
                'operational': row['operational']
            };
        },
        function(error, dataset) {
            // Log and return from an error
            if(error) {
                console.error('Error while loading ./RecentLocationsAndExpansions.csv dataset.');
                console.error(error);
                return;
            }

            exp = dataset.sort(function(x,y){
                return d3.descending(x.investment, y.investment);
            });

            //Make the chart
            var timeScale = d3.scaleTime()
                .domain(d3.extent(exp, function(d){
                    return d.date;
                }))
                .range([0, expWidth-padding.l-padding.r]);
            var timeAxis = d3.axisBottom(timeScale);

            var invExtent = d3.extent(exp, function(d){
                return d.investment;
            });
            
            var rScale = d3.scaleSqrt()
                .domain(invExtent)
                .range([4, 32]);

            expTimeG.append('g')
                .attr('id','timeAxis')
                .attr('class','axis')
                .attr('transform','translate('+padding.l+','+(32+2.5*padding.t)+')')
                .call(timeAxis);

            var expBubbles = expTimeG.selectAll('.expBubble')
                .data(exp)
                .enter()
                .append('g')
                .attr('class','expBubble')
                .attr('transform', function(d){
                    var tx = timeScale(d.date)+padding.l;
                    var ty = 32 + 2.5*padding.t;
                    return 'translate('+tx+','+ty+')';
                })
                .on('mouseover',expTip.show)
                .on('mouseout',expTip.hide);

            expBubbles.append('circle')
                .attr('id',function(d){return 'exp'+d.name.substring(0,3);})
                .attr('r',function(d){return rScale(d.investment);})
                .attr('class','top20bubble');
        });

    // Remember code outside of the data callback function will run before the data loads
}