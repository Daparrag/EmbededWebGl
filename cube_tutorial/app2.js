var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',	
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld *  vec4(vertPosition, 1.0);',
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

	gl.clearColor(0.75, 0.85, 0.8, 1.0);//color but not paint
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//clear the color buffer and depth buffer
	/*makig fixed colors*/
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

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

	var CubeVertices = //triangle atribute declaration
	[	//X,Y,Z 			    R,G,B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	]; //array not yet used by the graphics card
	
	
	/*cube indices*/
	var Cubeindices = //triangle atribute declaration
	[
		//indicate which set of vertices form the triangles that form each face of the cube
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	
	];
	
	
	
	
	var cubeVertexBufferObject = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER,cubeVertexBufferObject);//variables to pass to the graphic card
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CubeVertices), gl.STATIC_DRAW);//specified the data (TYPEOFINPUT, VALUE, TYPEDRAW)
																						//new Float32Array(CubeVertices)
	
		//no will be necessary to introduce index buffers
	var cubeIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cubeindices), gl.STATIC_DRAW);//specified the data (TYPEOFINPUT, VALUE, TYPEDRAW)
																						//new Float32Array(CubeVertices)
	
	//Handler The attribute																					
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	//layout of the the atribute
	gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	3, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE, //normalzation
	6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
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
	6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	
	
	
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(ColorAttribLocation);
	
	//specified the program to use //Tell openGL state machine which program should be active
	gl.useProgram(program);	
	
	
	// lets do something with the uniform matrix  
	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');// This is used to define a world location matrix  // ALOCATED ON a GPU MEMORY
	var matViewUniformLocation = gl.getUniformLocation(program,'mView');   // This is used to define a view location matrix	  // ALOCATED ON a GPU MEMORY
	var matProjUniformLocation = gl.getUniformLocation(program,'mProj');  // This is used to define a proj location matrix	  // ALOCATED ON a GPU MEMORY	
	
	var worldMatrix = new Float32Array(16); // Variables on CPU-RAM
	var viewMatrix = new Float32Array(16);	// Variables on CPU-RAM
	var projMatrix = new Float32Array(16);	// Variables on CPU-RAM
	
	mat4.identity(worldMatrix); // identity matrix of 16 elements for mWorld 
	mat4.lookAt(viewMatrix,[0,0,-5],[0,0,0],[0,1,0] );
	mat4.perspective(projMatrix,glMatrix.toRadian(45),canvas.width /canvas.height, 0.1, 1000.0 ); 
	//mat4.identity(viewMatrix);  // identity matrix of 16 elements for mWiew
	//mat4.identity(projMatrix);  // identity matrix of 16 elements for mProj
	
	 // gl.uniform you should pass VALUES and TYPE THIS FUCTION COPY FROM LOCAL MEMORY TO GPU 
	 //  lets do it here!!!
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); //used for a matrix 4x4 with float values WebGLRenderingContext.uniformMatrix2fv(location, transpose, value);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE,viewMatrix); //used for a matrix 4x4 with float values  WebGLRenderingContext.uniformMatrix2fv(location, transpose, value);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE,projMatrix); //used for a matrix 4x4 with float values  WebGLRenderingContext.uniformMatrix2fv(location, transpose, value);
	
	//creating the rotation matrices
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	
	
	
	
	
	//anable the attribute
	//gl.enableVertexAttribArray(positionAttribLocation);
	//gl.enableVertexAttribArray(ColorAttribLocation);
	//
	// main rander loop
	//

	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle=0;
	var loop = function ()
	{
		angle = performance.now() / 1000 / 6 * 2 * Math.PI; /* 1/6 per seconds*/
		mat4.rotate(yRotationMatrix,identityMatrix, angle / 5, [0,1,0]);	
		mat4.rotate(xRotationMatrix,identityMatrix, angle / 5 , [1,0,0]);	
		mat4.mul(worldMatrix,xRotationMatrix,yRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		
		
		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT |  gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, Cubeindices.length, gl.UNSIGNED_SHORT, 0);//used to draw index elements istead to a simple triangle
		
		
		//gl.drawArrays(gl.TRIANGLES,0,3);//gl.TRIANGLES we are going to write in triangles, how many elements skeep, numb vetices of draw
		
		requestAnimationFrame(loop);
		
	};
	
	requestAnimationFrame(loop);
};