function drawMarker() 
{
    //console.log("marker.draw coords: " + this.color1 + ":" + this.y);
    context.globalAlpha = 1;
    context.lineWidth = 1.0;
    context.beginPath();
    context.fillStyle = this.color1;
    context.strokeStyle = "none";
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
    //convertToFraction(this.unitVal, this.x, this.y - 20, 10, "#000000");
    convertToFraction(this.unitVal, this.x, this.y - 20, 10, "#000000");
	
	
} //end marker.draw

var markers = [];
var color1;
var colors = [];
var setting = 'add';
var types = 'two';
var grabbed = null;
var yCurve = [];
var prevClick = 'one';
var inputCounter=0;
var clicked = false;
var clickedSubtract=false;
var isEraseClicked = false;
var deleteType = "two";
var selectedFraction = "10";
var typesArray=[];


function marker(x, y, size, set, color, number) 
{
    this.x = x;
    this.y = y;
    this.size = size;
    this.set = set;
    this.label = false;
    this.draw = drawMarker;
    this.color1 = color;
    this.unitVal = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.prevVal = 0;
    this.arrowDirection = '';
    this.number = number;
    this.hasInputBox=0;
}

function refreshWindow() {
    var wHeight = context.canvas.height;
    // console.log("Refreshing Window");

    context.globalAlpha = 1;
    context.fillStyle = "#99cc66";
    context.fillRect(0, 0, context.canvas.width, wHeight);
    // buttonBegin.draw();
    axis1.draw();
    //axis2.draw();
    //for(var i=0;i<markers.length;i++)
    //markers[i].draw();
	console.log("refresh window callled.............")
}

function connectMarkers(markerA, markerB, lineColor) {

    if (setting != 'subtract') {
		
		
        if (types == 'one') {

            //refreshWindow();
            context.lineWidth = 2;
            context.strokeStyle = markerA.color1;
            // console.log(markerA.x+":"+markerB.x);
            if (markerA.x == markerB.x) {
                context.strokeStyle = "green";
                context.lineWidth = 4;
            }
            context.beginPath();
            markerB.y = markerA.y;
            var minnum = min(markerA.x, markerB.x);
            var maxnum = max(markerA.x, markerB.x);
            context.moveTo(minnum, markerA.y);
            var ythis = yCurve[markerA.number - 1];
            
            if(markerA.arrowDirection==="right" || markerA.arrowDirection==="left")
              context.bezierCurveTo(minnum + (Math.abs(markerA.x - markerB.x) / 3), markerA.y - ythis, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - ythis, maxnum, markerB.y);
            //context.closePath();
            context.stroke();

            markerA.draw();
            markerB.draw();

            //context.fillStyle = "white";
            // context.font = "bold 11pt Arial";
            num = markerB.unitVal + markerA.unitVal
            num = Math.round(num * 100) / 100;
            var text1 = '' + (num) + '';
            //var text=''+markerA.unitValue+'+'+markerB.unitValue+' = '+(markerB.unitValue+markerA.unitValue)+'';
			
			// satyajit
            //convertToFraction(num, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - 3 * markerA.number - (ythis - 10), 11, "#ffffff");
			
            // context.fillText(text1, minnum +(2*(Math.abs(markerA.x - markerB.x)/3)),markerA.y-50);
            //markerA.x = axis1.getX(markerA.unitVal);
            //markerB.x = axis1.getX(markerB.unitVal);
        } else if (types == 'two') {
            context.lineWidth = 2;
            context.strokeStyle = markerA.color1;

            // console.log(markerA.x+":"+markerB.x);
            if (markerA.x == markerB.x) {
                context.strokeStyle = "green";
                context.lineWidth = 4;
            }
            context.beginPath();
            markerB.y = markerA.y;
            var minnum = min(markerA.x, markerB.x);
            var maxnum = max(markerA.x, markerB.x);
            context.moveTo(minnum, markerA.y);
            var ythis = yCurve[markerB.number - 1];

            //console.log(markerB.number-1);
            context.bezierCurveTo(minnum + (Math.abs(markerA.x - markerB.x) / 3), markerA.y - ythis, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - ythis, maxnum, markerB.y);
            //context.closePath();
            //console.log(markerB.arrowDirection);
            if (markerB.arrowDirection == 'right') {
                context.moveTo(markerB.x - 15, markerA.y - 10);
                context.lineTo(markerB.x, markerA.y);
                context.lineTo(markerB.x + 5, markerA.y - 15);
            } else {
                context.moveTo(markerB.x + 15, markerA.y - 10);
                context.lineTo(markerB.x, markerA.y);
                context.lineTo(markerB.x - 5, markerA.y - 15);
            }
            context.stroke();
            markerA.draw();
            markerB.draw();
            markerB.globalAlpha = 0;

            //context.fillStyle = "white";
            // context.font = "bold 11pt Arial";
            num = markerB.unitVal + markerA.unitVal
            num = Math.round(num * 100) / 100;
            var text1 = '' + (num) + '';
            //var text=''+markerA.unitValue+'+'+markerB.unitValue+' = '+(markerB.unitValue+markerA.unitValue)+'';
			
			// satyajit
            //convertToFraction(num, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - (ythis - 20), 11, "#ffffff");
			
			
            // context.fillText(text1, minnum +(2*(Math.abs(markerA.x - markerB.x)/3)),markerA.y-50);
            //markerA.x = axis1.getX(markerA.unitVal);
            //markerB.x = axis1.getX(markerB.unitVal);
        } else if (types == 'three') {
            context.lineWidth = 2;
            context.strokeStyle = markerA.color1;

            // console.log(markerA.x+":"+markerB.x);
            if (markerA.x == markerB.x) {
                context.strokeStyle = "green";
                context.lineWidth = 4;
            }
            context.beginPath();
            markerB.y = markerA.y;
            var minnum = min(markerA.x, markerB.x);
            var maxnum = max(markerA.x, markerB.x);
            context.moveTo(minnum, markerA.y);
            var ythis = yCurve[markerB.number - 1];
            context.bezierCurveTo(minnum + (Math.abs(markerA.x - markerB.x) / 3), markerA.y - ythis, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - ythis, maxnum, markerB.y);
            //context.closePath();

            //console.log(markerB.arrowDirection);
            if (markerB.arrowDirection == 'left') {
                context.moveTo(markerB.x - 15, markerA.y - 10);
                context.lineTo(markerB.x, markerA.y);
                context.lineTo(markerB.x + 5, markerA.y - 15);
            } else {
                context.moveTo(markerB.x + 15, markerA.y - 10);
                context.lineTo(markerB.x, markerA.y);
                context.lineTo(markerB.x - 5, markerA.y - 15);
            }
            context.stroke();
            markerA.draw();
            markerB.draw();
            markerB.globalAlpha = 0;

            //context.fillStyle = "white";
            // context.font = "bold 11pt Arial";
            num = markerB.unitVal + markerA.unitVal
            num = Math.round(num * 100) / 100;
            var text1 = '' + (num) + '';
            //var text=''+markerA.unitValue+'+'+markerB.unitValue+' = '+(markerB.unitValue+markerA.unitValue)+'';
            
			// satyajit
			//convertToFraction(num, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - (ythis - 20), 11, "#ffffff");
            
			
			// context.fillText(text1, minnum +(2*(Math.abs(markerA.x - markerB.x)/3)),markerA.y-50);
            //markerA.x = axis1.getX(markerA.unitVal);
            //markerB.x = axis1.getX(markerB.unitVal);
        }
    } else {
        //refreshWindow();
        context.lineWidth = 2;
        context.strokeStyle = markerA.color1;        
        if (markerA.x == markerB.x) {
            context.strokeStyle = "green";
            context.lineWidth = 4;
        }
        context.beginPath();
        markerB.y = markerA.y;
        var arrowDistance;
        var minnum = min(markerA.x, markerB.x);
        var maxnum = max(markerA.x, markerB.x);
        var ythis = yCurve[markerA.number - 1] + 10 * markerA.number - 20;
        context.moveTo(markerA.x, markerA.y - ythis - 20);
        context.lineTo(markerB.x, markerB.y - ythis - 20);
        arrowDistance = minnum + ((maxnum - minnum) / 2);
        if (markerB.x > markerA.x) {
            //context.moveTo(arrowDistance,markerA.y-40);
            //context.lineTo((arrowDistance+6),markerB.y-50);
            //context.moveTo(arrowDistance,markerA.y-40);
            //context.lineTo((arrowDistance+6),markerB.y-30);
        } else if (markerB.x < markerA.x) {
            //context.moveTo(arrowDistance,markerA.y-40);
            //context.lineTo((arrowDistance-6),markerB.y-50);
            //context.moveTo(arrowDistance,markerA.y-40);
            //context.lineTo((arrowDistance-6),markerB.y-30);
        }
        context.stroke();
        markerA.draw();
        markerB.draw();

        //context.fillStyle = "white";
        // context.font = "bold 11pt Arial";
        num = markerA.unitVal - markerB.unitVal;
        num = Math.round(num * 100) / 100;
        var text1 = '' + (num) + '';
        //var text=''+markerA.unitValue+'+'+markerB.unitValue+' = '+(markerB.unitValue+markerA.unitValue)+'';
        // context.fillText(text1, minnum +(2*(Math.abs(markerA.x - markerB.x)/3)),markerA.y-50);
        
		// satyajit
		//convertToFraction(num, minnum + (2 * (Math.abs(markerA.x - markerB.x) / 3)), markerA.y - ythis - 22, 11, "#ffffff");
    }
}
$(document).ready(function () {
    $('#subtract').click(function (e) {
    	if((e.pageX===undefined)||(e.pageY===undefined)){
    	   e.pageX=500;
    	   e.pageY=564;
    	}
     if(jQuery.inArray( "two", typesArray )===-1){
        clicked = true;
        $('#scaleHidden').css('display', 'block');
        setting = 'subtract';
       // $('#addbackHidden').css('display', 'block');
       // $('#addHidden').css('display', 'block');
        types = 'one';
        typesArray.push("subtract");
        deleteType = "four";
        //add Marker Code
        if(clickedSubtract===false){
	        var currentColor = '#' + (function co(lor) {
	                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
	                })('');
	        var currentColor1 = '#' + (function co(lor) {
	                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
	                })('');
	        currentColor=splitNChars(currentColor,1);
	        currentColor1=splitNChars(currentColor1,1);
	        var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
	        var marker2 = new marker(0, 0, 5, false, currentColor1, (markers.length + 1));
	        colors.push(currentColor);
	        marker1.x = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);
	    //    marker1.prevX = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
	        marker1.y = 200;
	        //marker1.unitVal = axis1.getUnit(markerA.x);
			marker1.unitVal = axis1.getUnit(marker1.x);
	        marker1.draw();
	        marker2.x = marker1.x + 70;
	      //  marker2.prevX = marker1.x + 70;
	        marker2.y = 200;
	        //marker2.unitVal = axis1.getUnit(markerA.x + 70);
			marker2.unitVal = axis1.getUnit(marker1.x + 70);
	        marker2.draw();
	        markers.push(marker1);
	        markers.push(marker2);
	        yCurve.push(50 + 5 * (markers.length));
	        yCurve.push(50 + 5 * (markers.length));
	        //$("#debug").append("  9    ");
	        var length1 = markers.length - 1;
	        //$("#debug").append("  10    ");
	        if (length1 >= 1)
	            connectMarkers(markers[length1], markers[length1 - 1]);
       }
       else{
       	 var currentColor = '#' + (function co(lor) {
	                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
	                })('');
	        currentColor=splitNChars(currentColor,1);
	        var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
	        colors.push(currentColor);
	        marker1.x = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);
	      //  marker1.prevX = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
	        marker1.y = 200;
	        //marker1.unitVal = axis1.getUnit(markerA.x);
			marker1.unitVal = axis1.getUnit(marker1.x);
	        marker1.draw();
	        markers.push(marker1);
	        yCurve.push(50 + 5 * (markers.length));
	       // yCurve.push(50 + 5 * (markers.length));
	        //$("#debug").append("  9    ");
	        var length1 = markers.length - 1;
	        //$("#debug").append("  10    ");
	        if (length1 >= 1)
	            connectMarkers(markers[length1], markers[length1 - 1]);
       }
      clickedSubtract=true;
      
     }
     else{
     //	alert("Not Allowed");
     	$("#errorContainer").css("display","block");
     	$("#errorContainer").data("target",e.target.id );
     }
    });
    $('#reset').click(function (e) {
        /*clicked = false;
        $('#scaleHidden').css('display', 'none');
        setting = 'add';
        $('#addbackHidden').css('display', 'none');
        $('#addHidden').css('display', 'none');
        refreshWindow();
        markers = [];
        colors = [];
        yCurve = [];*/
        isEraseClicked = !isEraseClicked;
        if(isEraseClicked){
            $("#reset").addClass("reset_selected");
        } else {
            $("#reset").removeClass("reset_selected");
        }
      
    });
    $('#adddot').click(function (e) {
  
        $('#scaleHidden').css('display', 'block');
        setting = 'add';
        $(".numTxt").remove();
        $("#vkeyCont").html("");
        clicked = true;
        typesArray.push("one");
        //$("#debug").append("  clicked   " + clicked);
        if (prevClick == 'one') {
            types = 'one';
            deleteType = "one";
            //$("#debug").append("  types    " + types);
            if (buttonDown == false) {
                $("#debug").append("  buttonDown    " + buttonDown);
                var currentColor = '#' + (function co(lor) {
                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
                })('');
                currentColor=splitNChars(currentColor,1);
                //$("#debug").append("  1    ");
                var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
                //$("#debug").append("  2    ");
                colors.push(currentColor);
                //$("#debug").append("  3    ");
                marker1.x = e.pageX - $('#canvas1').offset().left + 40 * (markers.length);
                //$("#debug").append("  4    ");
                marker1.y = 200;
                //$("#debug").append("  5    ");

                //marker1.unitVal = axis1.getUnit(markerA.x);
				marker1.unitVal = axis1.getUnit(marker1.x);
                //$("#debug").append("  6    ");
                marker1.draw();
                //$("#debug").append("  7    ");
                markers.push(marker1);
                //$("#debug").append("  8    ");
                yCurve.push(50 + 5 * (markers.length));
                //$("#debug").append("  9    ");
                var length1 = markers.length - 1;
                //$("#debug").append("  10    ");
               // if (length1 >= 1)
                 //   connectMarkers(markers[length1], markers[length1 - 1])

                //$("#debug").append("  done    ");

            }
        } else {
            prevClick = 'one';
            /* cmt 3rd dec 2.20 
	           refreshWindow();
	            markers = [];
	           colors = [];
	           yCurve = [];
            */
            if (prevClick == 'one') {
                types = 'one';
                deleteType = "one";

                if (buttonDown == false) {
                    //$("#debug").append("  2buttonDown    " + buttonDown);
                    var currentColor = '#' + (function co(lor) {
                        return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
                    })('');
                    currentColor=splitNChars(currentColor,1);
                    var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);

                    colors.push(currentColor);
                    marker1.x = e.pageX - $('#canvas1').offset().left + 40 * (markers.length);
                    marker1.y = 200;
                    //alert(markerA)
                    //marker1.unitVal = axis1.getUnit(markerA.x);
					marker1.unitVal = axis1.getUnit(marker1.x);
                    marker1.draw();
                    markers.push(marker1);
                    yCurve.push(50 + 5 * (markers.length));

                    var length1 = markers.length - 1;
                 //   if (length1 >= 1)
                   ///     connectMarkers(markers[length1], markers[length1 - 1])


                    $("#debug").append("  done2    ");
                }
            }
        }
      
    });
    $('#add').click(function (e) 
	{
    	if((e.pageX===undefined)||(e.pageY===undefined))
		{
    	   e.pageX=348;
    	   e.pageY=585;
    	}
		if(jQuery.inArray( "subtract", typesArray )===-1)
		{
			//console.log("INSIDE------------------1")
			$('#scaleHidden').css('display', 'block');
			clicked = true;
			inputBoxArray=[];
			setting = 'add';  
			typesArray.push("two");       
			if (prevClick == 'two') 
			{
				//console.log("INSIDE------------------2")
				types = 'two';
				deleteType = "two";
				if (buttonDown == false) 
				{
					var currentColor = '#' + (function co(lor) 
					{
						return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
                })('');
                currentColor=splitNChars(currentColor,1);
               // console.log("#"+colorDark);
                var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
                var marker2 = new marker(0, 0, 5, false, 'transparent', (markers.length + 1));
                colors.push(currentColor);
                marker1.x = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.prevX = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.y = 200;
                //marker1.unitVal = axis1.getUnit(markerA.x);
				marker1.unitVal = axis1.getUnit(marker1.x);
				console.log("x value --- "+markerA.x)
				
				
                marker1.arrowDirection="right";
                marker1.draw();
                marker2.x = marker1.x + 70;
                marker2.prevX = marker1.x + 70;
                marker2.y = 200;
                //marker2.unitVal = axis1.getUnit(markerA.x + 70);
                marker2.unitVal = axis1.getUnit(marker1.x + 70);
                marker2.arrowDirection="right";
                marker2.draw();
                markers.push(marker1);
                markers.push(marker2);
                yCurve.push(50 + 5 * (markers.length));
                yCurve.push(50 + 5 * (markers.length));
                
                var length1 = markers.length - 1;
                connectMarkers(marker1, marker2)
            }
        } 
		else 
		{
			//console.log("INSIDE------------------3")
            prevClick = 'two';
            /* 
				cmt 3rd dec 2.20
				refreshWindow();
				markers = [];
				colors = [];
				yCurve = [];
            */
            types = 'two';
            deleteType = "two";
            if (buttonDown == false) 
			{               
				//console.log("INSIDE------------------4")
                var currentColor = '#' + (function co(lor) 
				{
                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
                })('');
                
                currentColor=splitNChars(currentColor,1);
                var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
                var marker2 = new marker(0, 0, 5, false, 'transparent', (markers.length + 1));
                colors.push(currentColor);
                marker1.x = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.prevX = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.y = 200;
                //marker1.unitVal = axis1.getUnit(markerA.x);
                marker1.unitVal = axis1.getUnit(marker1.x);
				// satyajit : this is wrong default value populated
				
				console.log("x value --- "+markerA.x)
				
                marker1.arrowDirection="right";
                marker1.draw();
                marker2.x = marker1.x + 70;
                marker2.prevX = marker1.x + 70;
                marker2.y = 200;
                
				//marker2.unitVal = axis1.getUnit(markerA.x + 70);
				marker2.unitVal = axis1.getUnit(marker1.x + 70);
				
				// satyajit : this is wrong default value populated
				
                marker2.arrowDirection="right";
                marker2.draw();
                markers.push(marker1);
                markers.push(marker2);
                yCurve.push(50 + 5 * (markers.length));
                yCurve.push(50 + 5 * (markers.length));
                var length1 = markers.length - 1;
                connectMarkers(marker1, marker2)
            }
        }
    }
    else
	{
       	$("#errorContainer").css("display","block");
       	$("#errorContainer").data("target",e.target.id );
    }
	   
    });
    $('#addback').click(function (e) {
    	if((e.pageX===undefined)||(e.pageY===undefined)){
    	   e.pageX=348;
    	   e.pageY=585;
    	}
     if(jQuery.inArray( "subtract", typesArray )===-1){
        $('#scaleHidden').css('display', 'block');
        clicked = true;
        inputBoxArray=[];
        setting = 'add';
        typesArray.push("two");    
        if (prevClick == 'three') {
            types = 'three';
            deleteType = "three";
            if (buttonDown == false) {

                var currentColor = '#' + (function co(lor) {
                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
                })('');
                currentColor=splitNChars(currentColor,1);
                var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
                var marker2 = new marker(0, 0, 5, false, 'transparent', (markers.length + 1));
                colors.push(currentColor);
                marker1.x = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.prevX = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.y = 200;
                //marker1.unitVal = axis1.getUnit(markerA.x);
                marker1.unitVal = axis1.getUnit(marker1.x);
                marker1.arrowDirection="left";
                marker1.draw();
                marker2.x = marker1.x - 70;
                marker2.prevX = marker1.x - 70;
                marker2.y = 200;
                //marker2.unitVal = axis1.getUnit(markerA.x - 70);
				marker2.unitVal = axis1.getUnit(marker1.x - 70);
                marker2.arrowDirection="left";
                marker2.draw();
                markers.push(marker1);
                markers.push(marker2);
                yCurve.push(50 + 5 * (markers.length));
                yCurve.push(50 + 5 * (markers.length));
                var length1 = markers.length - 1;
                connectMarkers(marker1, marker2)
            }
        } else {
            prevClick = 'three';
           /* 
             cmt 3rd dec 2.20
            refreshWindow();
            markers = [];
            colors = [];
            yCurve = [];
            */
            types = 'three';
            deleteType = "three";
            if (buttonDown == false) {

                var currentColor = '#' + (function co(lor) {
                    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
                })('');
                currentColor=splitNChars(currentColor,1);
                var marker1 = new marker(0, 0, 5, false, currentColor, markers.length);
                var marker2 = new marker(0, 0, 5, false, 'transparent', (markers.length + 1));
                colors.push(currentColor);
                marker1.x = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);
                marker1.prevX = e.pageX - $('#canvas1').offset().left + 50 * (markers.length);;
                marker1.y = 200;
                //marker1.unitVal = axis1.getUnit(markerA.x);
				marker1.unitVal = axis1.getUnit(marker1.x);
                marker1.arrowDirection="left";
                marker1.draw();
                marker2.x = marker1.x - 70;
                marker2.prevX = marker1.x - 70;
                marker2.y = 200;
                //marker2.unitVal = axis1.getUnit(markerA.x - 70);
				marker2.unitVal = axis1.getUnit(marker1.x - 70);
                marker2.arrowDirection="left";
                marker2.draw();
                markers.push(marker1);
                markers.push(marker2);
                yCurve.push(50 + 5 * (markers.length));
                yCurve.push(50 + 5 * (markers.length));
                var length1 = markers.length - 1;
                connectMarkers(marker1, marker2)
            }
        }
        console.log(markers);
       }
      else{
        	$("#errorContainer").css("display","block");
        	$("#errorContainer").data("target",e.target.id );
       }
    });
});

function convertToFraction(number, x, y, size, color) 
{
    number = Math.round(number * 100) / 100;
    var result = {}, text = 0,inputText
    fraction = 0;
    
    //console.log("Marker length :"+markers.length);
    if (!FractionNum) 
	{        
        
        context.font = "bold " + (size) + "pt Arial";
        context.textAlign = "center";
        context.fillStyle = color;
		
		
        if (color == "#ffffff") 
		{
          //  if (inputText != undefined)
			// context.clearRect(inputText.x(), inputText.y(), inputText.width(), inputText.height());
            //context.fillText(number, x, y);
            if(inputBoxArray.length===0)
			{
	            /*inputText = new CanvasInput({
	                canvas: document.getElementById('canvas1'),
	                fontSize: 18,
	                fontFamily: 'Arial',
	                fontColor: '#212121',
	                fontWeight: 'bold',
	                width: 30,
	                x: x-30,
	                y: y-50,
	              //  padding: 8,
	                borderWidth: 1,
	                borderColor: '#000',
	                borderRadius: 3,
	
	            });
	            //inputBoxArray.push(inputText);
	           */
	            var item={};
	            item["markerId"]=markers.length/2;
	            item["grabbed"]=grabbed;
	            item["inputCanvas"]=inputText;
	            inputBoxArray.push(item);
	           // markersTempArray[markers.length-2]=item;
	          //  markersTempArray[(markers.length-2)+1]=item;
	            markersTempArray[((markers.length/2)-1)-1]=item;
	            markersTempArray.push(item);
	            console.log(inputBoxArray);
	            console.log("input box array length :"+inputBoxArray.length);
             /*   $("#mainContainer").append("<div style='left:"+(x+10)+"px;top:"+(y-10)+"px;position:absolute;width:50px;height:50px;background-color:#FFFFFF;display:block;' id='x"+(markers.length/2)+"' class='numTxt marker"+(markers.length-2)+" marker"+  ((markers.length-2)+1)+"'></div>");
                $("#page-0").append("<div id='editorTxt"+(markers.length/2)+"'></div>");
                
                bindKeyPad();*/
			}
			else
			{
	         	//console.log("grabbed input :"+markersTempArray[grabbed]);
	         	var inputEle=$(".marker"+grabbed);
	         	inputCounter++;
	         	
	         	// if(inputBoxArray[grabbed].markerId===$(inputEle).attr("id").split("x")[1]){
	         	 	  // $(inputEle).css("left",x-30);
	         	// }
	         	  
	         	 
	         ///console.log("input");
	         }
        }
        else 
		{
			
            context.fillText(number, x, y);
        }       
    } 
	else 
	{
        if (number % 1 === 0) 
		{
            text = number;
            //result[intPart]=number;
            //result[fraction]=0;
        }
		else 
		{
            text += (Math.floor(number));
            fraction = Math.round((number % 1) * 10);
            
			/*if(fraction %5 === 0)
			{
              text += (Math.floor(fraction/5) + "/2" );
			}
			else if(fraction % 2 === 0)
			{
               text += (Math.floor(fraction/2) + "/5" );
			}
			else
			{
			}   */
		
			//fraction = (Math.floor(fraction) + "/10");
			 
			fraction = (Math.floor(fraction));
        }
        if (text !== 0) 
		{
            context.font = "bold " + (size + 5) + "pt Arial";
            context.textAlign = "center";
            context.fillStyle = color;			
            context.fillText(text, x, y-5);
        }
        if (fraction !== 0) 
		{
            context.font = "bold " + size + "pt Arial";
            context.textAlign = "center";
            context.fillStyle = color;
            if (((text + "").length) > 1) 
			{
                context.fillText(fraction, x + 20 + ((text + "").length - 1) * 6, y);
				console.log(fraction, x + 20 + ((text + "").length - 1) * 6, y)
            } 
			else 
			{
                if (text === 0)
				{
                    context.fillText(fraction, x, y-20);					
					context.beginPath();
					context.moveTo(x-10,y-15);
					context.lineTo(x+10,y-15);
					context.strokeStyle = color;
					context.lineWidth = 1;
					context.stroke();					
                    context.fillText(selectedFraction, x, y);					
				}
                else
				{
                    context.fillText(fraction, x + 20, y-20);					
					context.beginPath();
					context.moveTo(x+10,y-15);
					context.lineTo(x+30,y-15);
					context.strokeStyle = color;
					context.lineWidth = 1;
					context.stroke();					
                    context.fillText(selectedFraction, x + 20, y);
				}
            }			
			console.log("fraction -- "+fraction+ " text -- "+ text + " selectedFraction -- "+selectedFraction);			
        }
    }

    //return text;
}




function min(value1, value2) {
    if (value1 <= value2) {
        return value1;
    } else {
        return value2;
    }
}

function max(value1, value2) {
    if (value1 >= value2) {
        return value1;
    } else {
        return value2;
    }
}
function bindKeyPad(){
	
	//var tmpArr = ["1","2","3","4","5","6","7","8","9","0"];
	
	var numKeypad = new vKeyPad('.numTxt');
	
	$(".keypadHolder").draggable({containment: "#vkeyCont"});
}
function closeIkeypad()
{
	//$("#x2").removeClass("_keyBoardActive")
	//$("#x2").find(".small").css({'display':'none'})
}

function onTextChanged(e)
{
	//$(".cloneMe .numTxt").html($("#mainContr>.numTxt").html());
}

//generate  dark colors
function splitNChars(txt, num) {
    var result = [],color="";
    for (var i = 0; i < txt.length; i += num) {
    	if(i==3)
    	 result.push("0");
    	else if(i==4)
    	 result.push("0");
        else 
         result.push(txt.substr(i, num));
         
      color+=result[i];
    }
    
    return color;
}
