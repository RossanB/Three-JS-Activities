import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

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

// Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

//Environment Map




// Objects
// Futuristic Material Showcase
const showcaseGroup = new THREE.Group()

// Environment mapping
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

// Enhanced lighting setup for better visibility
const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true
scene.add(directionalLight)

const pointLight1 = new THREE.PointLight(0xff6b6b, 1.5, 15)
pointLight1.position.set(-3, 2, 3)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x4ecdc4, 1.5, 15)
pointLight2.position.set(3, -2, -3)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xf9ca24, 1.2, 12)
pointLight3.position.set(0, 3, -2)
scene.add(pointLight3)

// Futuristic materials
const materials = {
    // Holographic material
    holographic: new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.4,
        thickness: 0.5,
        ior: 1.5,
        transparent: true,
        opacity: 0.9,
        envMap: environmentMapTexture,
        envMapIntensity: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0
    }),
    
    // Liquid metal
    liquidMetal: new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        metalness: 1.0,
        roughness: 0.05,
        envMap: environmentMapTexture,
        envMapIntensity: 3.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0
    }),
    
    // Energy crystal
    energyCrystal: new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.5,
        thickness: 1.0,
        ior: 2.0,
        transparent: true,
        opacity: 0.9,
        envMap: environmentMapTexture,
        envMapIntensity: 1.5,
        emissive: 0x440044,
        emissiveIntensity: 0.8
    }),
    
    // Carbon fiber
    carbonFiber: new THREE.MeshPhysicalMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.1,
        envMap: environmentMapTexture,
        envMapIntensity: 3.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        normalMap: doorNormalTexture,
        normalScale: new THREE.Vector2(0.5, 0.5)
    }),
    
    // Neon glass
    neonGlass: new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.6,
        thickness: 0.3,
        ior: 1.4,
        transparent: true,
        opacity: 0.9,
        envMap: environmentMapTexture,
        envMapIntensity: 1.0,
        emissive: 0x004422,
        emissiveIntensity: 1.0
    }),
    
    // Plasma
    plasma: new THREE.MeshPhysicalMaterial({
        color: 0xff4400,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.4,
        thickness: 0.8,
        ior: 1.8,
        transparent: true,
        opacity: 0.95,
        envMap: environmentMapTexture,
        envMapIntensity: 2.0,
        emissive: 0x441100,
        emissiveIntensity: 1.2
    })
}

// Create showcase objects
const objects = []

// Holographic sphere
const holographicSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 64, 64),
    materials.holographic
)
holographicSphere.position.set(-2.5, 1, 0)
objects.push(holographicSphere)

// Liquid metal torus
const liquidMetalTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.15, 32, 100),
    materials.liquidMetal
)
liquidMetalTorus.position.set(-1, 1, 0)
objects.push(liquidMetalTorus)

// Energy crystal octahedron
const energyCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.4, 0),
    materials.energyCrystal
)
energyCrystal.position.set(0, 1, 0)
objects.push(energyCrystal)

// Carbon fiber box
const carbonFiberBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    materials.carbonFiber
)
carbonFiberBox.position.set(1, 1, 0)
objects.push(carbonFiberBox)

// Neon glass cone
const neonGlassCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.8, 8),
    materials.neonGlass
)
neonGlassCone.position.set(2.5, 1, 0)
objects.push(neonGlassCone)

// Plasma tetrahedron
const plasmaTetrahedron = new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.4, 0),
    materials.plasma
)
plasmaTetrahedron.position.set(0, -1, 0)
objects.push(plasmaTetrahedron)

// Add all objects to showcase
objects.forEach(obj => showcaseGroup.add(obj))
scene.add(showcaseGroup)

// GUI Controls
const materialFolder = gui.addFolder('Materials')
materialFolder.add(materials.holographic, 'transmission', 0, 1, 0.01)
materialFolder.add(materials.holographic, 'opacity', 0, 1, 0.01)
materialFolder.add(materials.liquidMetal, 'metalness', 0, 1, 0.01)
materialFolder.add(materials.liquidMetal, 'roughness', 0, 1, 0.01)
materialFolder.add(materials.energyCrystal, 'emissiveIntensity', 0, 2, 0.01)
materialFolder.add(materials.neonGlass, 'emissiveIntensity', 0, 2, 0.01)
materialFolder.add(materials.plasma, 'emissiveIntensity', 0, 2, 0.01)



/*
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.metalness = 0
material.roughness = 1
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
material.transparent= true
material.alphaMap = doorAlphaTexture
*/


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Animate showcase group
    showcaseGroup.rotation.y = elapsedTime * 0.1
    
    // Animate individual objects with unique patterns
    objects.forEach((obj, index) => {
        const speed = 0.5 + index * 0.1
        
        // Different rotation patterns for each object
        if (index === 0) { // Holographic sphere
            obj.rotation.y = elapsedTime * speed
            obj.rotation.x = elapsedTime * speed * 0.5
            obj.position.y = 1 + Math.sin(elapsedTime * 2) * 0.1
        } else if (index === 1) { // Liquid metal torus
            obj.rotation.y = elapsedTime * speed * 0.8
            obj.rotation.x = elapsedTime * speed * 1.2
        } else if (index === 2) { // Energy crystal
            obj.rotation.y = elapsedTime * speed * 1.5
            obj.rotation.x = elapsedTime * speed * 0.3
            obj.rotation.z = elapsedTime * speed * 0.7
        } else if (index === 3) { // Carbon fiber box
            obj.rotation.y = elapsedTime * speed * 0.6
            obj.rotation.x = elapsedTime * speed * 0.9
        } else if (index === 4) { // Neon glass cone
            obj.rotation.y = elapsedTime * speed * 1.1
            obj.rotation.x = elapsedTime * speed * 0.4
        } else if (index === 5) { // Plasma tetrahedron
            obj.rotation.y = elapsedTime * speed * 0.7
            obj.rotation.x = elapsedTime * speed * 1.3
            obj.rotation.z = elapsedTime * speed * 0.5
            obj.position.y = -1 + Math.sin(elapsedTime * 3) * 0.15
        }
    })
    
    // Animate lights
    pointLight1.position.x = -3 + Math.sin(elapsedTime * 0.5) * 1
    pointLight1.position.z = 3 + Math.cos(elapsedTime * 0.5) * 1
    
    pointLight2.position.x = 3 + Math.sin(elapsedTime * 0.3) * 0.5
    pointLight2.position.z = -3 + Math.cos(elapsedTime * 0.3) * 0.5
    
    pointLight3.position.y = 3 + Math.sin(elapsedTime * 0.7) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


