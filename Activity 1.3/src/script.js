import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x7c3aed })
)
mesh.position.set(0.7, -0.6, 1)
mesh.scale.set(1.6, 0.4, 0.8)
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
scene.add(mesh)

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

const sizes = { width: 800, height: 600 }

const camera = new THREE.PerspectiveCamera(72, sizes.width / sizes.height)
camera.position.set(1.6, 0.9, 1.8)
camera.lookAt(mesh.position)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)