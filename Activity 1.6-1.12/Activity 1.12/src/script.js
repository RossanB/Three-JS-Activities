import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const geometry1 = new THREE.BoxGeometry(1, 1, 1)
const material1 = new THREE.MeshBasicMaterial({ 
    color: 0xff6b6b,
    wireframe: true 
})
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.position.set(-2, 0, 0)
scene.add(mesh1)

const geometry2 = new THREE.SphereGeometry(0.7, 16, 12)
const material2 = new THREE.MeshBasicMaterial({ 
    color: 0x4ecdc4,
    wireframe: true 
})
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.set(0, 0, 0)
scene.add(mesh2)

const geometry3 = new THREE.ConeGeometry(0.6, 1.2, 8)
const material3 = new THREE.MeshBasicMaterial({ 
    color: 0x45b7d1,
    wireframe: true 
})
const mesh3 = new THREE.Mesh(geometry3, material3)
mesh3.position.set(2, 0, 0)
scene.add(mesh3)

const geometry4 = new THREE.TorusGeometry(0.5, 0.2, 8, 16)
const material4 = new THREE.MeshBasicMaterial({ 
    color: 0xf9ca24,
    wireframe: true 
})
const mesh4 = new THREE.Mesh(geometry4, material4)
mesh4.position.set(0, 2, 0)
scene.add(mesh4)

const geometry5 = new THREE.OctahedronGeometry(0.6)
const material5 = new THREE.MeshBasicMaterial({ 
    color: 0xf0932b,
    wireframe: true 
})
const mesh5 = new THREE.Mesh(geometry5, material5)
mesh5.position.set(-2, 2, 0)
scene.add(mesh5)

const geometry6 = new THREE.TetrahedronGeometry(0.6)
const material6 = new THREE.MeshBasicMaterial({ 
    color: 0xeb4d4b,
    wireframe: true 
})
const mesh6 = new THREE.Mesh(geometry6, material6)
mesh6.position.set(2, 2, 0)
scene.add(mesh6)

const geometry7 = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8)
const material7 = new THREE.MeshBasicMaterial({ 
    color: 0x6c5ce7,
    wireframe: true 
})
const mesh7 = new THREE.Mesh(geometry7, material7)
mesh7.position.set(0, -2, 0)
scene.add(mesh7)

const geometry8 = new THREE.PlaneGeometry(1.5, 1.5)
const material8 = new THREE.MeshBasicMaterial({ 
    color: 0x00b894,
    wireframe: true 
})
const mesh8 = new THREE.Mesh(geometry8, material8)
mesh8.position.set(-2, -2, 0)
mesh8.rotation.x = -Math.PI * 0.5
scene.add(mesh8)

const geometry9 = new THREE.RingGeometry(0.3, 0.7, 16)
const material9 = new THREE.MeshBasicMaterial({ 
    color: 0xe17055,
    wireframe: true 
})
const mesh9 = new THREE.Mesh(geometry9, material9)
mesh9.position.set(2, -2, 0)
scene.add(mesh9)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    mesh1.rotation.x = elapsedTime * 0.5
    mesh1.rotation.y = elapsedTime * 0.3
    mesh1.position.y = Math.sin(elapsedTime) * 0.5

    mesh2.rotation.x = elapsedTime * 0.4
    mesh2.rotation.y = elapsedTime * 0.6
    mesh2.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.2)

    mesh3.rotation.x = elapsedTime * 0.3
    mesh3.rotation.z = elapsedTime * 0.4
    mesh3.position.y = Math.cos(elapsedTime * 1.2) * 0.3

    mesh4.rotation.x = elapsedTime * 0.2
    mesh4.rotation.y = elapsedTime * 0.8
    mesh4.position.z = Math.sin(elapsedTime * 1.5) * 0.4

    mesh5.rotation.x = elapsedTime * 0.6
    mesh5.rotation.y = elapsedTime * 0.4
    mesh5.rotation.z = elapsedTime * 0.2

    mesh6.rotation.x = elapsedTime * 0.3
    mesh6.rotation.y = elapsedTime * 0.7
    mesh6.scale.setScalar(1 + Math.cos(elapsedTime * 1.8) * 0.15)

    mesh7.rotation.x = elapsedTime * 0.4
    mesh7.rotation.y = elapsedTime * 0.5
    mesh7.position.x = Math.sin(elapsedTime * 0.8) * 0.3

    mesh8.rotation.z = elapsedTime * 0.3
    mesh8.position.y = -2 + Math.sin(elapsedTime * 1.1) * 0.2

    mesh9.rotation.x = elapsedTime * 0.5
    mesh9.rotation.y = elapsedTime * 0.3
    mesh9.position.z = Math.cos(elapsedTime * 1.3) * 0.2

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()