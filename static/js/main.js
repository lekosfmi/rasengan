//

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set( 0, 0, 5 ).normalize();

scene.add(light);

//

let pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 10, 0, 1000 );

scene.add(pointLight);

//

camera.position.z = 200;
camera.position.x = 0;

//

const planeGeometry = x => {

  if (x === 'top-bottom') {
    return new THREE.PlaneGeometry(10, 100);
  }

  if (x === 'left-right') {
    return new THREE.PlaneGeometry(100, 10);
  }

  if (x === 'slanted') {
    return new THREE.PlaneGeometry(10, 200);
  }

  return false;

};

//

const planeMaterial = (x) => {

  return new THREE.MeshPhongMaterial({ color: x });

};

// Top

let planeMaterialTop = planeMaterial(0xece7b6);
let planeTop = new THREE.Mesh(planeGeometry('top-bottom'), planeMaterialTop);
planeTop.doubleSide = true;
planeTop.position.y = 150;

scene.add(planeTop);

// Bottom

let planeMaterialBottom = planeMaterial(0xee2e2e);
let planeBottom = new THREE.Mesh(planeGeometry('top-bottom'), planeMaterialBottom);
planeBottom.doubleSide = true;
planeBottom.position.y = -150;

scene.add(planeBottom);

// Left

let planeMaterialLeft = planeMaterial(0xffd0dc);
let planeLeft = new THREE.Mesh(planeGeometry('left-right'), planeMaterialLeft);
planeLeft.doubleSide = true;
planeLeft.position.x = -150;

scene.add(planeLeft);

// Right

let planeMaterialRight = planeMaterial(0x58d1db);
let planeRight = new THREE.Mesh(planeGeometry('left-right'), planeMaterialRight);
planeRight.doubleSide = true;
planeRight.position.x = 150;

scene.add(planeRight);

// Top Right

let planeMaterialTopRight = planeMaterial(0xff9797);
let planeTopRight = new THREE.Mesh(planeGeometry('slanted'), planeMaterialTopRight);
planeTopRight.doubleSide = true;
planeTopRight.position.x = 110;
planeTopRight.position.y = 110;
planeTopRight.rotation.z = -.8;

scene.add(planeTopRight);

// Top Left

let planeMaterialTopLeft = planeMaterial(0xff6c6c);
let planeTopLeft = new THREE.Mesh(planeGeometry('slanted'), planeMaterialTopLeft);
planeTopLeft.doubleSide = true;
planeTopLeft.position.x = -110;
planeTopLeft.position.y = 110;
planeTopLeft.rotation.z = .8;
planeTopLeft.receiveShadow = true;

scene.add(planeTopLeft);

// Bottom Left

let planeMaterialBottomLeft = planeMaterial(0xffc4c4);
let planeBottomLeft = new THREE.Mesh(planeGeometry('slanted'), planeMaterialBottomLeft);
planeBottomLeft.doubleSide = true;
planeBottomLeft.position.x = -110
planeBottomLeft.position.y = -110
planeBottomLeft.rotation.z = -.8
planeBottomLeft.receiveShadow = true

scene.add(planeBottomLeft);

// Bottom Right

let planeMaterialBottomRight = planeMaterial(0xffb1b1);
let planeBottomRight = new THREE.Mesh(planeGeometry('slanted'), planeMaterialBottomRight);
planeBottomRight.doubleSide = true;
planeBottomRight.position.x = 110;
planeBottomRight.position.y = -110;
planeBottomRight.rotation.z = .8;

scene.add(planeBottomRight);

// Center Sphere

let sphereGeometry = new THREE.SphereGeometry(50, 20);
let sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x87cefa });
let innerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(innerSphere)

//

function render() {

  requestAnimationFrame(render);

  planeTopLeft.rotateY(0.02)
  planeTop.rotation.y -= 0.04
  planeTopRight.rotateY(0.06)
  planeRight.rotation.x += 0.08
  planeBottomRight.rotateY(0.02)
  planeBottom.rotation.y += 0.04
  planeBottomLeft.rotateY(0.06)
  planeLeft.rotation.x -= 0.08

  innerSphere.rotateX(+0.05)
  innerSphere.rotateZ(+0.05)

  if (camera.position.z <= 700) {
    camera.position.z += 5;
  }

  camera.rotation.z += 0.02

  renderer.render(scene, camera);

}

window.addEventListener('load', render, false);
