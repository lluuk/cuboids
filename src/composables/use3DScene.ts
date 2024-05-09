import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { reactive, ref, watch, type Ref } from 'vue'
import { randomHexColor } from '@/lib/utils'

type CuboidPoints = {
  x: THREE.Vector3 | null
  y: THREE.Vector3 | null
  z: THREE.Vector3 | null
}

const PCD_URL =
  'https://segmentsai-prod.s3.eu-west-2.amazonaws.com/assets/admin-tobias/41089c53-efca-4634-a92a-0c4143092374.pcd'

const SIDE_PANEL_WIDTH = 300

const container: Ref<HTMLDivElement | null> = ref(null)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth - SIDE_PANEL_WIDTH) / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
const controls: OrbitControls = new OrbitControls(camera, renderer.domElement)

const cuboids: Ref<THREE.Mesh[]> = ref([])
const newCuboidPoints = reactive<CuboidPoints>({
  x: null,
  y: null,
  z: null
})

const isCreateCuboidModeActivated = ref(false)

const selectedPoints: THREE.Mesh[] = []

const isWebGLSupported = WebGL.isWebGLAvailable()
const webGLErrorMessage = WebGL.getWebGLErrorMessage()

export const use3DScene = () => {
  const updateCuboidByIndex = (index: number, updatedCuboid: THREE.Mesh) => {
    cuboids.value[index] = updatedCuboid
  }

  const setCreateCuboidMode = (mode: boolean) => {
    isCreateCuboidModeActivated.value = mode
  }

  const initSceneSizeAndPosition = () => {
    camera.position.set(0, 0, 10)
    scene.add(camera)
    renderer.setSize(window.innerWidth - SIDE_PANEL_WIDTH, window.innerHeight)
    container.value?.appendChild(renderer.domElement)
  }

  const loadPointCloud = () => {
    // Load point cloud
    const loader = new PCDLoader()
    loader.load(PCD_URL, function (points) {
      scene.add(points)
    })
  }

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  const init = () => {
    initSceneSizeAndPosition()
    loadPointCloud()
    animate()
  }

  const resetCameraPosition = () => {
    camera.position.set(0, 0, 10)
  }

  const addPointToScene = (position: THREE.Vector3) => {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const point = new THREE.Mesh(geometry, material)
    point.position.copy(position)
    scene.add(point)
    selectedPoints.push(point)
  }

  const clearSelectedPoints = () => {
    selectedPoints.forEach((point) => {
      scene.remove(point)
    })
  }

  const createCuboid = (x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3) => {
    const size = new THREE.Vector3()
    size.subVectors(y, x)
    const position = new THREE.Vector3()
    position.addVectors(x, y).multiplyScalar(0.5)

    const xAxisVector = new THREE.Vector3().subVectors(y, x).normalize()
    const yAxisVector = new THREE.Vector3().subVectors(z, x).normalize()
    const zAxisVector = new THREE.Vector3().subVectors(z, y).normalize()

    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeBasis(xAxisVector, yAxisVector, zAxisVector)
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix)

    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
    const cuboidMaterial = new THREE.MeshBasicMaterial({ color: randomHexColor(), wireframe: true })
    const cuboid = new THREE.Mesh(geometry, cuboidMaterial)
    cuboid.position.copy(position)
    cuboid.quaternion.copy(quaternion)

    scene.add(cuboid)
    cuboids.value.push(cuboid)
  }

  const resetCurrentCuboidPoints = () => {
    newCuboidPoints.x = null
    newCuboidPoints.y = null
    newCuboidPoints.z = null
  }

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth - SIDE_PANEL_WIDTH, window.innerHeight)
  }

  const onRendererClick = (event: MouseEvent) => {
    if (!isCreateCuboidModeActivated.value) return

    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      // console.log('Intersection point:', intersects[0].point)

      // // Create a sphere at the intersection point for visualization
      // const intersectionSphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(0.1, 16, 16),
      //   new THREE.MeshBasicMaterial({ color: 0xff0000 })
      // )
      // intersectionSphere.position.copy(intersects[0].point)
      // scene.add(intersectionSphere)

      const point = intersects[0].point
      addPointToScene(point)
      if (!newCuboidPoints.x) {
        newCuboidPoints.x = point
      } else if (!newCuboidPoints.y) {
        newCuboidPoints.y = point
      } else if (!newCuboidPoints.z) {
        newCuboidPoints.z = point
        createCuboid(newCuboidPoints.x, newCuboidPoints.y, newCuboidPoints.z)
        clearSelectedPoints()
        setCreateCuboidMode(false)
        // Reset points for next cuboid creation
        resetCurrentCuboidPoints()
      }
    }
  }

  watch(
    () => isCreateCuboidModeActivated.value,
    () => {
      controls.enableRotate = !isCreateCuboidModeActivated.value
    }
  )

  return {
    container,
    cuboids,
    isCreateCuboidModeActivated,
    setCreateCuboidMode,
    renderer,
    isWebGLSupported,
    webGLErrorMessage,
    init,
    resetCameraPosition,
    onResize,
    onRendererClick,
    updateCuboidByIndex,
    newCuboidPoints
  }
}
