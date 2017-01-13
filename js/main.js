const Colors = {
	  red: 0xf25346,
    white: 0xd8d0d1,
	  brown: 0x59332e,
    pink: 0xF5986E,
	  brownDark: 0x23190f,
	  blue: 0x68c3c0
};

//

window.addEventListener('load', init, false);

//

function init() {

    // set up the scene, the camera, and the renderer
    createScene();

    // add the lights
    createLights();

    // add the objects
    // createPlane();
    createSea();
    createSky();

    // start a loop that will update the object's positions
    // and render the scene on each frame
    loop();

}

//

let scene,
    camera,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    HEIGHT,
    WIDTH,
    renderer,
    container;

//

function createScene() {

    // get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // create the scene
    scene = new THREE.Scene();

    // add a fog effect to the scene; same color as the
    // background color used in the style sheet
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    // create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    // set the position of the camera
    camera.position.x = 0;
    camera.position.y = 200;
    camera.position.z = 100;

    // create the renderer
    renderer = new THREE.WebGLRenderer({

      // allow transparency to show the gradient background
      // we defined in the CSS
      alpha: true,

      // activate the anti-aliasing; this is less performant,
      // but, as our project is low-poly based, it should be fine
      antialias: true
    });

    // definie the size of ther renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // enable shadow rendering
    renderer.shadowMap.enabled = true;

    // add the DOM element of the renderer to the
    // container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    // listen to the screen: if the user resizes it
    // we have have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);

}

//

function handleWindowResize() {

    // update the height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}

//

let hemisphereLight,
    shadowLight;

function createLights() {

    // a hemisphere light is a gradient colored light;
    // the first parameter is the sky color, the second parameter is the ground color
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

    // a directional light shines from a specific directions
    // it acts like the sun, that means that all the ray produced are parallel
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // set the direction of the light
    shadowLight.position.set(150, 350, 350);

    // allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);

}

//

Sea = function() {

  // create hte geometry (shape) of the cylinder;
  // the parameters are:
  // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
  const geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

  // rotate the geometry on the x axis
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  // create the material
  const mat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    transparent: true,
    opacity: .6,
    shading: THREE.FlatShading
  });

  // to create an object in Three.js, we have to create a mesh
  // which is a combination of a geometry and some material
  this.mesh = new THREE.Mesh(geom, mat);

  // allow the sea to receive shadows
  this.mesh.receiveShadow = true;

}

// initiation the sea and add to the scene

let sea;

function createSea() {

    sea = new Sea();

    // push it a little bit at the bottom of the scene
    // sea.mesh.position.y = -600;
    sea.mesh.position.y = -600;

    // add the mesh of the sea to the scene
    scene.add(sea.mesh);

}

//

Cloud = function() {

		// create an empty container that will hold the different parts
		this.mesh = new THREE.Object3D();

		// create a cube geometry
		// this shape will be duplicated to create the cloud
		const geom = new THREE.BoxGeometry(20, 20, 20);

		// create a material; a simple white material will do the trick
		const mat = new THREE.MeshPhongMaterial({
			color: Colors.white
		});

		// duplicate the geometry a random number of times
		const nBlocs = 3 + Math.floor(Math.random() * 3);
		for (let i = 0; i < nBlocs; i++) {

				// create the mesh by cloning the geometry
				let m = new THREE.Mesh(geom, mat);

				// set the position and the rotation of each cube randomly
				m.position.x = i * 15;
				m.position.y = Math.random() * 10;
				m.position.z = Math.random() * 10;
				m.rotation.z = Math.random() * Math.PI * 2;
				m.rotation.z = Math.random() * Math.PI * 2;

				// set the size of the cube randomly
				const s = .1 + Math.random() * .9;
				m.scale.set(s, s, s);

				// allow each cube to cast and to receive shadows
				m.castShadow = true;
				m.receiveShadow = true;

				// add the cube to the container we first created
				this.mesh.add(m);

		}
}

//

Sky = function() {

		// create an empty container
		this.mesh = new THREE.Object3D();

		// choose a number of clouds to be scattered in the sky
		this.nClouds = 20;

		// to distribute the clouds consistently,
		// we need to place them according to a uniform angle
		const stepAngle = Math.PI * 2 / this.nClouds;

		// create the clouds
		for (let i = 0; i < this.nClouds; i++ ) {

				let c = new Cloud();

				// set the rotation and the position of each cloud;
				// for that we use a bit of trigonometry

				// this is the final angle of the cloud
				const a = stepAngle * i;

				 // this is the distance between the center of the axis and the cloud itself
				const h = 750 + Math.random() * 200;

				// trigonometry!
				// converting polar coodinates (angle, distance)
				c.mesh.position.y = Math.sin(a) * h;
				c.mesh.position.x = Math.cos(a) * h;

				// rotate the cloud according to its position
				c.mesh.rotation.z = a + Math.PI / 2;

				// for a better result, we position the clouds
				// at random depths inside of the scene
				c.mesh.position.z = -400 - Math.random() * 400;

				// we alse set a random scale for each cloud
				const s = 1 + Math.random() * 2;
				c.mesh.scale.set(s, s, s);

				// don't forget to add the mesh of each cloud in the scene
				this.mesh.add(c.mesh);

		}
}

//

// now we initiate the sky and push its center a bit
// towards the bottom of the screen

let sky;

function createSky() {

		sky = new Sky();
		sky.mesh.position.y = -600;
		scene.add(sky.mesh);

}

//

function loop() {

    sea.mesh.rotation.z += .005;
		sky.mesh.rotation.z += .01;

    renderer.render(scene, camera);
    requestAnimationFrame(loop);

}
