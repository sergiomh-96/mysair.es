"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, useGLTF } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

interface STLViewerProps {
  stlUrl: string
}

function STLModel({ url }: { url: string }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [edgesGeometry, setEdgesGeometry] = useState<THREE.EdgesGeometry | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loader = new STLLoader()
    loader.load(
      url,
      (loadedGeometry) => {
        // Center the geometry
        loadedGeometry.center()
        setGeometry(loadedGeometry)
        
        // Create edges geometry for outline
        const edges = new THREE.EdgesGeometry(loadedGeometry, 30)
        setEdgesGeometry(edges)
      },
      undefined,
      (error) => {
        console.error("[v0] Error loading STL:", error)
        setError("Error al cargar el modelo 3D")
      },
    )
  }, [url])

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  if (!geometry || !edgesGeometry) {
    return null
  }

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#404040" linewidth={0.5} />
      </lineSegments>
    </group>
  )
}

export function STLViewer({ stlUrl }: STLViewerProps) {
  return (
    <Card className="w-full h-[500px] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
          }
        >
          <Stage environment="city" intensity={0.6} shadows="contact">
            <STLModel url={stlUrl} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-600">
        <p className="font-medium">Controles:</p>
        <p>• Clic izquierdo + arrastrar: Rotar</p>
        <p>• Rueda del ratón: Zoom</p>
        <p>• Clic derecho + arrastrar: Desplazar</p>
      </div>
    </Card>
  )
}

function LoadingSpinner() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="text-sm text-gray-600">Cargando modelo 3D...</p>
      </div>
    </div>
  )
}
