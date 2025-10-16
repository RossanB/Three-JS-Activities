import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const imageSource = '/image.png'

/* console.log(imageSource)
const image = new Image()
const texture = new THREE.Texture(image)


image.addEventListener('load', () =>
{
    texture.needsUpdate = true
})

image.src = '/textures/door/color.jpg'
*/

const TextureLoader = new THREE.TextureLoader()
const texture = TextureLoader.load('/textures/door/color.jpg',
    () =>
    {
        console.log('loading finished')
    },
    () =>
    {
        console.log('loading in progress')
    },
    () =>
    {
        console.log('error loading')
    }
)

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}

loadingManager.onLoad = () =>
{
    console.log('loading finished')
}

loadingManager.onProgress = () =>
{
    console.log('loading in progress')
}

loadingManager.onError = () =>
{
    console.log('error loading')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

const colorTexture = textureLoader.load('/textures/minecraft.png')
/*
    colorTexture.repeat.x = 2
    colorTexture.repeat.y = 3
    colorTexture.wrapS = THREE.RepeatWrapping
    colorTexture.wrapT = THREE.RepeatWrapping
    colorTexture.offset.x = 0.5
    colorTexture.offset.y = 0.5
    colorTexture.rotation = Math.PI * 0.25
    colorTexture.center.x = 0.5
    colorTexture.center.y = 0.5
*/
    colorTexture.magFilter = THREE.NearestFilter
    colorTexture.generateMipmaps = false
    colorTexture.minFilter = THREE.NearestFilter
    
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

//Environment Map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

// Bubble/Metal Materials
const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.6,
    thickness: 0.5,
    ior: 1.33,
    transparent: true,
    opacity: 0.8,
    envMap: environmentMapTexture,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0
})

const metalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x888888,
    metalness: 1.0,
    roughness: 0.05,
    envMap: environmentMapTexture,
    envMapIntensity: 3.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0
})

const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdddddd,
    metalness: 1.0,
    roughness: 0.0,
    envMap: environmentMapTexture,
    envMapIntensity: 4.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    reflectivity: 1.0
})

// Enhanced lighting setup for better visibility
const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true
scene.add(directionalLight)

const pointLight1 = new THREE.PointLight(0xff6b6b, 1.2, 15)
pointLight1.position.set(-3, 2, 3)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x4ecdc4, 1.2, 15)
pointLight2.position.set(3, -2, -3)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xffffff, 1.0, 12)
pointLight3.position.set(0, 3, 0)
scene.add(pointLight3)

const spotLight = new THREE.SpotLight(0xffffff, 1.5, 25, Math.PI * 0.15, 0.3, 1)
spotLight.position.set(0, 5, 0)
spotLight.target.position.set(0, 0, 0)
scene.add(spotLight)
scene.add(spotLight.target)

// Bubble objects
const bubbleGroup = new THREE.Group()

// Main bubble (large sphere)
const mainBubble = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 64, 64),
    bubbleMaterial
)
mainBubble.position.set(0, 0, 0)
bubbleGroup.add(mainBubble)

// Floating smaller bubbles - spread out more
const bubbleCount = 6
for(let i = 0; i < bubbleCount; i++) {
    const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + Math.random() * 0.12, 32, 32),
        bubbleMaterial.clone()
    )
    
    const angle = (i / bubbleCount) * Math.PI * 2
    const radius = 2.5 + Math.random() * 0.8
    bubble.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * radius
    )
    
    bubbleGroup.add(bubble)
}

// Metal objects - spread out more
const metalGroup = new THREE.Group()

// Chrome sphere
const chromeSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 64, 64),
    chromeMaterial
)
chromeSphere.position.set(-3.5, 1, 0)
metalGroup.add(chromeSphere)

// Metal torus
const metalTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.12, 32, 100),
    metalMaterial
)
metalTorus.position.set(3.5, 1, 0)
metalGroup.add(metalTorus)

// Metal box
const metalBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    metalMaterial
)
metalBox.position.set(0, -2.5, 0)
metalGroup.add(metalBox)

scene.add(bubbleGroup, metalGroup)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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

    // Animate bubbles - smoother
    bubbleGroup.rotation.y = elapsedTime * 0.1
    
    // Animate individual bubbles
    bubbleGroup.children.forEach((bubble, index) => {
        if (index === 0) {
            // Main bubble - gentle movement
            bubble.rotation.y = elapsedTime * 0.3
            bubble.rotation.x = elapsedTime * 0.2
            bubble.position.y = Math.sin(elapsedTime * 0.8) * 0.1
        } else {
            // Floating bubbles - smoother orbital motion
            const angle = (index - 1) / bubbleCount * Math.PI * 2 + elapsedTime * 0.15
            const radius = 2.5 + Math.sin(elapsedTime * 0.2 + index) * 0.3
            bubble.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle * 1.5) * 0.3 + Math.sin(elapsedTime * 0.5 + index) * 0.05,
                Math.sin(angle) * radius
            )
            bubble.rotation.y = elapsedTime * (0.2 + index * 0.05)
        }
    })
    
    // Animate metal objects - smoother
    metalGroup.rotation.y = elapsedTime * 0.05
    
    chromeSphere.rotation.y = elapsedTime * 0.4
    chromeSphere.rotation.x = elapsedTime * 0.2
    
    metalTorus.rotation.y = elapsedTime * 0.3
    metalTorus.rotation.x = elapsedTime * 0.15
    
    metalBox.rotation.y = elapsedTime * 0.2
    metalBox.rotation.x = elapsedTime * 0.1
    
    // Animate lights
    pointLight1.position.x = -3 + Math.sin(elapsedTime * 0.5) * 1
    pointLight1.position.z = 3 + Math.cos(elapsedTime * 0.5) * 1
    
    pointLight2.position.x = 3 + Math.sin(elapsedTime * 0.3) * 0.5
    pointLight2.position.z = -3 + Math.cos(elapsedTime * 0.3) * 0.5
    
    pointLight3.position.y = 3 + Math.sin(elapsedTime * 0.7) * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()