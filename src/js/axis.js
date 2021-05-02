function axis(start, end, intersect, allowNeg, orientation, numTicks, precision, color, unit, displayUnit) {
    this.start = start;
    this.end = end;
    this.startValue = new BigNumber(0);
    this.endValue = new BigNumber(10);
    this.intersect = intersect;
    this.rangeStart = allowNeg ? new BigNumber(-10) : new BigNumber(0);
    this.rangeEnd = new BigNumber(10);
    this.allowNeg = allowNeg;
    this.orientation = orientation;
    this.numMajorTicks = new BigNumber(10);
    this.precision = new BigNumber(1);
    this.color = color;
    this.initialDistance = new BigNumber(0);
    this.unit = unit;
    this.displayUnit = displayUnit;
    this.numMinorTicks = new BigNumber(10);
    this.majorTickDist = (this.end - this.start) / 10;
    this.handle = 0;
    this.handleTicks = 0;
    this.minorTickDist = 0;
    // console.log("axis: majorTickDist = " + this.majorTickDist)
    this.draw = drawAxis;
    this.getUnit = axisGetUnit;
    this.getX = axisGetX;
    this.setPrecision = axisSetPrecision;
    this.moveAxis = moveAxis;
    this.CalculateMultipler = CalculateMultipler;
    this.multipler = -1;
    this.drawMinorTick = drawMinorTick;
    this.drawMajorTick = drawMajorTick;
    this.rangeMarkers = rangeMarkers;
    this.findRange = findRange;
}; // end Object axis

function rangeMarkers(initialPoints) {
    $(".markers").css("display", "none");
    var firstpoint = Math.floor(initialPoints.x / this.majorTickDist),
        secondpoint = Math.floor(initialPoints.y / this.majorTickDist);
    previousPrecision = this.precision;
    if (Math.abs(secondpoint - firstpoint) <= 1) {
        var val = min(firstpoint, secondpoint)
        leftMarkerSmallRange.css("display", "block");
        leftMarkerSmallRangeSpan.text((previousPrecision.times(val)).plus(this.startValue).valueOf());
        rightMarkerSmallRange.css("display", "block");
        rightMarkerSmallRangeSpan.text((previousPrecision.times(val + 1)).plus(this.startValue).valueOf());
        leftMarkerSmallRange.width(40 + leftMarkerSmallRangeSpan.outerWidth() + 2).css("left", this.getX((previousPrecision.times(val)).plus(this.startValue)) - (40 + leftMarkerSmallRangeSpan.outerWidth()));
        rightMarkerSmallRange.width(40 + rightMarkerSmallRangeSpan.outerWidth() + 2).css("left", this.getX((previousPrecision.times(val + 1)).plus(this.startValue)));

    } else {
        showRangeInterval(this.startValue, this.endValue);
    }
}

function showRangeInterval(start, end) {
    leftMarkerBigRange.css("display", "block");
    leftMarkerBigRangeSpan.text(start.valueOf());
    rightMarkerBigRange.css("display", "block");
    rightMarkerBigRangeSpan.text(end.valueOf());
    leftMarkerBigRange.width(40 + leftMarkerBigRangeSpan.outerWidth() + 2);
    rightMarkerBigRange.width(40 + rightMarkerBigRangeSpan.outerWidth() + 2);

}


function CalculateMultipler(event, initialPoints, zoom) {

    var firstpoint = Math.floor(initialPoints.x / this.majorTickDist),
        secondpoint = Math.floor(initialPoints.y / this.majorTickDist),
        previousPrecision = this.precision;

    if (Math.abs(secondpoint - firstpoint) <= 1) {
        if (zoom) {
            var val = min(firstpoint, secondpoint)
            this.endValue = previousPrecision.times(val + 1).plus(this.startValue)
            //this.startValue = previousPrecision.times(val).plus(this.startValue);


            this.multipler -= 1;
            this.setPrecision();

        } else {
            var val = min(firstpoint, secondpoint)
            //this.startValue = this.startValue.times(10);
            this.endValue = this.endValue.times(10);

            this.multipler += 1;
            this.setPrecision();

        }
        $(".markers").css("display", "none");
        showRangeInterval(this.startValue, this.endValue);
    } else {
        // this.startValue = (this.startValue/previousPrecision)*this.precision;
        //this.endValue = (this.endValue/previousPrecision)*this.precision; 
        if (zoom) {
            this.multipler -= 1;
            //this.startValue = this.startValue.div(10);
            this.endValue = this.endValue.div(10);
        } else {
            this.multipler += 1;
            //this.startValue = this.startValue.times(10);
            this.endValue = this.endValue.times(10);
        }
        this.setPrecision();


        showRangeInterval(this.startValue, this.endValue);

    }

    this.draw();
};

function moveAxis(decrement) {
    if (decrement) {
        if (this.endValue.lessThan(this.rangeEnd)) {
            this.startValue = this.startValue.plus(this.precision);
            this.endValue = this.endValue.plus(this.precision);
        }

    } else {
        if (this.startValue.greaterThan(this.rangeStart)) {            
            this.startValue = this.startValue.minus(this.precision);
            if(!this.allowNegative && this.startValue.valueOf()<0){
                this.startValue = new BigNumber(0);
            }
            this.endValue = this.endValue.minus(this.precision);
        }
    }
    showRangeInterval(this.startValue, this.endValue);
    this.draw();
};

function drawAxis() {
    var clrS = this.intersect - 10;
    var clrE = 40;
    var minorTickDist = 0;
    var numMinorTicks = 10;
    var tickLabel = 0;
    var tickIncr = 1;
    // console.log("axis.draw: " + this.start + ":" + this.intersect)
    // Clear Previous Axis Drawing Area
    context.globalAlpha = 1;
    context.fillStyle = "#99cc66";
    context.fillRect(0, clrS, context.canvas.width, clrE);
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
    this.majorTickDist = BigNumber(this.end - this.start).dividedBy(this.numMajorTicks);
    this.minorTickDist = this.majorTickDist.dividedBy(this.numMinorTicks);
    if (this.majorTickDist.valueOf() < 15){
        this.numMinorTicks = new BigNumber(0);
    } else if (this.majorTickDist.valueOf() < 35){
        this.numMinorTicks = new BigNumber(2);
    } else if (this.majorTickDist.valueOf() < 70){
        this.numMinorTicks = new BigNumber(5);
    }    
    if (this.numMajorTicks.valueOf() >= 1000){
        tickIncr = 100;
        this.numMinorTicks = new BigNumber(0);
    } else if (this.numMajorTicks.valueOf() >= 550){
        tickIncr = 50;
        this.numMinorTicks = new BigNumber(0);
    } else if (this.numMajorTicks.valueOf() >= 160){
        tickIncr = 20;
        this.numMinorTicks = new BigNumber(0);
    } else if (this.numMajorTicks.valueOf() >= 100){
        tickIncr = 10;
        this.numMinorTicks = new BigNumber(0);
    } else if (this.numMajorTicks.valueOf() >= 50){
        tickIncr = 5;
        this.numMinorTicks = new BigNumber(0);
    }
    //this.precision = new BigNumber(tickIncr);
    for (var i = new BigNumber(0); i.lessThanOrEqualTo(this.numMajorTicks); i = i.plus(tickIncr)) {
        //majorTick = this.start + Math.round(i*this.majorTickDist);
        majorTick = this.majorTickDist.times(i).plus(this.start).round();
        if (i.lessThan(this.numMajorTicks)) {
            //Loop through minor tick marks
            for (var n = new BigNumber(0); n.lessThan(this.numMinorTicks); n = n.plus(1)) {
                //minorTick = majorTick + Math.round(n*this.minorTickDist);
                minorTick = Number(this.minorTickDist.times(n).plus(majorTick).round().valueOf());
                if(numMinorTicks>0){
                    if (minorTick <= this.end) {
                        this.drawMinorTick(minorTick, this.intersect);
                    }    
                }
                
            }
        }

        this.drawMajorTick(Number(majorTick.valueOf()), this.intersect);
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

        //var textvalue =(this.startValue+(i*this.precision));
        var textvalue = this.precision.times(i).plus(this.startValue).valueOf();
        //textvalue = roundOf(textvalue,this.precision)
        context.fillText(textvalue, majorTick, this.intersect + 30);
        /*}else{
context.fillText(textvalue.toFixed(Math.abs(this.multipler)-1), majorTick , this.intersect+30);
}*/
        if (this.displayUnit) {
            context.textAlign = "left";
            context.fillText(this.unit, this.start, this.intersect - 15);
        }
    }

} //end axis.draw

function roundOf(textvalue, precision) {
    var intLength = 0,
        value = Math.abs(precision) + '';
    if (value.indexOf(".") === -1) {
        if (value.indexOf("e") !== -1) {
            return textvalue;
        }
        intLength = 0
    } else {
        intLength = value.split(".")[1].length;
    }

    return textvalue.toFixed(intLength);
}

function axisGetUnit(x) {
    var snapLoc = 0;
	
	console.log("got x value ---- "+x)
    // console.log("SUP?????? "+this.precision);
    /*if(!this.allowNeg){
//snapLoc = Math.round((((x-this.start)/this.majorTickDist) - (this.numMajorTicks/2))*this.precision)/this.precision;
snapLoc = Math.round(((x-this.start)/this.majorTickDist)*this.precision)/this.precision;
} else {
snapLoc = Math.round((((x-this.start)/this.majorTickDist) - (this.numMajorTicks/2))*this.precision)/this.precision;
}
*/
    //snapLoc = (this.startValue+(Math.floor((x-this.start)/this.majorTickDist)*this.precision))+Math.floor(((x-this.start)%this.majorTickDist)/this.minorTickDist)*(this.precision/10);
    snapLoc = new BigNumber((x - this.start)).div(this.majorTickDist).floor().times(this.precision).plus(this.startValue).plus(BigNumber((x - this.start)).mod(this.majorTickDist).div(this.minorTickDist).times(this.precision.div(10)));
    // console.log("axis.getUnit: snapLoc = " + snapLoc);
    return Number(snapLoc.valueOf());
} //end axis.getUnit

function axisGetX(loc) {
    var newX = null;
    /*if(this.allowNeg){
loc += this.numMajorTicks/2;
//loc=loc.toFixed(0);
}*/
    if (this.startValue.lessThanOrEqualTo(loc) && this.endValue.greaterThanOrEqualTo(loc)) {
        // loc = loc-this.startValue;
        //newX =  Math.round((loc * this.majorTickDist))+this.start;
        newX = Number(this.startValue.minus(loc).absoluteValue().div(this.precision.div(10)).times(this.minorTickDist).plus(this.start).valueOf());
    }

    //newX = Math.round((loc * this.majorTickDist))+this.start;
    return newX;
} //end axis.getX


function axisSetPrecision() {
    this.precision = new BigNumber(10);
    var value = Math.abs(this.multipler);

    if (this.multipler > 0) {
        for (var i = 0; i < value; i++) {
            this.precision = this.precision.times(10);
        }

    } else {
        for (var i = 0; i < value; i++) {

            this.precision = this.precision.dividedBy(10);

        }

    }

    this.findRange();

    //postMsg("Precsion! "+this.precision+" numTicks: "+this.numMajorTicks);
}

function findRange() {
    var val = new BigNumber(10);
    var endvalue = null;
    if (this.endValue.abs().lt(this.startValue.abs())) {
        endvalue = this.startValue.abs();
    } else {
        endvalue = this.endValue.abs();
    }
    if (endvalue.gte(1)) {
        for (var u = new BigNumber(1); u.lessThanOrEqualTo(endvalue); u = u.times(10)) {
            val = val.times(10)
        }
        val = val.div(10)
    } else {
        for (var u = new BigNumber(1); u.gte(Math.abs(endvalue)); u = u.div(10)) {
            val = val.div(10)
        }
        val = val.times(10)
    }
    if(this.allowNeg){
        this.rangeStart = val.times(-1);
    }    
    this.rangeEnd = val;

}

//Define Object Axis

//Regular old Functions
function drawMajorTick(locX, locY) {
    var tickSize = 15;
    context.lineWidth = 1.0;
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo(locX, locY - tickSize);
    context.lineTo(locX, locY + tickSize);
    context.closePath();
    context.stroke();
}

function drawMinorTick(locX, locY) {
    var tickSize = 7;
    context.lineWidth = 1.0;
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo(locX, locY - tickSize);
    context.lineTo(locX, locY + tickSize);
    context.closePath();
    context.stroke();

}