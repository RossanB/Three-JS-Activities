import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'     
import * as dat from 'lil-gui'

const parameters = {
    color: 0xff6b6b,
    metalness: 0.7,
    roughness: 0.2,
    geometry: 'box',
    morphSpeed: 1.0,
    scale: 1.0,
    rotationSpeed: 0.5,
    wireframe: false,
    spin: () =>
    {
        gsap.to(sculptureGroup.rotation, {duration: 2, y: sculptureGroup.rotation.y + Math.PI * 2})
    },
    reset: () =>
    {
        sculptureGroup.rotation.set(0, 0, 0)
        sculptureGroup.scale.set(1, 1, 1)
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Morphing Geometric Sculpture
 */
const sculptureGroup = new THREE.Group()

// Create multiple geometries for morphing
const geometries = {
    box: new THREE.BoxGeometry(1, 1, 1),
    sphere: new THREE.SphereGeometry(0.7, 32, 32),
    torus: new THREE.TorusGeometry(0.5, 0.3, 16, 100),
    octahedron: new THREE.OctahedronGeometry(0.8, 0),
    tetrahedron: new THREE.TetrahedronGeometry(0.8, 0),
    cone: new THREE.ConeGeometry(0.6, 1.2, 8)
}

const material = new THREE.MeshStandardMaterial({ 
    color: parameters.color,
    metalness: parameters.metalness,
    roughness: parameters.roughness,
    wireframe: parameters.wireframe
})

// Create the main morphing mesh
const mesh = new THREE.Mesh(geometries.box, material)
sculptureGroup.add(mesh)

// Add some orbiting smaller shapes
const orbitCount = 6
for(let i = 0; i < orbitCount; i++) {
    const orbitGeometry = new THREE.SphereGeometry(0.1, 8, 8)
    const orbitMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(i / orbitCount, 0.8, 0.6),
        metalness: 0.3,
        roughness: 0.4
    })
    const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial)
    
    const angle = (i / orbitCount) * Math.PI * 2
    orbitMesh.position.set(
        Math.cos(angle) * 2,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * 2
    )
    
    sculptureGroup.add(orbitMesh)
}

scene.add(sculptureGroup)

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xff6b6b, 0.5, 10)
pointLight.position.set(-2, 1, 2)
scene.add(pointLight)

// GUI Controls
const gui = new dat.GUI()

// Geometry morphing
const geometryFolder = gui.addFolder('Geometry')
geometryFolder.add(parameters, 'geometry', Object.keys(geometries))
    .onChange((value) => {
        mesh.geometry = geometries[value]
    })

// Material controls
const materialFolder = gui.addFolder('Material')
materialFolder.addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })
materialFolder.add(parameters, 'metalness', 0, 1, 0.01)
    .onChange(() => {
        material.metalness = parameters.metalness
    })
materialFolder.add(parameters, 'roughness', 0, 1, 0.01)
    .onChange(() => {
        material.roughness = parameters.roughness
    })
materialFolder.add(parameters, 'wireframe')
    .onChange(() => {
        material.wireframe = parameters.wireframe
    })

// Animation controls
const animationFolder = gui.addFolder('Animation')
animationFolder.add(parameters, 'morphSpeed', 0, 3, 0.1)
animationFolder.add(parameters, 'scale', 0.5, 2, 0.1)
    .onChange(() => {
        sculptureGroup.scale.setScalar(parameters.scale)
    })
animationFolder.add(parameters, 'rotationSpeed', 0, 2, 0.1)

// Actions
const actionsFolder = gui.addFolder('Actions')
actionsFolder.add(parameters, 'spin')
actionsFolder.add(parameters, 'reset')

// Position controls
const positionFolder = gui.addFolder('Position')
positionFolder.add(sculptureGroup.position, 'x', -3, 3, 0.1)
positionFolder.add(sculptureGroup.position, 'y', -3, 3, 0.1)
positionFolder.add(sculptureGroup.position, 'z', -3, 3, 0.1)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate the main sculpture
    sculptureGroup.rotation.y = elapsedTime * parameters.rotationSpeed
    sculptureGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1
    
    // Animate orbiting spheres
    sculptureGroup.children.forEach((child, index) => {
        if (index > 0) { // Skip the main mesh
            const angle = (index - 1) / orbitCount * Math.PI * 2 + elapsedTime * parameters.morphSpeed
            child.position.set(
                Math.cos(angle) * 2,
                Math.sin(angle * 2) * 0.5,
                Math.sin(angle) * 2
            )
            child.rotation.y = elapsedTime * 2
            child.rotation.x = elapsedTime * 1.5
        }
    })
    
    // Morphing animation for the main mesh
    mesh.rotation.y = elapsedTime * 0.8
    mesh.rotation.x = elapsedTime * 0.4
    
    // Breathing effect
    const breathe = Math.sin(elapsedTime * 2) * 0.1 + 1
    mesh.scale.setScalar(breathe)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

