let w = 1400;
let h = 500;
let padding = 75;

const svg = d3.select('svg')
  .attr('width', w)
  .attr('height', h)




fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(resp => resp.json())
  .then(data => {

    const yearArr = data.monthlyVariance.map(elem => elem.year)
      .filter( (elem, index, arr) => {
        return arr.indexOf(elem) === index;
      })



// Scales

    const yScale = d3.scaleTime()
      .domain([new Date(0,0,0,0, 0, 0, 0), new Date(0,12,0,0,0,0,0)])
      .range([padding, h-padding])

    const xScale = d3.scaleLinear()
      .domain(d3.extent(yearArr))
      .range([padding, w-padding])

    const yMap = d3.scaleLinear()
      .domain([1, 13])
      .range([padding, h-padding])

// Draw
    const mv = data.monthlyVariance

// Optionally remove trace border between rects
    // svg.append('g')
    //   .append('rect')
    //   .attr('width', w-(padding*2))
    //   .attr('height', h-(padding*2))
    //   .attr('x',padding)
    //   .attr('y',padding)
    //   .attr('fill', 'white')

    svg.selectAll('rect')
      .data(mv)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('data-month', d=>d.month-1)
      .attr('data-year', d=>d.year)
      .attr('data-temp', d=>d.variance + 8.66)
      .attr('width', (w- 2*padding)/(mv.length/12))
      .attr('height', (h-(2*padding))/12)
      .attr('x', d => xScale(d.year))
      .attr('y', d => yMap(d.month))
      .style('fill', d => {
        // variance: -7 to 5.3
        let v = d.variance
        if(v < -5) return 'rgb(0, 73, 149)'
        else if(v < -3.5) return 'rgb(0, 126, 189)'
        else if(v < -2) return 'rgb(0, 207, 227)'
        else if(v < -1) return 'rgb(99, 242, 251)'
        else if(v < -.5) return 'rgb(170, 250, 255)'
        else if(v < 0) return 'rgb(255, 249, 115)'
        else if(v < .5) return 'rgb(255, 211, 97)'
        else if(v < 1) return 'rgb(255, 159, 117)'
        else if(v < 2) return 'rgb(215, 96, 44)'
        else if(v < 5.5) return 'rgb(147, 0, 0)'
        else return 'black'
      })

      .on('mouseover', (e,d) => {
        const monthFormat = (m) => {
          switch(m) {
            case 1 : return 'January';
            case 2 : return 'February';
            case 3 : return 'March';
            case 4 : return 'April';
            case 5 : return 'May';
            case 6 : return 'June';
            case 7 : return 'July';
            case 8 : return 'August';
            case 9 : return 'September';
            case 10 : return 'October';
            case 11 : return 'November';
            case 12 : return 'December';
          }
        }
        tooltip.html(`${monthFormat(d.month)} - ${d.year} <br/> ${(d.variance + 8.66).toFixed(2)}°`)
          .style('left', event.pageX + 'px')
          .style('bottom', h-event.pageY + 450 +'px')
          .attr('data-year', d.year)
          .style('visibility', 'visible')
      })
      .on('mouseout', (e,d) => {
        tooltip.style('visibility', 'hidden')
      })

// Axes

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => d3.timeFormat("%B")(d))

    svg.append('g')
      .call(yAxis)
      .attr('transform', 'translate('+(padding)+',0)')
      .attr('id', 'y-axis')
      .attr('font-size','13')
      .attr('font-family','avenir')

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => String(d))
      .ticks(15)

    svg.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,'+(h-padding)+')')
      .attr('id', 'x-axis')
      .attr('font-size','13px')
      .attr('font-family', 'avenir')


// Legend
    let lw = 550;
    let lh = 35;

    const legend = d3.select('.container')
      .append('svg')
      .attr('id', 'legend')
      .attr('width', lw)
      .attr('height', lh)

    const colors = [-5, -3.5, -2, -1, -.5, 0, .5, 1, 2, 5.5]
    legend.selectAll('rect')
      .data(colors)
      .enter()
      .append('rect')
      .attr('width', lw/colors.length)
      .attr('height', lh)
      .attr('x', (d,i) => i*(lw/colors.length))
      .attr('fill', d => {
        if(d == -5) return 'rgb(0, 73, 149)'
        else if(d == -3.5) return 'rgb(0, 126, 189)'
        else if(d == -2) return 'rgb(0, 207, 227)'
        else if(d == -1) return 'rgb(99, 242, 251)'
        else if(d == -.5) return 'rgb(170, 250, 255)'
        else if(d == 0) return 'rgb(255, 249, 115)'
        else if(d == .5) return 'rgb(255, 211, 97)'
        else if(d == 1) return 'rgb(255, 159, 117)'
        else if(d == 2) return 'rgb(215, 96, 44)'
        else if(d == 5.5) return 'rgb(147, 0, 0)'
      })

// Legend Labels
    const legendArr = colors.map(elem => 8.66+elem)

    d3.select('.container')
      .append('p')
      .html(legendArr.join('° &nbsp;&nbsp;-&nbsp;&nbsp;&nbsp; ')+'°')
      .style('font-size', '12px')
      .style('font-family', 'avenir')


// tooltip
const tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')

  })
