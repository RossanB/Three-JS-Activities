import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const mesh = new THREE.Mesh(
  new THREE.TorusGeometry(0.6, 0.25, 16, 48),
  new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true })
)
scene.add(mesh)

const sizes = { width: 800, height: 600 }

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height)
camera.position.set(3.6, 2.0, 4.2)
camera.lookAt(mesh.position)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()
const tick = () => {
  const t = clock.getElapsedTime()
  mesh.rotation.x = t * 0.6
  mesh.rotation.y = t * 0.8
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()
