import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const galaxyGroup = new THREE.Group()
const starCount = 2000
const positionsArray = new Float32Array(starCount * 3)
const colorsArray = new Float32Array(starCount * 3)
const sizesArray = new Float32Array(starCount)

for(let i = 0; i < starCount; i++) {
    const i3 = i * 3
    
    const radius = Math.random() * 8
    const angle = Math.random() * Math.PI * 2
    const height = (Math.random() - 0.5) * 2
    
    positionsArray[i3] = Math.cos(angle) * radius
    positionsArray[i3 + 1] = height
    positionsArray[i3 + 2] = Math.sin(angle) * radius
    
    const starType = Math.random()
    if (starType < 0.1) {
        colorsArray[i3] = 0.8
        colorsArray[i3 + 1] = 0.9
        colorsArray[i3 + 2] = 1.0
        sizesArray[i] = Math.random() * 0.02 + 0.01
    } else if (starType < 0.3) {
        colorsArray[i3] = 1.0
        colorsArray[i3 + 1] = 1.0
        colorsArray[i3 + 2] = 1.0
        sizesArray[i] = Math.random() * 0.01 + 0.005
    } else {
        colorsArray[i3] = 1.0
        colorsArray[i3 + 1] = 0.8
        colorsArray[i3 + 2] = 0.6
        sizesArray[i] = Math.random() * 0.015 + 0.008
    }
}

const starGeometry = new THREE.BufferGeometry()
starGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))
starGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))
starGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1))

const starMaterial = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending
})

const stars = new THREE.Points(starGeometry, starMaterial)
galaxyGroup.add(stars)

const blackHoleGeometry = new THREE.SphereGeometry(0.3, 32, 32)
const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    transparent: true,
    opacity: 0.8
})
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial)
galaxyGroup.add(blackHole)

const nebulaCount = 100
const nebulaPositions = new Float32Array(nebulaCount * 3)
const nebulaColors = new Float32Array(nebulaCount * 3)

for(let i = 0; i < nebulaCount; i++) {
    const i3 = i * 3
    const radius = Math.random() * 6 + 2
    const angle = Math.random() * Math.PI * 2
    
    nebulaPositions[i3] = Math.cos(angle) * radius
    nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 1.5
    nebulaPositions[i3 + 2] = Math.sin(angle) * radius
    
    const nebulaType = Math.random()
    if (nebulaType < 0.33) {
        nebulaColors[i3] = 1.0
        nebulaColors[i3 + 1] = 0.6
        nebulaColors[i3 + 2] = 1.0
    } else if (nebulaType < 0.66) {
        nebulaColors[i3] = 1.0
        nebulaColors[i3 + 1] = 0.7
        nebulaColors[i3 + 2] = 0.9
    } else {
        nebulaColors[i3] = 0.6
        nebulaColors[i3 + 1] = 0.8
        nebulaColors[i3 + 2] = 1.0
    }
}

const nebulaGeometry = new THREE.BufferGeometry()
nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3))
nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3))

const nebulaMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
})

const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial)
galaxyGroup.add(nebula)

scene.add(galaxyGroup)





// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate galaxy rotation with gradual speed limit
    const maxGalaxySpeed = 0.05
    const galaxySpeed = Math.min(elapsedTime * 0.02, maxGalaxySpeed)
    galaxyGroup.rotation.y = elapsedTime * galaxySpeed
    
    // Animate individual stars (twinkling effect)
    const starPositions = stars.geometry.attributes.position.array
    const starColors = stars.geometry.attributes.color.array
    
    for(let i = 0; i < starCount; i++) {
        const i3 = i * 3
        
        // Twinkling effect with gradual speed limit
        const maxTwinkleSpeed = 1.2
        const twinkleSpeed = Math.min(elapsedTime * 0.6, maxTwinkleSpeed)
        const twinkle = Math.sin(twinkleSpeed + i * 0.1) * 0.3 + 0.7
        starColors[i3] *= twinkle
        starColors[i3 + 1] *= twinkle
        starColors[i3 + 2] *= twinkle
        
        // Orbital motion around center with speed limit
        const radius = Math.sqrt(starPositions[i3] * starPositions[i3] + starPositions[i3 + 2] * starPositions[i3 + 2])
        const maxOrbitalSpeed = 0.025
        const orbitalSpeed = Math.min(elapsedTime * 0.01 * (1 / (radius + 1)), maxOrbitalSpeed)
        const angle = Math.atan2(starPositions[i3 + 2], starPositions[i3]) + orbitalSpeed
        
        starPositions[i3] = Math.cos(angle) * radius
        starPositions[i3 + 2] = Math.sin(angle) * radius
    }
    
    stars.geometry.attributes.position.needsUpdate = true
    stars.geometry.attributes.color.needsUpdate = true
    
    // Animate nebula with speed limit
    const nebulaPositions = nebula.geometry.attributes.position.array
    for(let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3
        const radius = Math.sqrt(nebulaPositions[i3] * nebulaPositions[i3] + nebulaPositions[i3 + 2] * nebulaPositions[i3 + 2])
        const maxNebulaSpeed = 0.015
        const nebulaSpeed = Math.min(elapsedTime * 0.005, maxNebulaSpeed)
        const angle = Math.atan2(nebulaPositions[i3 + 2], nebulaPositions[i3]) + nebulaSpeed
        
        nebulaPositions[i3] = Math.cos(angle) * radius
        nebulaPositions[i3 + 2] = Math.sin(angle) * radius
    }
    nebula.geometry.attributes.position.needsUpdate = true
    
    // Animate black hole with speed limit
    const maxBlackHoleSpeed = 0.25
    const blackHoleSpeedY = Math.min(elapsedTime * 0.1, maxBlackHoleSpeed)
    const blackHoleSpeedX = Math.min(elapsedTime * 0.08, maxBlackHoleSpeed * 0.7)
    blackHole.rotation.y = elapsedTime * blackHoleSpeedY
    blackHole.rotation.x = elapsedTime * blackHoleSpeedX

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()