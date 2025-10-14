import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
const sizes = { width: window.innerWidth, height: window.innerHeight }

const scene = new THREE.Scene()

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff7995 })
)
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(58, sizes.width / sizes.height)
camera.position.set(2.2, 1.4, 3.0)
camera.lookAt(mesh.position)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const clock = new THREE.Clock()
let isPaused = false
const btn = document.getElementById('btn-toggle')
if (btn) btn.addEventListener('click', () => { isPaused = !isPaused; btn.textContent = isPaused ? 'Play' : 'Pause' })

const tick = () => {
  const t = clock.getElapsedTime()
  if (!isPaused) mesh.rotation.y = t
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()

