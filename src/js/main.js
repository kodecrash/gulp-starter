var data;
var paper;
var currentX = 0;
var currentY = 200;
var counter = 0;
var color;
var currentValue = 100;
var type = 'add';
var markerA;
var markerB;
var counter = 0;
var FractionNum = false;
var touchstart = false;
var initialDistance = 0;
var leftshiftOrigin = false;
var rightShiftOrigin = false;
var context = null;
var axis1;
var buttonDown = false;
var leftMarkerSmallRange = null;
var leftMarkerSmallRangeSpan = null;
var rightMarkerSmallRange = null;
var rightMarkerSmallRangeSpan = null;
var leftMarkerBigRange = null;
var leftMarkerBigRangeSpan = null;
var rightMarkerBigRange = null;
var rightMarkerBigRangeSpan = null;
var doubletouch = false;
var singletouch = false;
var activityStarted = false;
var inputBoxArray=[];
var markersTempArray=[];
var connectorColor = connectorColor = '#' + (function co(lor) {
    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor);
})('');
var allowPinchZoom = false;

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

$(document).ready(function () {
    $("#settingContainer").draggable({
        containment: "parent"
    });

    $('#scale').click(function () {
        $('#scaleHidden').css('display', 'block');
        clicked = true;
    });
   $('.markers').css("opacity",0);
    $('#scaleHidden').click(function () {
        $('#scaleHidden').css('display', 'none');
        clicked = false;
    });
    $('.radio2').click(function () {
		
        $('.radio2').css('background-image', 'url(images/radioB.png)');
        $('#' + this.id).css('background-image', 'url(images/radioB1.png)');
        if (this.id == 'radio3' || this.id == 'radio5') {
            FractionNum = false;
            $('.radioFrac').unbind('click');
            $('.radioFrac').css('background-image', 'url(images/radioB.png)');
			
			axis1.draw();
        } else {
            $('#radioFrac6').css('background-image', 'url(images/radioB1.png)');
            FractionNum = true;
            $('.radioFrac').bind('click', function () {
                $('.radioFrac').css('background-image', 'url(images/radioB.png)');
                $('#' + this.id).css('background-image', 'url(images/radioB1.png)');
                console.log($(this).attr('division'));
				selectedFraction = $(this).attr('division');
				
                axis1.numMinorTicks = parseInt($(this).attr('division'));
				
				axis1.draw();
            });
        }
		//resetSettingPanel()
		console.log("FractionNum --- "+FractionNum);

    });

    $('#close_Button').live('click', function () {
        //document.getElementById('instructionAudio').pause();
        //document.getElementById('instructionAudio').src="images/audio2.mp3";
        $('#infoContainer').css('display', 'none');
        $('#mainContainerHidden').css('display', 'none');
        activityStarted = true;
    });
    //close error message
	$('.close_Button').live('click', function () {
       $("#errorContainer").css("display","none");
    });
    $('#errorContainer #yes').live('click', function () {
       if(jQuery.inArray( "two", typesArray )!=-1){
       	  removeA(typesArray, 'two');
          markers = [];
          colors = [];
          yCurve = [];
          refreshWindow();
          $('.numTxt').remove();
          clickedSubtract=false;
       	  $("#subtract").trigger("click");
       	  $("#vkeyCont").html("");
       	}
       else if(jQuery.inArray( "subtract", typesArray )!=-1){
          removeA(typesArray, 'subtract');
          markers = [];
          colors = [];
          yCurve = [];
          refreshWindow();
          $('.numTxt').remove();
          $("#vkeyCont").html("");
          if($('#errorContainer').data("target")==="add")
             $("#add").trigger("click");
          else if($('#errorContainer').data("target")==="addback"){
          	 removeA(typesArray, 'three');
             $("#addback").trigger("click");
           }
       }
       else{
       	  markers = [];
          colors = [];
          yCurve = [];
          refreshWindow();
       }
     
       $("#errorContainer").css("display","none");
    });
    $('#errorContainer #no').live('click', function () {
        $("#errorContainer").css("display","none");
    });
	$('#setting').live('click touchstart', function () {        
        $('#settingContainer').css('display', 'block'); 
		$('#setting').removeClass('settingButton_normal');
		$('#setting').addClass('settingButton_selected');
    });
	
	$('#close').live('click touchstart', function () {        
        resetSettingPanel()
    });
	
	function resetSettingPanel() {
		$('#settingContainer').css('display', 'none'); 
		$('#setting').removeClass('settingButton_selected');
		$('#setting').addClass('settingButton_normal');
	 }
	

    $(".icoInfo").live('click', function () {
        //document.getElementById('instructionAudio').src="images/audio1.mp3";
        //document.getElementById('instructionAudio').play();
        $('#infoContainer').css('display', 'block');
        $('#mainContainerHidden').css('display', 'block');
    })
	
	

    $(".icoReset").click(function () {
        var current = $(this);
		resetSettingPanel();
        current.removeClass('icoResetMove');
        var to = setTimeout(function () {
            clearInterval(to);
            current.addClass('icoResetMove');
        }, 200)
        lineLength=10;
        context.clearRect(0, 0, canvas.width, canvas.height);
        axis1 = new axis(winPadding, context.canvas.width - winPadding, axisA, allowNegative, 10, lineLength, 0.1, axisColor, "", false);
        OnResizeCalled();
        clickedSubtract=false;
        clicked = false;
        isEraseClicked = false;
        deleteType = "one";
        $("#reset").removeClass("reset_selected");
        $('#scaleHidden').css('display', 'none');
        setting = 'add';
        $('#addbackHidden').css('display', 'none');
        $('#addHidden').css('display', 'none');
        refreshWindow();
        markers = [];
        colors = [];
        yCurve = [];
        $(".numTxt").remove();
        $("#vkeyCont").html("");
        typesArray=[];
    });
	

    var jqxhr = $.getJSON("manifest.json", function (mainData) {
        data = mainData;
    });



    var rangeScale = 2000;

    function range(x) {
        rangeScale = parseInt(x);
    }
    var setting = 'add';

    function roundToHalf(value) {
        var converted = parseFloat(value); // Make sure we have a number
        var decimal = (converted - parseInt(converted, 10));
        decimal = Math.round(decimal * 10);
        if (decimal == 5) {
            return (parseInt(converted, 10) + 0.5);
        }
        if ((decimal < 3) || (decimal > 7)) {
            return Math.round(converted);
        } else {
            return (parseInt(converted, 10) + 0.5);
        }
    }

    var intervalID = null;
    var debugWeb = false;
    var debugTouch = false;
    var debugFinger = false;
    var lineLength = 5;
    var allowNegative = true;
    var precision = 10; //100 = 2 decimal places
    var winPadding = 25;
    var touchSize = 20;
    var pointerSize = 15;
    var contactSize = 20;
    var canvas = document.getElementById('canvas1');
    context = canvas.getContext('2d');
    var buttonAlign = document.getElementById("buttonAlign");
    var axisA = 200;
    var axisB = 190;
    var axisColor = "black";
    var majorTickDist = (context.canvas.width - (winPadding * 2)) / lineLength;
    var minorTickDist = majorTickDist / 10;
    var ratio = 1;
    var snapAxisA = false;
    var grabOffset = 0;
    var markersSnapped = false;
    var curLoc = winPadding;
    var leftX = 0;
    var rightX = 0;
    var pressAlign = 0;
    var inputA = document.getElementById("topValue");
    var inputB = document.getElementById("bottomValue");
    var initialPoints = {};
    //Define Objects
    markerA = new marker(0, 0, 5, false, 'green');
    markerB = new marker(0, 0, 5, false, 'blue');
    axis1 = new axis(winPadding, context.canvas.width - winPadding, axisA, allowNegative, 10, lineLength, 0.1, axisColor, "", false);
    //Define States
    var hasStarted = false;
    var markerError = false;
    var isDrawing = false;
    var isDragging = false;
    var isSettingA = false;
    var isSettingB = false;
    var scalingAxis1 = false;
    var scalingAxis2 = false;

    function showTouch(x, y) {
        var tickSize = 6;
        if (debugWeb || debugTouch || debugFinger) {
            context.beginPath();
            context.fillStyle = "red";
            context.strokeStyle = "Black";
            context.globalAlpha = 0.6;
            context.arc(x, y, touchSize, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            context.lineWidth = 1.0;
            context.strokeStyle = "black";
            context.beginPath();
            context.moveTo(x, y - tickSize);
            context.lineTo(x, y + tickSize);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(x - tickSize, y);
            context.lineTo(x + tickSize, y);
            context.closePath();
            context.stroke();
        }
    }

    function postMsg(text) 
	{
        if (debugTouch) 
		{
            context.globalAlpha = 1;
            context.fillStyle = "gray";
            context.fillRect(0, 265, context.canvas.width, context.canvas.height);
            context.font = "bold 14pt Arial";
            context.textAlign = "left";
            context.fillStyle = "black";
            context.fillText(text, 10, 290);
        }
        if (debugWeb) 
		{
            //console.log(text);
        }
    }

    function findPos(obj)
	{
        var curleft = 0,
            curtop = 0;
        if (obj.offsetParent) 
		{
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return {
                x: curleft,
                y: curtop
            };
        }
        return undefined;
    }

    function updateStatus()
	{
        context.save();
        context.globalAlpha = 1;
        context.fillStyle = "#99cc66";
        context.fillRect(0, 225, context.canvas.width, 265);
        context.font = "10pt Arial";
        context.textAlign = "left";
        context.fillStyle = "black";
        context.fillText("Top Number Line Value: " + (Math.round(markerA.unitVal * 100) / 100), winPadding, 245);
        context.fillText("Bottom Number Line Value: " + (Math.round(markerB.unitVal * 100) / 100), winPadding, 260);
        context.restore();
    }


    function alignAxis() 
	{
        if (hasStarted)
		{
            axis1.numMajorTicks = markerA.unitVal * 2;
            axis1.setPrecision();
            axis1.draw();
            markerA.x = axis1.getX(markerA.unitVal);
            markerB.x = markerA.x;
            markerB.draw();
        }
    }

    function displayRatio() 
	{		
        var topRatio = Math.round((markerA.unitVal / markerB.unitVal) * 1000) / 1000;
        var bottomRatio = Math.round((markerB.unitVal / markerA.unitVal) * 1000) / 1000;
        if (hasStarted) 
		{
            context.save();
            context.globalAlpha = 1;
            context.fillStyle = "#99cc66";
            context.font = "10pt Arial";
            context.textAlign = "left";
            context.fillStyle = "black";
            context.restore();
        }
    }

    function initWindow() 
	{
        // Someone tapped or clicked to make things happen. So now we animate the zooming in of the ruler and draw the handles.		
        postMsg("Start Tapped");
        axis1.draw();
        markerA.prevVal = markerA.unitVal;
        markerA.unitVal = 1;
        markerA.y = axis1.intersect;
        markerA.set = true;
        markerB.prevVal = markerB.unitVal;
        markerB.unitVal = 1;
        markerB.y = axis1.intersect;
        markerB.set = true;
        ratio = 1;
        updateInput(markerA, inputA);
        updateInput(markerB, inputB);
        markersSnapped = true;
        isDrawing = true;
    }

    function resetApp() 
	{
        axis1.numMajorTicks = lineLength;
        axis1.setPrecision();
        initWindow();
    }
    function OnResizeCalled() 
	{
            postMsg("Going from : " + context.canvas.width + ":" + context.canvas.height + " to " + window.innerWidth + 'px:' + window.innerHeight + 'px');
            context.canvas.width = 1000;
            context.canvas.height = 450;
            axis1.end = context.canvas.width - 20;
            if (!hasStarted) 
			{
                axis1.draw();
                context.beginPath();
                context.fillStyle = "#99cc66";
                context.strokeStyle = "Black";
                context.globalAlpha = 0.8;
                context.arc((context.canvas.width / 2), 450, 50, 0, 2 * Math.PI, false);
                context.fill();
             //   context.stroke();
                //Fill it witht he text
                context.font = "bold 18pt Arial";
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText("Start", (context.canvas.width / 2), 155);
            } 
			else 
			{
                axis1.draw();
                //axis2.draw();
                markerA.x = axis1.getX(markerA.unitVal);
                if (markersSnapped)
				{
                    if (snapAxisA) 
					{
                        markerA.x = axis1.getX(markerA.unitVal);
                        markerB.x = markerA.x;
                    } 
					else 
					{
                        markerB.x = axis1.getX(markerB.unitVal);
                        markerA.x = markerB.x;
                    }
                } 
				else 
				{
                    markerA.x = axis1.getX(markerA.unitVal);
                    markerB.x = axis1.getX(markerB.unitVal);
                }
            }
        }
    window.addEventListener('load', function () 
	{
        function coordinates(x, y) 
		{
            this.x = x;
            this.y = y;
        }
        function actionStart(coords, event) 
		{
			
            if (event.pageY >= 200 && event.pageY <= 340) 
			{
				
                axis1.handleTicks = axis1.numMajorTicks;
                axis1.handle = coords.x;
                if (!clicked) 
				{
					
                    var offsetCanvas = $('#canvas1').offset().left;
                    allowPinchZoom = true;
                    if(event.targetTouches != undefined)
					{
                        if (event.targetTouches.length == 2) 
						{
                            initialDistance = Math.abs(event.targetTouches[0].pageX - event.targetTouches[1].pageX);
                            initialPoints = {
                                "x": event.targetTouches[0].pageX - offsetCanvas,
                                "y": event.targetTouches[1].pageX - offsetCanvas
                            };
                            axis1.rangeMarkers(initialPoints);
                            doubletouch = true;
                            singletouch = false;
                        } 
						else if (event.targetTouches.length == 1) 
						{
                            doubletouch = false;
                            singletouch = true;
                            initialPoints = event.targetTouches[0].pageX - offsetCanvas;
                            swipeIndicator.css({
                                "left": event.targetTouches[0].pageX - (swipeIndicator.width() / 2),
                                "display": "block"
                            });
                            showRangeInterval(axis1.startValue, axis1.endValue);
                        }
                    }
                    
                   // alert("touchCalled");
                }
				else 
				{
					
                    for (var i = 0; i < markers.length; i++) 
					{
                        if (((coords.x > (markers[i].x - touchSize)) && (coords.x < (markers[i].x + touchSize))) && ((coords.y > (markers[i].y - touchSize)) && (coords.y < (markers[i].y + touchSize)))) 
						{
                            if(isEraseClicked)
							{
                                if(deleteType == 'four' || deleteType == 'one') 
								{
                                    markers.splice(i,1);
                                    if(deleteType == 'four' && markers.length == 1)
									{
                                        markers.splice(0,1);
                                        $("#x"+(i)+(i+1)).remove();
                                    }
                                } 
								else 
								{
                                    if(markers[i].color1=="transparent")
									{
                                        markers.splice(i-1,2);  
                                         $("#x"+(i-1)+(i)).remove();
                                    }
									else 
									{
                                        markers.splice(i,2);
                                          $("#x"+(i)+(i+1)).remove();
                                    }                                    
                                }                                
                                refreshWindow();
                                //isEraseClicked = false;'
                                if (types == 'two' || types == 'three') 
								{
                                    for (var j = 0; j < markers.length; j+=2) 
									{
                                        markers[j].draw();
                                        connectMarkers(markers[j], markers[j + 1], j);
                                    }
                                } 
								else if(types == 'one') 
								{
                                    for (var j = 0; j < markers.length; j+=1) 
									{
                                        markers[j].draw();
                                        if (j > 0)
										{
                                            connectMarkers(markers[j], markers[j - 1], j);                                     
										}
                                    }
                                }  
                            } 
							else 
							{
                                isSettingA = true;
                                markersSnapped = false;
                                markers[i].prevX = markers[i].x;
                                markers[i].x = markers[i].prevX;                                
                                showTouch(coords.x, coords.y);                                
                                grabbed = i;
                                buttonDown = true;
                            }
                            break;
                        }

                       if(markers[i+1]!=undefined){
                        	if(types=="two"){
		                       	if(  ((coords.x>markers[i].x) &&(coords.x<markers[i+1].x))||  ((coords.x>markers[i+1].x) &&(coords.x<markers[i].x)) ){
		                          console.log("coordinates -x:"+coords.x+ " coordinates -y:"+coords.y );
		                          //	 if(($(".marker"+(markers.length-2)).length===0)&&($(".marker"+ ((markers.length-2)+1)).length===0)){
		                          	if(($(".marker"+(i+1)).length===0)&& ($(".marker"+(i)).length===0)){
				                        //  $("#mainContainer").append("<div style='left:"+(coords.x+10)+"px;top:"+(coords.y-30)+"px;position:absolute;display:block;' id='x"+(markers.length/2)+"' class='numTxt marker"+(markers.length-2)+" marker"+  ((markers.length-2)+1)+"'></div>");
				                          $("#mainContainer").append("<div style='left:"+(coords.x+10)+"px;top:"+(coords.y-30)+"px;position:absolute;display:block;' id='x"+(i)+(i+1)+"' class='numTxt marker"+(i)+" marker"+  (i+1)+"'></div>");
				                          $("#page-0").append("<div id='editorTxt"+(markers.length/2)+"'></div>");
				                          bindKeyPad();
				                          markers[i].hasInputBox=1;
			                              markers[i+1].hasInputBox=1;
		                             }       
		                         }
	                        }
	                       else if(types=="three"){
		                        if(  (coords.x>markers[i+1].x) &&  (coords.x<markers[i].x)  ){
		                          console.log("coordinates -x:"+coords.x+ " coordinates -y:"+coords.y );
		                      
		                          	if(($(".marker"+(i+1)).length===0)&& ($(".marker"+(i)).length===0)){
				                   
				                          $("#mainContainer").append("<div style='left:"+(coords.x+10)+"px;top:"+(coords.y-30)+"px;position:absolute;display:block;' id='x"+(i)+(i+1)+"' class='numTxt marker"+(i)+" marker"+  (i+1)+"'></div>");
				                          $("#page-0").append("<div id='editorTxt"+(markers.length/2)+"'></div>");
				                          bindKeyPad();
				                          markers[i].hasInputBox=1;
			                              markers[i+1].hasInputBox=1;
		                             }       
		                         }
	                        }
	                      else if(deleteType==="four"){
	                      	if(  ((coords.x>markers[i].x) &&(coords.x<markers[i+1].x))||  ((coords.x>markers[i+1].x) &&(coords.x<markers[i].x)) ){
		                          console.log("coordinates -x:"+coords.x+ " coordinates -y:"+coords.y );
		                          //	 if(($(".marker"+(markers.length-2)).length===0)&&($(".marker"+ ((markers.length-2)+1)).length===0)){
		                          	if(($(".marker"+(i)).length===0)){
				                      
				                          $("#mainContainer").append("<div style='left:"+(coords.x+10)+"px;top:"+(coords.y-60)+"px;position:absolute;display:block;' id='x"+(i)+"' class='numTxt marker"+(i)+"'></div>");
				                          $("#page-0").append("<div id='editorTxt"+(markers.length/2)+"'></div>");
				                          bindKeyPad();
				                          markers[i].hasInputBox=1;
			                              markers[i+1].hasInputBox=1;
		                             }       
		                         }
	                      }
                        }
                        
                    }
                   // alert("touchCalled");
                }
            }
			
        }
        function actionMove(coords, event) 
		{
			
            if (event.pageY >= 200 && event.pageY <= 340) 
			{
                if (!clicked) 
				{
                    var offsetCanvas = $('#canvas1').offset().left;
                    if(event.targetTouches != undefined) 
					{
                        if (event.targetTouches.length == 2 && doubletouch) 
						{
                            if (allowPinchZoom) 
							{
                                var currentDistance = Math.abs(event.targetTouches[0].pageX - event.targetTouches[1].pageX);
                                if (initialDistance > currentDistance) 
								{
                                    if ((initialDistance - currentDistance) >= 50) 
									{                                        
                                        // console.log(multipler);
                                        clearWindow();
                                        tempX = coords.x;
                                        scaleRatio = initialDistance/currentDistance;
                                        
                                        axis1.numMajorTicks=new BigNumber(Math.round((axis1.handleTicks*scaleRatio)*100)/100);
                                        if (axis1.numMajorTicks > 2000)
										{
                                            //axis1.numMajorTicks = 2000;
                                        }
										else if (axis1.numMajorTicks < 1)
										{
                                            axis1.numMajorTicks = 1;
                                        }
                                        //axis1.CalculateMultipler(event, initialPoints, false);
                                        axis1.draw();
                                        allowPinchZoom = false;
                                        initialDistance = currentDistance;
                                    }
                                } 
								else 
								{
                                    if ((currentDistance - initialDistance) >= 50) 
									{
                                        //axis1.multipler += 1;
                                        //initialDistance = currentDistance;
                                        //console.log(multipler);
                                        clearWindow();
                                        tempX = coords.x;
                                        scaleRatio = initialDistance/currentDistance;
                                        
                                        axis1.numMajorTicks=new BigNumber(Math.round((axis1.handleTicks*scaleRatio)*100)/100);
                                        if (axis1.numMajorTicks > 2000)
										{
                                            //axis1.numMajorTicks = 2000;
                                        }
										else if (axis1.numMajorTicks < 1)
										{
                                            axis1.numMajorTicks = 1;
                                        }
                                        //axis1.CalculateMultipler(event, initialPoints, true);
                                        initialDistance = currentDistance;
                                        axis1.draw();
                                        allowPinchZoom = false;
                                    }    
                                }
                            }
                        } 
						else if (event.targetTouches.length == 1 && singletouch) 
						{
                            var currentDistance = (event.targetTouches[0].pageX - offsetCanvas) - initialPoints;
                            // initialPoints = event.targetTouches[0].pageX-offsetCanvas;
                            swipeIndicator.css("left", event.targetTouches[0].pageX - (swipeIndicator.width() / 2));
                            if (Math.abs(currentDistance) > axis1.majorTickDist) 
							{
                                initialPoints = event.targetTouches[0].pageX - offsetCanvas;
                                clearWindow();
                                if (currentDistance > 0) 
								{
                                    axis1.moveAxis(false);
                                }
								else 
								{
                                    axis1.moveAxis(true);
                                }
                            }
                        }
                    }
                    if (types == 'one') 
					{
                        refreshWindow();
                        for (var j = 0; j < markers.length; j++) 
						{
                            markers[j].x = axis1.getX(markers[j].unitVal);
                            if (markers[j].x >= 25 && markers[j].x <= 1000) 
							{
                                markers[j].draw();
                                if (j > 0)
								{
                                    connectMarkers(markers[j], markers[j - 1], j);
								}
                            }
                        }						
                    } 
					else if (types == 'two' || types == 'three') 
					{
                        refreshWindow();
                        for (var j = 0; j < markers.length; j++) 
						{
                            markers[j].x = axis1.getX(markers[j].unitVal);
                            if (markers[j].x >= 25 && markers[j].x <= 1000) 
							{
                                markers[j].draw();
                                if (j % 2 == 1) 
								{
                                    connectMarkers(markers[j - 1], markers[j], j);
                                    markers[j].unitVal = axis1.getUnit(markers[j].x);
                                }
                            }
                        }
                    }
                } 
				else 
				{
					
                    if (buttonDown == true && grabbed != null) 
					{
                    	if(coords.x < 25)
						{
                            coords.x = 25;
						}
                        if(coords.x > 980)
						{
                            coords.x = 980;
						}
                        if (types == 'two') 
						{
                            refreshWindow();
                            var current;
                            if (grabbed % 2 == 0) 
							{
                                current = grabbed + 1;
                                if (coords.x >= (markers[grabbed + 1].x)) 
								{
                                    markers[grabbed + 1].arrowDirection = 'left';
                                }
								else 
								{
                                    markers[grabbed + 1].arrowDirection = 'right';
                                }
                                if (coords.x <= markers[grabbed + 1].x - markers[grabbed + 1].x - markers[grabbed].x) 
								{
                                    markers[grabbed].x = coords.x;
                                    markers[grabbed].draw();
                                }
                                markers[grabbed + 1].x = coords.x + markers[grabbed + 1].x - markers[grabbed].x;
                                markers[grabbed + 1].draw();
                                markers[grabbed].x = coords.x;
                                markers[grabbed].draw();
                                $(".marker"+grabbed).css("left",coords.x);
								
                                //console.log(markers[grabbed+1].x-markers[grabbed].x)
                            } 
							else 
							{
                                if (coords.x <= (markers[grabbed - 1].x))
								{
                                    markers[grabbed].arrowDirection = 'left';
								}
                                else
								{
                                    markers[grabbed].arrowDirection = 'right';
								}
                                markers[grabbed].x = coords.x;
                                markers[grabbed - 1].draw();
                                current = grabbed - 1;
                                 $(".marker"+grabbed).css("left",coords.x);
                            }
                            if (current > grabbed)
							{
                                connectMarkers(markers[grabbed], markers[current]);
							}
                            else
							{
                                connectMarkers(markers[current], markers[grabbed]);								
							}
                            for (var i = 0; i < markers.length; i++) 
							{
                                var currentNew;
                                if (i % 2 == 0) 
								{
                                    markers[i].draw();
                                    currentNew = i + 1;
                                } 
								else 
								{
                                    markers[i].draw();
                                    currentNew = i - 1;
                                }
                                if (currentNew > i) 
								{
									console.log("Left Value ---------------------")
                                    connectMarkers(markers[i], markers[currentNew], i);
                                    markers[i].unitVal = axis1.getUnit(markers[i].x);
                                }
								else 
								{
									console.log("Right Value ---------------------")
                                    connectMarkers(markers[currentNew], markers[i]);
                                    markers[i].unitVal = axis1.getUnit(markers[i].x);
                                }                                
                            }							
                        } 
						else if (types == 'three') 
						{
							
                            refreshWindow();
                            var current;
                            if (grabbed % 2 == 0) 
							{
                                current = grabbed + 1;
                                if (coords.x >= (markers[grabbed + 1].x)) 
								{
                                    markers[grabbed + 1].arrowDirection = 'right';
                                }
								else 
								{
                                    markers[grabbed + 1].arrowDirection = 'left';
                                }
                                if (coords.x <= markers[grabbed + 1].x - markers[grabbed + 1].x - markers[grabbed].x) 
								{
                                    markers[grabbed].x = coords.x;
                                    markers[grabbed].draw();
                                }
                                markers[grabbed + 1].x = coords.x + markers[grabbed + 1].x - markers[grabbed].x;
                                markers[grabbed + 1].draw();
                                markers[grabbed].x = coords.x;
                                markers[grabbed].draw();
                                $(".marker"+grabbed).css("left",coords.x);
                                //console.log(markers[grabbed+1].x-markers[grabbed].x)
                            } 
							else 
							{
                                if (coords.x <= (markers[grabbed - 1].x))
								{
                                    markers[grabbed].arrowDirection = 'right';
								}
                                else
								{
                                    markers[grabbed].arrowDirection = 'left';
								}
                                markers[grabbed].x = coords.x;
                                markers[grabbed - 1].draw();
                                current = grabbed - 1;
                                $(".marker"+grabbed).css("left",coords.x);
                            }
                            if (current > grabbed)
							{
                                connectMarkers(markers[grabbed], markers[current]);
							}
                            else
							{
                                connectMarkers(markers[current], markers[grabbed]);
							}
                            for (var i = 0; i < markers.length; i++) 
							{
                                var currentNew;
                                if (i % 2 == 0) 
								{
                                    markers[i].draw();
                                    currentNew = i + 1;
                                }
								else 
								{
                                    markers[i].draw();
                                    currentNew = i - 1;
                                }
                                if (currentNew > i) 
								{
                                    connectMarkers(markers[i], markers[currentNew], i);
                                    markers[i].unitVal = axis1.getUnit(markers[i].x);
                                }
								else 
								{
                                    connectMarkers(markers[currentNew], markers[i]);
                                    markers[i].unitVal = axis1.getUnit(markers[i].x);
                                }
                            }
                        } 
						else 
						{
                            refreshWindow();
                            markers[grabbed].x = coords.x;
                            markers[grabbed].draw();
                            for (var j = 1; j < markers.length; j++) 
							{
                                connectMarkers(markers[j], markers[j - 1], j);
                                markers[j].unitVal = axis1.getUnit(markers[j].x);
                                markers[0].unitVal = axis1.getUnit(markers[0].x);
                            }
                         
                            var grabbedX=markers[grabbed].x;
                            var grabbedXX=markers[grabbed+1].x;
                            console.log("GrabbedX :"+ grabbedX +" GrabbedY :"+ grabbedXX);
                            $(".marker"+grabbed).css("left",grabbedX+((grabbedXX-grabbedX)/2));
							
                        }
                    }
                }
            }
        }

        function actionEnd() 
		{
            $(".markers").css("display", "none");
        }
        //Oh the app has loaded lets draw our lines on the screen along with the start button.
        //Note, any tap will start things up, you don't need to actually tap in the start button.
        context.canvas.width = 1000;
        context.canvas.height = 450;
        context.fillStyle = "#99cc66";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        axis1.end = context.canvas.width - 20;
        //axis2.end = context.canvas.width-winPadding;
        //Draw the default axes
        axis1.draw();
        postMsg("Canvas Size: " + context.canvas.width + ":" + context.canvas.height);
        postMsg("Window Size: " + window.innerWidth + 'px:' + window.innerHeight + 'px');
		
        function eHandler(event) {
            if (activityStarted) {
                var coords = event;
                var myLoc = new coordinates(0, 0);
                var offset = findPos(canvas);
                switch (event.type) {
                case "mousedown":
                    myLoc.x = coords.pageX - offset.x;
                    myLoc.y = coords.pageY - offset.y;
                    touchSize = pointerSize;
                    actionStart(myLoc, event);
                    break;
                case "mouseup":
                    buttonDown = false;
                    /*myLoc.x = coords.pageX-offset.x;
					myLoc.y = coords.pageY-offset.y;
					touchSize=pointerSize;
					actionEnd(myLoc);*/
                    break;
                case "mousemove":
                    myLoc.x = coords.pageX - offset.x;
                    myLoc.y = coords.pageY - offset.y;
                    touchSize = pointerSize;
                    actionMove(myLoc, event);
                    break;
                case "touchstart":
                    myLoc.x = coords.targetTouches[0].pageX - offset.x;
                    myLoc.y = coords.targetTouches[0].pageY - offset.y;
                    touchSize = contactSize;
                    actionStart(myLoc, event);
                    break;
                case "touchend":
                    buttonDown = false;
                    // Skip getting coords, not supported by touchend
                    //touchSize=contactSize;
                    actionEnd();
                    break;
                case "touchmove":
                    myLoc.x = coords.targetTouches[0].pageX - offset.x;
                    myLoc.y = coords.targetTouches[0].pageY - offset.y;
                    touchSize = contactSize;
                    actionMove(myLoc, event);
                    break;
                }
            }
        }

        function clearWindow() {
            var wHeight = context.canvas.height;
            postMsg("Clearing Window");
            if (debugTouch) {
                wHeight = 265;
            }
            context.globalAlpha = 1;
            context.fillStyle = "#99cc66";
            context.fillRect(0, 0, context.canvas.width, wHeight);
        }
      //  OnResizeCalled();
     /*   function OnResizeCalled() {
            postMsg("Going from : " + context.canvas.width + ":" + context.canvas.height + " to " + window.innerWidth + 'px:' + window.innerHeight + 'px');
            context.canvas.width = 1000;
            context.canvas.height = 450;
            axis1.end = context.canvas.width - 20;
            if (!hasStarted) {
                axis1.draw();
                context.beginPath();
                context.fillStyle = "#99cc66";
                context.strokeStyle = "Black";
                context.globalAlpha = 0.8;
                context.arc((context.canvas.width / 2), 450, 50, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();
                //Fill it witht he text
                context.font = "bold 18pt Arial";
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText("Start", (context.canvas.width / 2), 155);
            } else {
                axis1.draw();
                //axis2.draw();

                markerA.x = axis1.getX(markerA.unitVal);
                if (markersSnapped) {
                    if (snapAxisA) {
                        markerA.x = axis1.getX(markerA.unitVal);
                        markerB.x = markerA.x;
                    } else {
                        markerB.x = axis1.getX(markerB.unitVal);
                        markerA.x = markerB.x;
                    }
                } else {
                    markerA.x = axis1.getX(markerA.unitVal);
                    markerB.x = axis1.getX(markerB.unitVal);
                }
            }
        }*/
        leftMarkerSmallRange = $(".leftMarkerSmallRange")
        leftMarkerSmallRangeSpan = $(".leftMarkerSmallRange .numberpart span");
        rightMarkerSmallRange = $(".rightMarkerSmallRange");
        rightMarkerSmallRangeSpan = $(".rightMarkerSmallRange .numberpart span")
        leftMarkerBigRange = $(".leftMarkerBigRange");
        leftMarkerBigRangeSpan = $(".leftMarkerBigRange .numberpart span");
        rightMarkerBigRange = $(".rightMarkerBigRange");
        rightMarkerBigRangeSpan = $(".rightMarkerBigRange .numberpart span");
        swipeIndicator = $(".swipeIndicator");
        //This is an attempt to cut down on the instances where the canvas window is highlighted for copy instead of working as intended.
        window.addEventListener('selectstart', function (e) {
            e.preventDefault();
            return false;
        }, false);
        window.addEventListener('onselect', function (e) {
            e.preventDefault();
            return false;
        }, false);
        window.addEventListener('touchmove', function (e) {
            e.preventDefault();
            return false;
        }, false);
        window.addEventListener("resize", OnResizeCalled, false);
        // attach the touchstart, touchmove, touchend event listeners.
        //Using window events instead of canvas events to fix other selecting/scrolling issues.
        window.addEventListener('touchstart', eHandler, false);
        window.addEventListener('touchmove', eHandler, false);
        window.addEventListener('touchend', eHandler, false);
        // attach the mousestart, mousemove, mouseend event listeners.
        window.addEventListener("mousedown", eHandler, false);
        window.addEventListener('mousemove', eHandler, false);
        window.addEventListener('mouseup', eHandler, false);
        // prevent elastic scrolling
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
            document.body.addEventListener('selectstart', function (e) {
                e.preventDefault();
                return false;
            }, false);
        }, false);
    }, false);
    $('#canvas1').css('background', 'none');
    var pageContainer = $("<div id=\"interactive-container\" />");
	var menuContainer = $("<div id=\"page-container\" />");
	var page0 = $("<div id=\"page-0\" class=\"page\"><div class\"testingArea\"></div><div class=\"tablecon\"><!--<table border=\"1\" cellspacing=\"0\";  sytle=\"backgroud-color:#EEEFB6;\" class=\"container\" ><thead style=\"background-color:#51800B;font-color:white;\"><tr><th colspan=\"2\" style=\"color:white;\" >Single-batch Recipe:</th><th  colspan=\"2\"  style=\"color:white;\">Triple-batch Recipe:</th></tr></thead><tbody><tr><td><span class=\"one\">1</span><span class=\"two\"><span class=\"three\">2</span><span class=\"four\">3</span></span></td><td>cups all-purpose flour</td><td><div id=\"x1\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>cup(s) all-purpose flour</td></tr><tr><td><span class=\"one Pos\">1</span></td><td>teaspoon baking soda</td><td><div id=\"x2\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>teaspoon(s) baking soda</td></tr><tr><td><span class=\"two Pos\"><span class=\"three\">1</span><span class=\"four\">4</span></span></td><td>teaspoon salt</td><td><div id=\"x3\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>teaspoon(s) salt</td></tr><tr><td><span class=\"two\"><span class=\"three Pos\">1</span><span class=\"four Pos\">2</span></span></td><td>cup butter</td><td><div id=\"x4\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>cup butter</td></tr><tr><td><span class=\"two\"><span class=\"three Pos\">3</span><span class=\"four Pos\">4</span></span></td><td>cup brown sugar</td><td><div id=\"x5\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>cup brown sugar</td></tr><tr><td><span class=\"one Pos\">2</span></td><td>eggs, beaten</td><td><div id=\"x6\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>eggs, beaten</td></tr><tr><td><span class=\"one\">2</span><span class=\"two\"><span class=\"three\">1</span><span class=\"four\">3</span></span></td><td>cups mashed overripe bananas</td><td><div id=\"x7\" class=\"numTxt\" contentEditable=\"false\"></div></td><td>cups mashed overripe bananas</td></tr></tbody></table>--></div></div>");
	var hiddenTxt = $("<div ><input id=\"editorTxt1\" type=\"hidden\" /></div>");
	var vkeyCont = $("<div id=\"vkeyCont\"/>");
    page0.append(hiddenTxt);
	pageContainer.append(vkeyCont);
	menuContainer.append(page0);
	pageContainer.append(menuContainer);
	menuContainer.css("display","none");
	menuContainer.css("display","none");
	$('#mainContainer').append(pageContainer);
	$('#infoContainer').css('display', 'none');
	$('#mainContainerHidden').css('display', 'none');
	activityStarted = true;
});

//For Bottom Button Functionality to Switch Classes
function toggleClassButton(element, className) {
    var currentButton = element;
    if (!currentButton.hasClass(className)) {
        currentButton.addClass(className);
    } else {
        currentButton.removeClass(className);
    }
}
function vKeyPadEvent(event,vk){
	console.log("keyPad :"+event);
}
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
function resetActivity(){
	var current = $(this);
		//resetSettingPanel();
        current.removeClass('icoResetMove');
       // var to = setTimeout(function () {
       //     clearInterval(to);
       //     current.addClass('icoResetMove');
      //  }, 200)
        lineLength=10;
        context.clearRect(0, 0, canvas.width, canvas.height);
        axis1 = new axis(winPadding, context.canvas.width - winPadding, axisA, allowNegative, 10, lineLength, 0.1, axisColor, "", false);
        OnResizeCalled();
        clickedSubtract=false;
        clicked = false;
        isEraseClicked = false;
        deleteType = "one";
        $("#reset").removeClass("reset_selected");
        $('#scaleHidden').css('display', 'none');
        setting = 'add';
        $('#addbackHidden').css('display', 'none');
        $('#addHidden').css('display', 'none');
        refreshWindow();
        markers = [];
        colors = [];
        yCurve = [];
        $(".numTxt").remove();
        $("#vkeyCont").html("");
        typesArray=[];
}
