import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
const sizes = { width: 800, height: 600 }

const scene = new THREE.Scene()

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true })
)
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height)
camera.position.set(1.8, 1.2, 2.2)
camera.lookAt(mesh.position)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  mesh.rotation.y = elapsedTime * 0.7
  mesh.rotation.x = elapsedTime * 0.3
  camera.position.x = Math.sin(elapsedTime * 0.4) * 3
  camera.position.z = Math.cos(elapsedTime * 0.4) * 3
  camera.lookAt(mesh.position)
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()