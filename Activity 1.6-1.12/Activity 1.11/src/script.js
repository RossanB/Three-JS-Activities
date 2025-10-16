import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sweet Donut Paradise
 */
const textureLoader = new THREE.TextureLoader()

// Load matcap textures for donuts
const matcapTextures = [
    textureLoader.load('/textures/matcaps/1.png'),
    textureLoader.load('/textures/matcaps/2.png'),
    textureLoader.load('/textures/matcaps/3.png'),
    textureLoader.load('/textures/matcaps/4.png'),
    textureLoader.load('/textures/matcaps/5.png'),
    textureLoader.load('/textures/matcaps/6.png'),
    textureLoader.load('/textures/matcaps/7.png'),
    textureLoader.load('/textures/matcaps/8.png')
]

// Create donut group
const donutGroup = new THREE.Group()

// Sweet donut colors
const donutColors = [
    0xff6b6b, // Pink
    0x4ecdc4, // Teal
    0x45b7d1, // Blue
    0xf9ca24, // Yellow
    0xf0932b, // Orange
    0xeb4d4b, // Red
    0x6c5ce7, // Purple
    0x00b894, // Green
    0xfd79a8, // Light Pink
    0xfdcb6e  // Light Orange
]

// Create animated donuts
const donutCount = 50
for(let i = 0; i < donutCount; i++) {
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const matcapTexture = matcapTextures[Math.floor(Math.random() * matcapTextures.length)]
    const torusMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
        color: donutColors[Math.floor(Math.random() * donutColors.length)]
    })
    
    const donut = new THREE.Mesh(torusGeometry, torusMaterial)
    
    // Position donuts in a larger area
    donut.position.x = (Math.random() - 0.5) * 25
    donut.position.y = (Math.random() - 0.5) * 25
    donut.position.z = (Math.random() - 0.5) * 25
    
    // Random rotation
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    
    // Random scale
    const scale = 0.5 + Math.random() * 1.5
    donut.scale.set(scale, scale, scale)
    
    // Store original position for animation
    donut.userData = {
        originalX: donut.position.x,
        originalY: donut.position.y,
        originalZ: donut.position.z,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatAmplitude: Math.random() * 2 + 1
    }
    
    donutGroup.add(donut)
}

scene.add(donutGroup)

// Add colorful lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const pointLight1 = new THREE.PointLight(0xff6b6b, 1.0, 15)
pointLight1.position.set(-5, 3, 5)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x4ecdc4, 1.0, 15)
pointLight2.position.set(5, -3, -5)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xf9ca24, 0.8, 12)
pointLight3.position.set(0, 5, 0)
scene.add(pointLight3)

const fontLoader = new FontLoader()
fontLoader.load(
    './helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry('SWEET', { 
            font: font,
            size: 0.4, 
            height: 0.1, 
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 3
        })
        
        textGeometry.computeBoundingBox()
        textGeometry.translate(
            -textGeometry.boundingBox.max.x * 0.5,
            -textGeometry.boundingBox.max.y * 0.5,
            -textGeometry.boundingBox.max.z * 0.5
        )
        
        const textMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.0,
            transmission: 0.8,
            thickness: 0.5,
            ior: 1.4,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            envMapIntensity: 2.0,
            transparent: true,
            opacity: 0.9
        })

        const text = new THREE.Mesh(textGeometry, textMaterial)
        text.position.set(0, 0, 0)
        text.scale.setScalar(3)
        scene.add(text)
        
        const textFolder = gui.addFolder('Sweet Text')
        textFolder.add(text.position, 'x', -5, 5, 0.1)
        textFolder.add(text.position, 'y', 0, 6, 0.1)
        textFolder.add(text.position, 'z', -5, 5, 0.1)
        textFolder.add(text.rotation, 'y', 0, Math.PI * 2, 0.01)
        textFolder.add(text.scale, 'x', 0.5, 2, 0.1)
        textFolder.add(text.scale, 'y', 0.5, 2, 0.1)
        textFolder.add(text.scale, 'z', 0.5, 2, 0.1)
        
        window.textMesh = text
        
        const bubbleCount = 20
        const bubbleGeometry = new THREE.SphereGeometry(0.05, 8, 6)
        const bubbleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.9,
            thickness: 0.1,
            ior: 1.33,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            transparent: true,
            opacity: 0.6
        })
        
        const bubbleGroup = new THREE.Group()
        scene.add(bubbleGroup)
        
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone())
            
            const radius = 2 + Math.random() * 3
            const angle = (i / bubbleCount) * Math.PI * 2
            bubble.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 4,
                Math.sin(angle) * radius
            )
            
            bubble.scale.setScalar(0.5 + Math.random() * 1.5)
            
            bubble.userData = {
                originalY: bubble.position.y,
                floatSpeed: 0.5 + Math.random() * 1,
                floatAmplitude: 0.3 + Math.random() * 0.5,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            }
            
            bubbleGroup.add(bubble)
        }
        
        window.bubbleGroup = bubbleGroup
    },
    undefined,
    (error) => {
        const fallbackGeometry = new THREE.BoxGeometry(2, 0.5, 0.2)
        const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b })
        const fallbackText = new THREE.Mesh(fallbackGeometry, fallbackMaterial)
        fallbackText.position.set(0, 0, 0)
        fallbackText.scale.setScalar(2)
        scene.add(fallbackText)
        window.textMesh = fallbackText
    }
)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
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

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Animate donut group
    donutGroup.rotation.y = elapsedTime * 0.05
    
    // Animate individual donuts
    donutGroup.children.forEach((donut, index) => {
        const userData = donut.userData
        
        // Sweet rotation
        donut.rotation.x += userData.rotationSpeedX
        donut.rotation.y += userData.rotationSpeedY
        donut.rotation.z += userData.rotationSpeedZ
        
        // Bouncy floating motion
        donut.position.y = userData.originalY + Math.sin(elapsedTime * userData.floatSpeed + index) * userData.floatAmplitude
        
        // Gentle orbit around center
        donut.position.x = userData.originalX + Math.sin(elapsedTime * 0.01 + index) * 0.5
        donut.position.z = userData.originalZ + Math.cos(elapsedTime * 0.01 + index) * 0.5
        
        // Sweet pulsing scale
        const pulse = 1 + Math.sin(elapsedTime * 0.5 + index) * 0.1
        donut.scale.setScalar(pulse)
    })
    
    if (window.textMesh) {
        window.textMesh.rotation.y = elapsedTime * 0.3
        window.textMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.5
        
        const bubblePulse = 3 + Math.sin(elapsedTime * 1.5) * 0.3
        window.textMesh.scale.setScalar(bubblePulse)
        
        window.textMesh.rotation.x = Math.sin(elapsedTime * 0.8) * 0.1
        window.textMesh.rotation.z = Math.cos(elapsedTime * 0.6) * 0.05
        
        const hue = (elapsedTime * 0.2) % 1
        window.textMesh.material.color.setHSL(hue, 0.8, 0.7)
        
        window.textMesh.material.thickness = 0.3 + Math.sin(elapsedTime * 2) * 0.2
    }
    
    if (window.bubbleGroup) {
        window.bubbleGroup.children.forEach((bubble, index) => {
            bubble.position.y = bubble.userData.originalY + 
                Math.sin(elapsedTime * bubble.userData.floatSpeed + index) * bubble.userData.floatAmplitude
            
            bubble.rotation.x += bubble.userData.rotationSpeed
            bubble.rotation.y += bubble.userData.rotationSpeed * 0.7
            bubble.rotation.z += bubble.userData.rotationSpeed * 0.3
            
            const pulse = 1 + Math.sin(elapsedTime * 1.5 + index) * 0.1
            bubble.scale.setScalar(pulse * (0.5 + Math.random() * 1.5))
            
            const bubbleHue = (elapsedTime * 0.3 + index * 0.1) % 1
            bubble.material.color.setHSL(bubbleHue, 0.6, 0.8)
        })
    }
    
    pointLight1.position.x = -5 + Math.sin(elapsedTime * 0.4) * 2
    pointLight1.position.z = 5 + Math.cos(elapsedTime * 0.4) * 2
    
    pointLight2.position.x = 5 + Math.sin(elapsedTime * 0.3) * 1.5
    pointLight2.position.z = -5 + Math.cos(elapsedTime * 0.3) * 1.5
    
    pointLight3.position.y = 5 + Math.sin(elapsedTime * 0.6) * 1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()