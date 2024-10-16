let canvas3D = document.getElementById('canvas3D');
let scene, camera, renderer, model;
let isMouseDown = false; // Bandera para detectar cuando el usuario hace clic
let prevMouseX, prevMouseY;
let zoomFactor = 1; // Factor de zoom
const zoomSpeed = 0.1; // Velocidad de zoom
let interactionTimeout; // Temporizador para la inactividad del usuario

// Función para cargar y mostrar el modelo 3D
function init3DModel() {
  // Inicializar la escena
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Agregar una luz direccional para iluminar los materiales
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Agregar una luz ambiental para una iluminación suave
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Cargar el modelo 3D (ruta al modelo en la carpeta /models)
  const loader = new THREE.GLTFLoader();
  loader.load('models/Perfume1.glb', function(gltf) {
    model = gltf.scene;
    
    // Cambiar los materiales a MeshStandardMaterial
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: child.material.color,
          metalness: 0.5,
          roughness: 0.5,
        });
      }
    });

    scene.add(model);
    camera.position.z = 5;
    model.position.y = -2.5;
    animate();
  });

  // Detectar interacción del mouse
  canvas3D.addEventListener('mousedown', onMouseDown);
  canvas3D.addEventListener('mousemove', onMouseMove);
  canvas3D.addEventListener('mouseup', onMouseUp);
  canvas3D.addEventListener('mouseleave', onMouseUp);
  
  // Detectar interacción táctil
  canvas3D.addEventListener('touchstart', onTouchStart);
  canvas3D.addEventListener('touchmove', onTouchMove);
  canvas3D.addEventListener('touchend', onTouchEnd);
  
  // Detectar el uso de la rueda del mouse
  canvas3D.addEventListener('wheel', onMouseWheel);

  // Animar el modelo
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}

// Función que detecta el clic del mouse
function onMouseDown(event) {
  isMouseDown = true;
  prevMouseX = event.clientX;
  prevMouseY = event.clientY;
  resetInteractionTimeout(); // Reinicia el temporizador al interactuar
}

// Función que detecta el movimiento del mouse y rota el modelo
function onMouseMove(event) {
  if (!isMouseDown || !model) return;

  const deltaX = event.clientX - prevMouseX;
  const deltaY = event.clientY - prevMouseY;

  model.rotation.y += deltaX * 0.01; // Rotación horizontal
  model.rotation.x += deltaY * 0.01; // Rotación vertical (opcional)

  prevMouseX = event.clientX;
  prevMouseY = event.clientY;
  
  resetInteractionTimeout(); // Reinicia el temporizador al interactuar
}

// Función que detecta cuando el usuario deja de hacer clic
function onMouseUp() {
  isMouseDown = false;
}

// Funciones para manejar interacciones táctiles
function onTouchStart(event) {
  isMouseDown = true;
  if (event.touches.length > 0) {
    prevMouseX = event.touches[0].clientX;
    prevMouseY = event.touches[0].clientY;
  }
  resetInteractionTimeout(); // Reinicia el temporizador al interactuar
}

function onTouchMove(event) {
  if (!isMouseDown || !model) return;

  // Prevenir el desplazamiento de la página
  event.preventDefault();
  
  if (event.touches.length > 0) {
    const deltaX = event.touches[0].clientX - prevMouseX;
    const deltaY = event.touches[0].clientY - prevMouseY;

    model.rotation.y += deltaX * 0.01; // Rotación horizontal
    model.rotation.x += deltaY * 0.01; // Rotación vertical (opcional)

    prevMouseX = event.touches[0].clientX;
    prevMouseY = event.touches[0].clientY;
  }
  resetInteractionTimeout(); // Reinicia el temporizador al interactuar
}

function onTouchEnd() {
  isMouseDown = false;
}

// Función para manejar el zoom con la rueda del mouse
function onMouseWheel(event) {
  event.preventDefault(); // Evita el desplazamiento de la página
  zoomFactor -= event.deltaY * zoomSpeed; // Ajusta el factor de zoom
  zoomFactor = Math.max(1, zoomFactor); // Limita el zoom a un valor mínimo
  camera.position.z = 5 * zoomFactor; // Ajusta la posición de la cámara
  resetInteractionTimeout(); // Reinicia el temporizador al interactuar
}

// Función para reiniciar el temporizador de interacción
function resetInteractionTimeout() {
  clearTimeout(interactionTimeout); // Limpia el temporizador existente
  interactionTimeout = setTimeout(playFinalVideo, 2000); // Inicia el temporizador de 2 segundos sin interacción
}

// Función que inicia el video final
function playFinalVideo() {
  canvas3D.style.display = 'none'; // Oculta el modelo 3D
  videoFinal.style.display = 'block'; // Muestra el video final
  videoFinal.play();
}

// Al tocar el video inicial, se muestra el modelo 3D
videoInicial.addEventListener('click', function() {
  videoInicial.style.display = 'none'; // Oculta el video inicial
  canvas3D.style.display = 'block'; // Muestra el canvas del modelo 3D
  init3DModel(); // Inicializa el modelo 3D
});


// Función que inicia el video final
function playFinalVideo() {
  canvas3D.style.display = 'none'; // Oculta el modelo 3D
  videoFinal.style.display = 'block'; // Muestra el video final
  
  // Espera un breve momento para asegurarse de que el video está listo
  setTimeout(() => {
    videoFinal.play().catch(error => {
      console.error("Error al reproducir el video: ", error);
    });
  }, 100); // Espera 100 ms antes de intentar reproducir el video
}



