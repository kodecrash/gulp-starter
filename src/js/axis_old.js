/**
 * @author vijay
 */

function axis(start,end,intersect,allowNeg,orientation,numTicks,precision,color,unit, displayUnit){
this.start=start;
this.end=end;
this.startValue = 0;
this.endValue = 10;
this.intersect=intersect;
this.rangeStart = -10;
this.rangeEnd = 10;
this.allowNeg=true;
this.orientation=orientation;
this.numMajorTicks=10;
this.precision=1;
this.color=color;
this.initialDistance=0;
this.unit=unit;
this.displayUnit=displayUnit;
this.numMinorTicks=10;
this.majorTickDist = (this.end - this.start)/this.numMajorTicks;
this.handle = 0;
this.handleTicks = 0;
this.minorTickDist=0;
// console.log("axis: majorTickDist = " + this.majorTickDist)
this.draw=drawAxis;
this.getUnit=axisGetUnit;
this.getX=axisGetX;
this.setPrecision=axisSetPrecision;
this.leftIntervalShift = leftIntervalShift;
//this.rightIntervalShift = rightIntervalShift;
this.moveAxis = moveAxis;
this.CalculateMultipler = CalculateMultipler;
this.multipler = 0;
this.drawMinorTick = drawMinorTick;
this.drawMajorTick = drawMajorTick;
this.rangeMarkers = rangeMarkers;

}; // end Object axis

function rangeMarkers(initialPoints){
      $(".markers").css("display","none");
        var firstpoint = Math.floor(initialPoints.x/this.majorTickDist),
       secondpoint = Math.floor(initialPoints.y/this.majorTickDist);
        previousPrecision = this.precision;
    if(Math.abs(secondpoint - firstpoint) <= 1){
        var val =  min(firstpoint,secondpoint)
        leftMarkerSmallRange.css("display","block");
        leftMarkerSmallRangeSpan.text( (this.startValue+(val*previousPrecision)));
        rightMarkerSmallRange.css("display","block");
        rightMarkerSmallRangeSpan.text( (this.startValue+((val+1)*previousPrecision)));
        leftMarkerSmallRange.width(40 +leftMarkerSmallRangeSpan.outerWidth()+2 ).css("left",this.getX(val)-(40 +leftMarkerSmallRangeSpan.outerWidth()));
        rightMarkerSmallRange.width(40 +rightMarkerSmallRangeSpan.outerWidth()+2 ).css("left",this.getX(val+1));
       
    }else{
      showRangeInterval(this.startValue,this.endValue);
    }
}
function showRangeInterval(start,end){
       leftMarkerBigRange.css("display","block");
        leftMarkerBigRangeSpan.text(start);
        rightMarkerBigRange.css("display","block");
        rightMarkerBigRangeSpan.text(end);
        leftMarkerBigRange.width(40 +leftMarkerBigRangeSpan.outerWidth()+2 );
        rightMarkerBigRange.width(40 +rightMarkerBigRangeSpan.outerWidth()+2 );
        
}


function CalculateMultipler(event,initialPoints,zoom){
    
    var firstpoint = Math.floor(initialPoints.x/this.majorTickDist),
    secondpoint = Math.floor(initialPoints.y/this.majorTickDist),
    previousPrecision = this.precision;
   
    if(Math.abs(secondpoint - firstpoint) <= 1){
        if(zoom){
         var val =  min(firstpoint,secondpoint)
          this.startValue = (this.startValue+(val*previousPrecision));
          this.endValue = (this.startValue+((val+1)*previousPrecision));
          
               this.multipler -= 1;
                 this.setPrecision();
                 
          }else{
               var val =  min(firstpoint,secondpoint)
          this.startValue = this.startValue*10;
          this.endValue = this.endValue*10;
          
               this.multipler += 1;
                 this.setPrecision();
              
          }
         $(".markers").css("display","none");
         showRangeInterval(this.startValue,this.endValue);
      // console.log("start value interval :" + this.startValue);
       // console.log("end value interval:" +  this.endValue);
    }else{
      // this.startValue = (this.startValue/previousPrecision)*this.precision;
       //this.endValue = (this.endValue/previousPrecision)*this.precision; 
        if(zoom){
               this.multipler -= 1;
          }else{
               this.multipler += 1;
          }
          this.setPrecision();
       this.startValue = 0;
       this.endValue = this.startValue + (this.precision*10); 
       showRangeInterval(this.startValue,this.endValue);
    }
    
 
  
    this.numMajorTicks = 10;
    this.draw();
};

function moveAxis(decrement){
    // if(this.startValue > this.rangeStart && this.endValue < this.rangeEnd){
      
      if(decrement){
           if(this.endValue < this.rangeEnd){
            
                 this.startValue =  this.startValue + (this.precision);
                 this.endValue =  this.endValue + (this.precision);
            }
      
      }else{
         if(this.startValue > this.rangeStart){
               this.startValue =  this.startValue - (this.precision);
             this.endValue =  this.endValue - (this.precision); 
      
          }
      
     
      }
      showRangeInterval(this.startValue,this.endValue);
           
       // }
        
       this.numMajorTicks =10;
       this.draw();
      
    

};



function leftIntervalShift(event){
    if(this.startValue > this.rangeStart){
         var currentDistance = event.targetTouches[0].pageX - $('#canvas1').offset().left;
        if(currentDistance > 0){
            this.startValue =  this.startValue - Math.round(((currentDistance - initialDistance)/this.minorTickDist) *this.precision);
             //console.log(this.startValue);
             this.numMajorTicks = Math.floor((this.endValue-this.startValue)/this.precision);
             this.draw();
        }
      
    
    }
    
    
};


function drawAxis(){
var clrS = this.intersect-10;
var clrE = 40;
var minorTickDist = 0;
var numMinorTicks = 10;
var tickLabel = 0;
var tickIncr = 1;
// console.log("axis.draw: " + this.start + ":" + this.intersect)
// Clear Previous Axis Drawing Area
context.globalAlpha=1;
context.fillStyle = "#99cc66";
context.fillRect(0,clrS, context.canvas.width, clrE);
// Draw Axis Line
context.lineWidth = 1.0;
context.strokeStyle = this.color;
context.beginPath();
context.moveTo(this.start, this.intersect);
// console.log("axis.draw: " + this.end + ":" + this.intersect)
context.lineTo(this.end, this.intersect);
context.closePath();
context.stroke();
// Determine the number of minor tick marks to use, based on the distance between major tick marks
this.majorTickDist = (this.end - this.start)/this.numMajorTicks;
this.minorTickDist = this.majorTickDist / this.numMinorTicks;


for (var i=0; i<=this.numMajorTicks; i++){
majorTick = this.start + Math.round(i*this.majorTickDist);
if (i < this.numMajorTicks){
//Loop through minor tick marks
for (var n = 0; n < numMinorTicks; n++){
minorTick = majorTick + Math.round(n*this.minorTickDist);
if(minorTick <= this.end){
this.drawMinorTick(minorTick, this.intersect);
}
}
}

this.drawMajorTick(majorTick, this.intersect);
//Label major tick marks
/*if(!this.allowNeg){
tickLabel = i;
} else {
tickLabel = i - this.numMajorTicks/2;
tickLabel=Math.round(tickLabel * 100) / 100;
}*/
context.font = "bold 10pt Arial";
context.textAlign = "center";
context.fillStyle = this.color;

var textvalue =(this.startValue+(i*this.precision));
textvalue = roundOf(textvalue,this.precision)
context.fillText( textvalue, majorTick , this.intersect+30);
/*}else{
context.fillText(textvalue.toFixed(Math.abs(this.multipler)-1), majorTick , this.intersect+30);
}*/
if(this.displayUnit){
context.textAlign = "left";
context.fillText(this.unit,this.start,this.intersect-15);
}
}

} //end axis.draw
 
function roundOf(textvalue,precision){
  var  intLength= 0,
value = Math.abs(precision)+'';
if(value.indexOf(".") === -1){
    if(value.indexOf("e") !== -1){
         return textvalue;
    }
    intLength= 0
}else{
         intLength = value.split(".")[1].length;  
}
  
  return textvalue.toFixed(intLength);
}

function axisGetUnit(x){
var snapLoc = 0;
// console.log("SUP?????? "+this.precision);
/*if(!this.allowNeg){
//snapLoc = Math.round((((x-this.start)/this.majorTickDist) - (this.numMajorTicks/2))*this.precision)/this.precision;
snapLoc = Math.round(((x-this.start)/this.majorTickDist)*this.precision)/this.precision;
} else {
snapLoc = Math.round((((x-this.start)/this.majorTickDist) - (this.numMajorTicks/2))*this.precision)/this.precision;
}
*/
snapLoc = (this.startValue+(Math.floor((x-this.start)/this.majorTickDist)*this.precision))+Math.floor(((x-this.start)%this.majorTickDist)/this.minorTickDist)*(this.precision/10);
// console.log("axis.getUnit: snapLoc = " + snapLoc);
return snapLoc;
} //end axis.getUnit


function axisGetX(loc){
var newX = null;

if(this.startValue <= loc &&  this.endValue >= loc){

  // newX = Number(this.startValue.minus(loc).absoluteValue().div(this.precision).times(this.minorTickDist).plus(this.start).valueOf());

newX = (Math.abs(loc-this.startValue)/(this.precision/10))*this.minorTickDist +this.start;
}


return newX; 
} //end axis.getX


function axisSetPrecision(){
this.precision = 10;
var value = Math.abs(this.multipler);
this.rangeStart = -this.precision*10;
this.rangeEnd = this.precision*10;
if(this.multipler > 0){
    for(var i=0;i<value;i++){
        this.precision = this.precision*10;
        this.rangeStart = -this.precision*10;
        this.rangeEnd = this.precision*10;
    }
    
}else{
     for(var i=0;i<value;i++){
         if(value-1 <= 20){
              this.precision = (this.precision/10).toFixed(value-1);
         }else{
             this.precision = (this.precision/10);
         }
       
        this.rangeStart = -this.precision*10;
        this.rangeEnd = this.precision*10;
    }
    
}
//console.log(this.precision);
//postMsg("Precsion! "+this.precision+" numTicks: "+this.numMajorTicks);
}

//Define Object Axis

//Regular old Functions
function drawMajorTick(locX, locY){
var tickSize = 15;
context.lineWidth = 1.0;
context.strokeStyle = this.color;
context.beginPath();
context.moveTo(locX, locY-tickSize);
context.lineTo(locX, locY+tickSize);
context.closePath();
context.stroke();
}

function drawMinorTick(locX, locY){
var tickSize = 7;
context.lineWidth = 1.0;
context.strokeStyle = this.color;
context.beginPath();
context.moveTo(locX, locY-tickSize);
context.lineTo(locX, locY+tickSize);
context.closePath();
context.stroke();

}