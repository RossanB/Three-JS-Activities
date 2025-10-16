import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const diamondGroup = new THREE.Group()
const diamondGeometry = new THREE.OctahedronGeometry(1.2, 0)
const diamondMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 0.1,
    roughness: 0.0,
    transmission: 0.8,
    thickness: 0.8,
    ior: 2.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 3.0,
    transparent: true,
    opacity: 0.9,
    emissive: 0x00ffff,
    emissiveIntensity: 0.8
})

const mainDiamond = new THREE.Mesh(diamondGeometry, diamondMaterial)
diamondGroup.add(mainDiamond)

const outlineGeometry = new THREE.OctahedronGeometry(1.25, 0)
const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
})
const diamondOutline = new THREE.Mesh(outlineGeometry, outlineMaterial)
diamondGroup.add(diamondOutline)

const glowGeometry = new THREE.OctahedronGeometry(1.35, 0)
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
})
const diamondGlow = new THREE.Mesh(glowGeometry, glowMaterial)
diamondGroup.add(diamondGlow)

const facetCount = 8
const facetColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7, 0x00b894]

for (let i = 0; i < facetCount; i++) {
    const facetMaterial = new THREE.MeshPhysicalMaterial({
        color: facetColors[i],
        metalness: 0.2,
        roughness: 0.0,
        transmission: 0.7,
        thickness: 0.6,
        ior: 1.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 0.8,
        emissive: facetColors[i],
        emissiveIntensity: 0.2
    })
    
    const facet = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.3, 0),
        facetMaterial
    )
    
    const angle = (i / facetCount) * Math.PI * 2
    const radius = 3.5
    facet.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius
    )
    
    facet.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    )
    
    diamondGroup.add(facet)
}

scene.add(diamondGroup)

const bubbleGroup = new THREE.Group()

const bubbleColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7, 0x00b894, 0xff9ff3, 0x54a0ff, 0x5f27cd, 0x00d2d3, 0xff9f43, 0x10ac84, 0xee5a24]

const bubbleCount = 8
for (let i = 0; i < bubbleCount; i++) {
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: bubbleColors[i % bubbleColors.length],
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.8,
        thickness: 0.3,
        ior: 1.33,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 0.6,
        emissive: bubbleColors[i % bubbleColors.length],
        emissiveIntensity: 0.1
    })
    
    const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 16, 16),
        bubbleMaterial
    )
    
    const radius = 6 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    bubble.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    )
    
    bubble.userData = {
        originalPosition: bubble.position.clone(),
        floatSpeed: 0.5 + Math.random() * 1,
        floatAmplitude: 0.3 + Math.random() * 0.5,
        rotationSpeed: (Math.random() - 0.5) * 0.02
    }
    
    bubbleGroup.add(bubble)
}

scene.add(bubbleGroup)

const confettiGroup = new THREE.Group()

const confettiCount = 50
const confettiGeometry = new THREE.BufferGeometry()
const confettiPositions = new Float32Array(confettiCount * 3)
const confettiColors = new Float32Array(confettiCount * 3)
const confettiSizes = new Float32Array(confettiCount)
const confettiOpacities = new Float32Array(confettiCount)

const confettiColorsArray = [
    new THREE.Color(0xff6b6b),
    new THREE.Color(0x4ecdc4),
    new THREE.Color(0x45b7d1),
    new THREE.Color(0xf9ca24),
    new THREE.Color(0xf0932b),
    new THREE.Color(0xeb4d4b),
    new THREE.Color(0x6c5ce7),
    new THREE.Color(0x00b894)
]

for (let i = 0; i < confettiCount; i++) {
    const i3 = i * 3
    
    const radius = 8 + Math.random() * 6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    confettiPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    confettiPositions[i3 + 1] = radius * Math.cos(phi)
    confettiPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    
    const color = confettiColorsArray[Math.floor(Math.random() * confettiColorsArray.length)]
    confettiColors[i3] = color.r
    confettiColors[i3 + 1] = color.g
    confettiColors[i3 + 2] = color.b
    
    confettiSizes[i] = 0.05 + Math.random() * 0.1
    confettiOpacities[i] = 0.3 + Math.random() * 0.7
}

confettiGeometry.setAttribute('position', new THREE.BufferAttribute(confettiPositions, 3))
confettiGeometry.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3))
confettiGeometry.setAttribute('size', new THREE.BufferAttribute(confettiSizes, 1))
confettiGeometry.setAttribute('opacity', new THREE.BufferAttribute(confettiOpacities, 1))

const confettiMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
})

const confetti = new THREE.Points(confettiGeometry, confettiMaterial)
confettiGroup.add(confetti)

scene.add(confettiGroup)

const wireGroup = new THREE.Group()

const wireObjects = [
    { geometry: new THREE.BoxGeometry(0.8, 0.8, 0.8), color: 0xff6b6b, position: [-8, 0, 0] },
    { geometry: new THREE.SphereGeometry(0.6, 16, 12), color: 0x4ecdc4, position: [8, 0, 0] },
    { geometry: new THREE.ConeGeometry(0.5, 1.0, 8), color: 0x45b7d1, position: [0, 0, -8] },
    { geometry: new THREE.TorusGeometry(0.4, 0.15, 8, 16), color: 0xf9ca24, position: [0, 0, 8] },
    { geometry: new THREE.OctahedronGeometry(0.6), color: 0xf0932b, position: [0, 6, 0] },
    { geometry: new THREE.TetrahedronGeometry(0.6), color: 0xeb4d4b, position: [0, -6, 0] }
]

wireObjects.forEach((obj, index) => {
    const wireMesh = new THREE.Mesh(
        obj.geometry,
        new THREE.MeshBasicMaterial({ 
            color: obj.color,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        })
    )
    wireMesh.position.set(obj.position[0], obj.position[1], obj.position[2])
    wireMesh.userData = {
        originalPosition: wireMesh.position.clone(),
        rotationSpeed: 0.1 + Math.random() * 0.2,
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatAmplitude: 0.2 + Math.random() * 0.3
    }
    wireGroup.add(wireMesh)
})

scene.add(wireGroup)

const explosionGroup = new THREE.Group()

const explosionGeometry = new THREE.BufferGeometry()
const explosionCount = 80
const explosionPositions = new Float32Array(explosionCount * 3)
const explosionColors = new Float32Array(explosionCount * 3)
const explosionSizes = new Float32Array(explosionCount)
const explosionOpacities = new Float32Array(explosionCount)

for (let i = 0; i < explosionCount; i++) {
    const i3 = i * 3
    
    const radius = Math.random() * 12
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    explosionPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    explosionPositions[i3 + 1] = radius * Math.cos(phi)
    explosionPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    
    const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.7)
    explosionColors[i3] = color.r
    explosionColors[i3 + 1] = color.g
    explosionColors[i3 + 2] = color.b
    
    explosionSizes[i] = Math.random() * 0.05 + 0.02
    explosionOpacities[i] = 0.2 + Math.random() * 0.8
}

explosionGeometry.setAttribute('position', new THREE.BufferAttribute(explosionPositions, 3))
explosionGeometry.setAttribute('color', new THREE.BufferAttribute(explosionColors, 3))
explosionGeometry.setAttribute('size', new THREE.BufferAttribute(explosionSizes, 1))
explosionGeometry.setAttribute('opacity', new THREE.BufferAttribute(explosionOpacities, 1))

const explosionMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
})

const explosionParticles = new THREE.Points(explosionGeometry, explosionMaterial)
explosionGroup.add(explosionParticles)

scene.add(explosionGroup)

const energyGroup = new THREE.Group()

const energyOrbCount = 4
for (let i = 0; i < energyOrbCount; i++) {
    const orbGeometry = new THREE.SphereGeometry(0.2, 16, 16)
    const orbMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / energyOrbCount, 0.8, 0.7),
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    })
    
    const orb = new THREE.Mesh(orbGeometry, orbMaterial)
    
    const angle = (i / energyOrbCount) * Math.PI * 2
    const radius = 10
    orb.position.set(
        Math.cos(angle) * radius,
        Math.sin(i) * 3,
        Math.sin(angle) * radius
    )
    
    orb.userData = {
        originalAngle: angle,
        speed: 0.5 + Math.random() * 0.5,
        amplitude: 1 + Math.random() * 2
    }
    
    energyGroup.add(orb)
}

scene.add(energyGroup)

const laserGroup = new THREE.Group()

const laserCount = 3
for (let i = 0; i < laserCount; i++) {
    const laserGeometry = new THREE.CylinderGeometry(0.02, 0.02, 10, 8)
    const laserMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / laserCount, 1.0, 0.5),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    })
    
    const laser = new THREE.Mesh(laserGeometry, laserMaterial)
    laser.rotation.z = Math.PI / 2
    
    const angle = (i / laserCount) * Math.PI * 2
    laser.position.set(
        Math.cos(angle) * 8,
        0,
        Math.sin(angle) * 8
    )
    
    laser.userData = {
        originalAngle: angle,
        rotationSpeed: 0.3 + Math.random() * 0.2
    }
    
    laserGroup.add(laser)
}

scene.add(laserGroup)

const trailGroup = new THREE.Group()

const trailGeometry = new THREE.BufferGeometry()
const trailCount = 30
const trailPositions = new Float32Array(trailCount * 3)
const trailColors = new Float32Array(trailCount * 3)
const trailOpacities = new Float32Array(trailCount)

for (let i = 0; i < trailCount; i++) {
    const i3 = i * 3
    
    const t = (i / trailCount) * Math.PI * 4
    const radius = 3 + Math.sin(t * 2) * 1
    trailPositions[i3] = Math.cos(t) * radius
    trailPositions[i3 + 1] = t * 0.5 - 5
    trailPositions[i3 + 2] = Math.sin(t) * radius
    
    const hue = (i / trailCount) * 0.8
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    trailColors[i3] = color.r
    trailColors[i3 + 1] = color.g
    trailColors[i3 + 2] = color.b
    
    trailOpacities[i] = 0.4 + Math.random() * 0.6
}

trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
trailGeometry.setAttribute('opacity', new THREE.BufferAttribute(trailOpacities, 1))

const trailMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
})

const trailParticles = new THREE.Points(trailGeometry, trailMaterial)
trailGroup.add(trailParticles)

scene.add(trailGroup)

const crystalGroup = new THREE.Group()

const crystalCount = 6
for (let i = 0; i < crystalCount; i++) {
    const crystalGeometry = new THREE.OctahedronGeometry(0.15, 0)
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(i / crystalCount, 0.8, 0.7),
        metalness: 0.3,
        roughness: 0.1,
        transmission: 0.6,
        thickness: 0.3,
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color().setHSL(i / crystalCount, 0.8, 0.3),
        emissiveIntensity: 0.5
    })
    
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial)
    
    const angle = (i / crystalCount) * Math.PI * 2
    const radius = 12 + Math.random() * 3
    crystal.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius
    )
    
    crystal.userData = {
        originalPosition: crystal.position.clone(),
        rotationSpeed: 0.2 + Math.random() * 0.3,
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatAmplitude: 0.5 + Math.random() * 0.5
    }
    
    crystalGroup.add(crystal)
}

scene.add(crystalGroup)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const pointLight1 = new THREE.PointLight(0xff6b6b, 1.5, 20)
pointLight1.position.set(-3, 2, 3)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x4ecdc4, 1.5, 20)
pointLight2.position.set(3, 2, -3)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xf9ca24, 1.0, 15)
pointLight3.position.set(0, 4, 0)
scene.add(pointLight3)

const diamondLight1 = new THREE.PointLight(0x00ffff, 2.0, 10)
diamondLight1.position.set(0, 0, 3)
scene.add(diamondLight1)

const diamondLight2 = new THREE.PointLight(0xffffff, 1.5, 8)
diamondLight2.position.set(0, 0, -3)
scene.add(diamondLight2)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
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

    diamondGroup.rotation.y = elapsedTime * 0.2
    diamondGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1
    
    mainDiamond.rotation.y = elapsedTime * 0.5
    mainDiamond.rotation.x = elapsedTime * 0.3
    
    const hue = (elapsedTime * 0.3) % 1
    const glowPulse = 0.8 + Math.sin(elapsedTime * 2) * 0.3
    mainDiamond.material.color.setHSL(hue, 0.8, 0.7)
    mainDiamond.material.emissive.setHSL(hue, 0.8, 0.2)
    mainDiamond.material.emissiveIntensity = glowPulse
    
    diamondOutline.material.opacity = 0.3 + Math.sin(elapsedTime * 1.5) * 0.2
    diamondGlow.material.opacity = 0.1 + Math.sin(elapsedTime * 2) * 0.1
    diamondGlow.material.color.setHSL(hue, 0.8, 0.5)
    
    diamondGroup.children.slice(1).forEach((facet, index) => {
        const angle = elapsedTime * 0.1 + index
        const radius = 3.5
        facet.position.x = Math.cos(angle) * radius
        facet.position.z = Math.sin(angle) * radius
        facet.rotation.y = elapsedTime * 0.4
        facet.rotation.x = elapsedTime * 0.2
    })

    bubbleGroup.children.forEach((bubble, index) => {
        bubble.position.y += Math.sin(elapsedTime * bubble.userData.floatSpeed + index) * 0.01
        bubble.position.x += Math.cos(elapsedTime * bubble.userData.floatSpeed * 0.7 + index) * 0.005
        bubble.position.z += Math.sin(elapsedTime * bubble.userData.floatSpeed * 0.5 + index) * 0.005
        
        bubble.rotation.x += bubble.userData.rotationSpeed
        bubble.rotation.y += bubble.userData.rotationSpeed * 0.7
        bubble.rotation.z += bubble.userData.rotationSpeed * 0.3
        
        const pulse = 1 + Math.sin(elapsedTime * 1.5 + index) * 0.1
        bubble.scale.setScalar(pulse)
    })

    confetti.rotation.y = elapsedTime * 0.1
    confetti.rotation.x = elapsedTime * 0.05
    
    const positions = confetti.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime * 0.5 + i) * 0.01
        positions[i] += Math.cos(elapsedTime * 0.3 + i) * 0.005
        positions[i + 2] += Math.sin(elapsedTime * 0.4 + i) * 0.005
    }
    confetti.geometry.attributes.position.needsUpdate = true

    wireGroup.children.forEach((wireObj, index) => {
        wireObj.rotation.x = elapsedTime * wireObj.userData.rotationSpeed
        wireObj.rotation.y = elapsedTime * wireObj.userData.rotationSpeed * 0.7
        wireObj.rotation.z = elapsedTime * wireObj.userData.rotationSpeed * 0.3
        
        wireObj.position.y = wireObj.userData.originalPosition.y + 
            Math.sin(elapsedTime * wireObj.userData.floatSpeed + index) * wireObj.userData.floatAmplitude
        wireObj.position.x = wireObj.userData.originalPosition.x + 
            Math.cos(elapsedTime * wireObj.userData.floatSpeed * 0.7 + index) * wireObj.userData.floatAmplitude * 0.5
        wireObj.position.z = wireObj.userData.originalPosition.z + 
            Math.sin(elapsedTime * wireObj.userData.floatSpeed * 0.5 + index) * wireObj.userData.floatAmplitude * 0.5
    })

    // Light animation for diamond sparkle
    pointLight1.position.x = -3 + Math.sin(elapsedTime * 0.4) * 1
    pointLight1.position.z = 3 + Math.cos(elapsedTime * 0.4) * 1
    pointLight2.position.x = 3 + Math.sin(elapsedTime * 0.3) * 1
    pointLight2.position.z = -3 + Math.cos(elapsedTime * 0.3) * 1
    pointLight3.position.y = 4 + Math.sin(elapsedTime * 0.5) * 0.5
    
    // Diamond lights orbit around the diamond
    diamondLight1.position.x = Math.cos(elapsedTime * 0.6) * 2
    diamondLight1.position.z = Math.sin(elapsedTime * 0.6) * 2
    diamondLight1.position.y = Math.sin(elapsedTime * 0.4) * 1
    
    diamondLight2.position.x = Math.cos(elapsedTime * 0.8 + Math.PI) * 2.5
    diamondLight2.position.z = Math.sin(elapsedTime * 0.8 + Math.PI) * 2.5
    diamondLight2.position.y = Math.cos(elapsedTime * 0.3) * 1.5
    
    explosionGroup.rotation.y = elapsedTime * 0.1
    explosionGroup.rotation.x = elapsedTime * 0.05
    
    const explosionPositions = explosionParticles.geometry.attributes.position.array
    for (let i = 0; i < explosionPositions.length; i += 3) {
        explosionPositions[i + 1] += Math.sin(elapsedTime * 0.3 + i) * 0.02
        explosionPositions[i] += Math.cos(elapsedTime * 0.2 + i) * 0.01
        explosionPositions[i + 2] += Math.sin(elapsedTime * 0.25 + i) * 0.01
    }
    explosionParticles.geometry.attributes.position.needsUpdate = true
    
    energyGroup.children.forEach((orb, index) => {
        const angle = orb.userData.originalAngle + elapsedTime * orb.userData.speed
        const radius = 10
        orb.position.x = Math.cos(angle) * radius
        orb.position.z = Math.sin(angle) * radius
        orb.position.y = Math.sin(elapsedTime * 0.8 + index) * orb.userData.amplitude
        
        orb.rotation.x = elapsedTime * 0.5
        orb.rotation.y = elapsedTime * 0.3
        
        const pulse = 1 + Math.sin(elapsedTime * 2 + index) * 0.3
        orb.scale.setScalar(pulse)
    })
    
    laserGroup.children.forEach((laser, index) => {
        laser.rotation.y = elapsedTime * laser.userData.rotationSpeed
        laser.rotation.x = Math.sin(elapsedTime * 0.5 + index) * 0.2
        
        laser.material.opacity = 0.6 + Math.sin(elapsedTime * 3 + index) * 0.3
    })
    
    trailGroup.rotation.y = elapsedTime * 0.2
    trailGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1
    
    const trailPositions = trailParticles.geometry.attributes.position.array
    for (let i = 0; i < trailPositions.length; i += 3) {
        trailPositions[i + 1] += Math.sin(elapsedTime * 0.4 + i) * 0.01
    }
    trailParticles.geometry.attributes.position.needsUpdate = true
    
    crystalGroup.children.forEach((crystal, index) => {
        crystal.rotation.x = elapsedTime * crystal.userData.rotationSpeed
        crystal.rotation.y = elapsedTime * crystal.userData.rotationSpeed * 0.7
        crystal.rotation.z = elapsedTime * crystal.userData.rotationSpeed * 0.3
        
        crystal.position.y = crystal.userData.originalPosition.y + 
            Math.sin(elapsedTime * crystal.userData.floatSpeed + index) * crystal.userData.floatAmplitude
        crystal.position.x = crystal.userData.originalPosition.x + 
            Math.cos(elapsedTime * crystal.userData.floatSpeed * 0.7 + index) * crystal.userData.floatAmplitude * 0.3
        crystal.position.z = crystal.userData.originalPosition.z + 
            Math.sin(elapsedTime * crystal.userData.floatSpeed * 0.5 + index) * crystal.userData.floatAmplitude * 0.3
        
        const glowPulse = 0.5 + Math.sin(elapsedTime * 1.5 + index) * 0.3
        crystal.material.emissiveIntensity = glowPulse
    })

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
