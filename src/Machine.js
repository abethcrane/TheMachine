var machineData = {
	lastGradient: 9999999,
	lineStart: { x:0, y:0 },
	lineEnd: { x:0, y:0 },
	lines: [],
	invalid: false,
	currentColor: "#000000",
	currentWidth: "1.0"
};

$(document).ready( function( ) {
	$('#machineCanvas')
		.mousedown( handleMouseDown )
		.mouseup( handleMouseUp );
	
	var sliderConfig = {
		orientation: "horizontal",
		range: "min",
		max: 255,
		value: 0,
		slide: changeColor,
		change: changeColor
	}
	
	$('#redSlider, #greenSlider, #blueSlider').slider( sliderConfig );
	
	var widthSliderConfig = {
		orienatation: "horizontal",
		range: "min",
		min: 1.0,
		max: 10.0,
		step: 0.1,
		slide: changeWidth,
		change: changeWidth
	}
	
	$('#widthPicker').slider( widthSliderConfig );
	
	setInterval( commit, 100 );
	
	
	
} );


function changeColor( ) {
	var r = $('#redSlider').slider( "value" );
	var g = $('#greenSlider').slider( "value" );
	var b = $('#blueSlider').slider( "value" );

	var hex = [ r.toString( 16 ), g.toString( 16 ), b.toString( 16 ) ];
	$.each( hex, function( index, value ) {
		if ( value.length === 1 ) {
			hex[index] = "0" + value;
		}
	} );
	
	machineData.currentColor = '#' + hex.join( "" ).toUpperCase( );
	
	$('#swatch').css( "background-color", machineData.currentColor );
}

function changeWidth() {
	machineData.currentWidth = $('#widthPicker').slider( "value" );
	$('#swatch').height( machineData.currentWidth );
	$('#widthPicker').find( '.ui-slider-handle' ).width( machineData.currentWidth+10 );
}

function commit( ) {
	if ( machineData.invalid ) {
		var canvas = $('#machineCanvas')[0];
		var c = canvas.getContext( "2d" );
	
		var startX = machineData.lineStart.x;
		var startY = machineData.lineStart.y;
		
		var endX = machineData.lineEnd.x;
		var endY = machineData.lineEnd.y;
		
		addLine( startX, startY, endX, endY );
		
		c.beginPath( );
		c.moveTo( startX, startY );
		c.lineTo( endX, endY );
		c.lineCap = "round";
		c.strokeStyle = machineData.currentColor;
		c.lineWidth = machineData.currentWidth;
		c.stroke( );
		c.closePath( );
	}
}

function redraw( ) {
	var canvas = $('#machineCanvas')[0];
	var c = canvas.getContext( "2d" );
	
	c.clearRect( canvas.width, canvas.height );
	
	for ( var i in machineData.lines ) {
		var line = machineData.lines[i];
		c.beginPath( );
		c.moveTo( line.fromX, line.fromY );
		c.lineTo( line.toX, line.toY );
		c.lineCap = "round";
		c.strokeStyle = line.color;
		c.stroke( );
		c.closePath( );
	}
}

function addLine( startX, startY, endX, endY ) {
	
	machineData.lines.push( {
		fromX: startX, 
		fromY: startY,
		toX: endX,
		toY: endY,
		color: machineData.currentColor
	} );
	
	machineData.lineStart.x = endX;
	machineData.lineStart.y = endY;
}

function handleDrag( event ) {
	var canvas = event.target;
	var c = canvas.getContext( "2d" );
	
	var x = event.offsetX;
	var y = event.offsetY;
	
	machineData.lineEnd.x = x;
	machineData.lineEnd.y = y;
	
	machineData.invalid = true;
}

function handleMouseDown( event ) {
	machineData.lineStart.x = event.offsetX;
	machineData.lineStart.y = event.offsetY;
	
	machineData.lineEnd.x = event.offsetX;
	machineData.lineEnd.y = event.offsetY;
	
	$('#machineCanvas').bind( 'mousemove', handleDrag );
}

function handleMouseUp( event ) {
	$('#machineCanvas').unbind( 'mousemove', handleDrag );
}