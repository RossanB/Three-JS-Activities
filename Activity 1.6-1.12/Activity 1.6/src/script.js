import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Crystal Cluster
 */
// Create multiple crystal geometries
const crystalGroup = new THREE.Group()

// Main crystal (octahedron)
const mainCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.8, 0),
    new THREE.MeshBasicMaterial({ 
        color: 0x00ff88,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    })
)
mainCrystal.position.y = 0.2
crystalGroup.add(mainCrystal)

// Add a visible cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshBasicMaterial({ 
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    })
)
cube.position.set(0, -0.8, 0)
crystalGroup.add(cube)

// Secondary crystals (tetrahedrons)
const crystalColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b]
const crystalPositions = [
    { x: 0.6, y: -0.3, z: 0.4 },
    { x: -0.5, y: 0.1, z: 0.7 },
    { x: 0.3, y: 0.4, z: -0.6 },
    { x: -0.8, y: -0.2, z: -0.3 },
    { x: 0.1, y: -0.6, z: 0.2 },
    { x: -0.2, y: 0.5, z: -0.8 }
]

crystalPositions.forEach((pos, index) => {
    const crystal = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.3, 0),
        new THREE.MeshBasicMaterial({ 
            color: crystalColors[index],
            transparent: true,
            opacity: 0.7
        })
    )
    crystal.position.set(pos.x, pos.y, pos.z)
    crystal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    )
    crystalGroup.add(crystal)
})

// Add some sparkle particles
const sparkleGeometry = new THREE.BufferGeometry()
const sparkleCount = 20
const sparklePositions = new Float32Array(sparkleCount * 3)

for(let i = 0; i < sparkleCount * 3; i++) {
    sparklePositions[i] = (Math.random() - 0.5) * 4
}

sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3))

const sparkles = new THREE.Points(
    sparkleGeometry,
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    })
)
crystalGroup.add(sparkles)

scene.add(crystalGroup)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate crystal cluster
    crystalGroup.rotation.y = elapsedTime * 0.3
    crystalGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1
    
    // Animate individual crystals
    crystalGroup.children.forEach((child, index) => {
        if (child.geometry.type === 'OctahedronGeometry') {
            child.rotation.y = elapsedTime * 0.8
            child.rotation.x = elapsedTime * 0.4
        } else if (child.geometry.type === 'BoxGeometry') {
            // Animate the cube
            child.rotation.y = elapsedTime * 0.6
            child.rotation.x = elapsedTime * 0.3
            child.rotation.z = elapsedTime * 0.2
        } else if (child.geometry.type === 'TetrahedronGeometry') {
            child.rotation.y = elapsedTime * (0.5 + index * 0.1)
            child.rotation.z = Math.sin(elapsedTime + index) * 0.2
        } else if (child.type === 'Points') {
            // Animate sparkles
            child.rotation.y = elapsedTime * 0.2
            const positions = child.geometry.attributes.position.array
            for(let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(elapsedTime + i) * 0.01
            }
            child.geometry.attributes.position.needsUpdate = true
        }
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>{
    if(!document.fullscreenElement){
        if (canvas.requestFullscreen){
            canvas.requestFullscreen()
            }
            else if(canvas.webkitRequestFullscreen){
                canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen){
            document.exitFullscreen()   
        }
        else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
    }
})

