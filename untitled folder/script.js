let url ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest();
let data 

let dataArray = []

let yScale 
let xScale
let xAxisScale
let yAxisScale


let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let makeSVG = () => {
  svg.attr("width",width)
  svg.attr("height",height)
}

let makeScale = () => {
  
  yScale = d3.scaleLinear()
             .domain([0,d3.max(dataArray,(d)=>d[1])])
             .range([0,height-(2*padding)])
  
  xScale = d3.scaleLinear()
             .domain([0,dataArray.length-1])
             .range([padding,width-padding])
  
  let datesArray = dataArray.map((d)=>new Date(d[0]))
  
  xAxisScale = d3.scaleTime()
                 .domain([d3.min(datesArray),d3.max(datesArray)])
                 .range([padding,width-padding])
  yAxisScale = d3.scaleLinear()
                 .domain([0,d3.max(dataArray,(d)=>d[1])])
                 .range([height-padding,padding])
 
}

let makeBars = () => {
  
  let tooltip = d3.select("body")
                  .append('div')
                  .attr("id","tooltip")
                  .style("visibility","hidden")
                  .style("width","auto")
                  .style("height","auto")
  
 
    
  
  svg.selectAll("rect")
                 .data(dataArray)
                 .enter()
                 .append("rect")
                 .attr('class','bar')
                 .attr("width",(width - (2*padding))/dataArray.length)
                 .attr("data-date",(d)=>d[0])
                 .attr("data-gdp",(d)=>d[1])
                 .attr("height",(d) => yScale(d[1]))
                 .attr("x",(d,i)=>xScale(i))
                 .attr("y",(d)=>(height-padding)-yScale(d[1]))
                 .on("mouseover", (d,i)=> {
                     tooltip.transition()
                    .style("visibility","visible")
                     tooltip.text(d[0])
                    
                document.querySelector("#tooltip").setAttribute("data-date",d[0])
                     
  })
                 .on("mouseout",(d)=>{
                     tooltip.transition()
                     .style("visibility","hidden")
  })
    
}

let makeAxis = () => {
  
  let xAxis = d3.axisBottom(xAxisScale)
  svg.append('g')
     .call(xAxis)
     .attr("id","x-axis")
     .attr("transform","translate(0 ," + (height - padding) + ")")
  
  let yAxis = d3.axisLeft(yAxisScale)
  svg.append('g')
     .call(yAxis)
     .attr("id","y-axis")
     .attr("transform","translate(" + padding + ")",0)
}

req.open('GET',url,true)
req.onload = () => {
  data = JSON.parse(req.responseText)
  dataArray = data.data
  makeSVG()
  makeScale()
  makeBars()
  makeAxis()
}
req.send()