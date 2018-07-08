var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');


var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');


var InitDemo = function () {
	console.log('Thi is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if(!gl){
		console.log('WebGl not supported, falling back on experimental webGL');
		gl = canvas.getContext('experimental webgl');
	}

	if(!gl){
		alert('your browser does not support WebGl');
	}

	gl.clearColor(1.0, 0.0, 1.0, 1.0);//color but not paint
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//clear the color buffer and depth buffer

	//create tringle
	//virtual share
	//setup the entire graphics program 
	//this requiere a vertexshader & fractment shader
	// framecolor = vertexshader(vertPosition,vertColor)
	//gl framentcolor = vec4(framecolor, 1.0);

	//create shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER); //like openGL
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);//like openGL
	//setup the shader source
	gl.shaderSource(vertexShader,vertexShaderText); //idividual program componnent
	gl.shaderSource(fragmentShader,fragmentShaderText);//idividual program componnent

	//compile the shader code:

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}//check for compilation

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}//check for compilation


	//create the main webgl program
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);//attach vertex shader source code to the program
	gl.attachShader(program, fragmentShader);//attach fragmentshader source coide to the program
	gl.linkProgram(program);//link the program
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}//check if it works

	//validate the program
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// sent iformation for the graphic card to be used
	// it is needed to define all the x,y possitions of the triangle as a list
	// then it is needed to attach  that list to the graphics card

	var triangleVertices = 
	[//X,Y 			R,G,B
		 0.0, 0.5,	1.0, 1.0, 0.0,	
		-0.5, -0.5, 0.7, 0.0, 1.0,
		 0.5, -0.5, 0.1, 1.0, 0.6

	]; //array not yet used by the graphics card
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexBufferObject);//variables to pass to the graphic card
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);//specified the data (TYPEOFINPUT, VALUE, TYPEDRAW)
																						//new Float32Array(triangleVertices)
	//Handler The attribute																					
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	//layout of the the atribute
	gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	2, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE, //normalzation
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	0 // Offset from the beginning of a single vertex to this attribute
	);

	// add second attribute for color 
	var ColorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	//Handler The attribute																					
	gl.vertexAttribPointer(
	ColorAttribLocation, // Attribute location
	3, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE, //normalzation
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);



	//anable the attribute
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(ColorAttribLocation);
	//
	// main rander loop
	//
	//specified the program to use
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES,0,3);//gl.TRIANGLES we are going to write in triangles, how many elements skeep, numb vetices of draw


};