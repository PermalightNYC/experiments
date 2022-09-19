let scene, camera, light, cube, MODEL, renderer, gltf

const sizes = {
  scale: 1.5
}

const initGSAP = () => {
  MODEL = scene.getObjectByName("MODEL")

  let tl = gsap.timeline({
    id: 'Main Scroller',
    scrollTrigger: {
      trigger: ".section-0",
      start: "top top",
      endTrigger: ".section-7",
      end: "bottom bottom",
      scrub: 1,
    }
  });

  tl.addLabel("start")
    .to(".scroll-to-top", { autoAlpha: 1, bottom: "2rem" }, "start")
    .call(prepareControls, [0], "start")

    .to(MODEL.rotation, { y: `+=${Math.PI * .25}` }, "first")
    .call(prepareControls, [1], "first")

    .to(MODEL.rotation, { y: `-=${Math.PI / 1.2}` }, "second")
    .call(prepareControls, [2], "second")

    .to(MODEL.position, { x: `-=2`, y: `-=1` }, "third")
    .call(prepareControls, [3], "third")

    .to(MODEL.rotation, { y: `-=${Math.PI * 1.1}` }, "forth")
    .to(MODEL.scale, { x: `+=1`, y: `+=1`, z: `+=1` }, "-=1")
    .call(prepareControls, [4], "forth")

    .to(MODEL.rotation, { y: `+=${Math.PI * .1}`, x: `+=${Math.PI * .25}` }, "fifth")
    .to(MODEL.scale, { x: `-=1`, y: `-=1`, z: `-=1` }, "-=1")
    .to(MODEL.position, { x: `+=2`, y: `+=1` }, "-=1")

    .to(MODEL.position, { x: '-=0' }, "fifth")
    .call(prepareControls, [5], "fifth")

    .to(MODEL.rotation, { x: `-=${Math.PI * .25}` }, "sixth")
    .call(prepareControls, [6], "sixth")
    .to(MODEL.position, { y: `+=.5`, x: `-=1.5` }, "seventh")
    .call(prepareControls, [7], "seventh")
    .addLabel("end")

}

const prepareControls = (i) => {
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.classList.contains(`nav-item-${i}`)) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })
}

const init = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)

  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const backLight = new THREE.DirectionalLight(0x404040, 1)
  backLight.name = 'Back Light'
  backLight.position.set(-6, -9, -12)
  backLight.target.position.set(0, 0, 0)
  scene.add(backLight)

  const hemiLight = new THREE.HemisphereLight(0x404040, 0x080820, 1);
  scene.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
  scene.add(ambientLight);

  var keyLight = new THREE.SpotLight(0xffffff)
  keyLight.position.set(5, 5, 12)
  keyLight.target.position.set(0, 0, 0)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.width = 1024 * 4;
  keyLight.shadow.mapSize.height = 1024 * 4;
  keyLight.name = 'keyLight'
  keyLight.shadow.bias = -.005
  scene.add(keyLight)

  camera.position.z = 5;


  const manager = new THREE.LoadingManager();
  manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };
  manager.onLoad = function () {
    console.log('Loading complete!');
  };
  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };
  manager.onError = function (url) {
    // console.log('There was an error loading ' + url);
  };
  const modelLoader = new THREE.GLTFLoader(manager);
  var dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  modelLoader.setDRACOLoader(dracoLoader);
  modelLoader.load('brain-gain.gltf', (result) => {
    gltf = result

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true
        child.castShadow = true
      }
    })

    const children = [...gltf.scene.children]
    children.forEach((child) => {
      child.position.x = sizes.scale
      child.position.y = -(sizes.scale / 2)
      child.rotation.y = Math.PI * -.25
      child.scale.set(sizes.scale, sizes.scale, sizes.scale)
      child.name = "MODEL"
      scene.add(child)
    })

    initGSAP()

  })

  render()
}

const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}

init()

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
