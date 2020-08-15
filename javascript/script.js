import * as THREE from './libs/modules/three.module.js';

import { EffectComposer } from './libs/modules/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/modules/postprocessing/RenderPass.js';
import { GlitchPass } from './libs/modules/postprocessing/GlitchPass.js';
import Stats from './libs/modules/stats/stats.module.js';

var CAMERA, SCENE, RENDERER, COMPOSER, OBJECT, LIGHT, GLITCH_PASS, STATS, CLOCK;
var FONT, TEXT, TEXT_GEOMETRY, TEXT_MATERIAL, GROUP;
var TEXT_PARAMETERS = {
  height: 20,
  size: 70,
  hover: 30
}

// functions call:

init();
animate();

// functions declaration:

function init ()
{
  RENDERER = new THREE.WebGLRenderer();
  RENDERER.setPixelRatio(window.devicePixelRatio);
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(RENDERER.domElement);

  //

  CLOCK = new THREE.Clock();

  //

  STATS = new Stats();
  // document.body.appendChild(STATS.dom);

  //

  CAMERA = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  CAMERA.position.z = 400;

  //

  SCENE = new THREE.Scene();
  SCENE.fog = new THREE.Fog(0x000000, 1, 1000);

  //

  GROUP = new THREE.Group();
  GROUP.position.x = -140;
  GROUP.position.z = 80;
  GROUP.rotation.y = .5;
  SCENE.add(GROUP)

  //

  OBJECT = new THREE.Object3D();
  SCENE.add(OBJECT);

  var sphere_geometry = new THREE.SphereBufferGeometry(1, 4, 4);

  for (let i=0; i < 100; ++i)
  { // begin for loop
    let material = new THREE.MeshPhongMaterial({
      color: 0xffffff * Math.random(),
      flatShading: true
    });
    let mesh = new THREE.Mesh(sphere_geometry, material);
    mesh.position.set(
      Math.random() - .5, // x
      Math.random() - .5, // y
      Math.random() - .5 // z
    ).normalize();
    mesh.position.multiplyScalar(Math.random() * 400);
    mesh.rotation.set(
      Math.random() * 2, // x
      Math.random() * 2, // y
      Math.random() * 2  // z
    );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 20;
    OBJECT.add(mesh);
  }; // end for loop

  //

  loadFont('../fonts/helvetiker_bold.typeface.json');

  //

  SCENE.add(new THREE.AmbientLight(0x222222));

  LIGHT = new THREE.DirectionalLight(0xffffff);
  LIGHT.position.set(1, 1, 1);
  SCENE.add(LIGHT);

  // postprocessing

  COMPOSER = new EffectComposer(RENDERER);
  COMPOSER.addPass(new RenderPass(SCENE, CAMERA));

  GLITCH_PASS = new GlitchPass();
  COMPOSER.addPass(GLITCH_PASS);

  //

  window.addEventListener('resize', onWindowResize, false);

}; // end "init" function

function onWindowResize ()
{
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();

  RENDERER.setSize(window.innerWidth, window.innerHeight);
  COMPOSER.setSize(window.innerWidth, window.innerHeight);
}; // end "onWindowResize" event Listener

function animate ()
{
  requestAnimationFrame(animate);
  const delta = CLOCK.getDelta();

  OBJECT.rotation.x += .005;
  OBJECT.rotation.y +=  .01;

  STATS.update(delta);

  COMPOSER.render();
}; // end of "animate" Frame handler

function loadFont (path)
{
  let loader = new THREE.FontLoader();
  loader.load(path, (loadedFont) => {
    FONT = loadedFont;
    createText("  Hassan\nMuhamad", loadedFont);
  });
}; // end "loader" function

function createText (text, font)
{
  console.log(font);
  TEXT_GEOMETRY = new THREE.TextGeometry(text, {
    font: FONT,
    size: TEXT_PARAMETERS.size,
    height: TEXT_PARAMETERS.height
  });
  TEXT_MATERIAL = new THREE.MeshPhongMaterial({color: 0xff0000});
  TEXT = new THREE.Mesh(TEXT_GEOMETRY, TEXT_MATERIAL);
  GROUP.add(TEXT);
}; // end "createText" function
