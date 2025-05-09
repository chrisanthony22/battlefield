import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
} from "@react-three/drei";

function AnimatedModel() {
  const group = useRef();
  const { scene, animations } = useGLTF("/model/layla.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  // Adjust scale and position depending on screen size
  const isMobile = window.innerWidth <= 768;
  const scale = isMobile ? 2.5 : 1.5;
  const positionY = isMobile ? -1.5 : -1;

  return (
    <primitive
      ref={group}
      object={scene}
      scale={scale}
      position={[0, positionY, 0]}
    />
  );
}

export default function ObjViewer() {
  return (
    <div style={{ height: "100vh", background: "#0D1117" }}>
      <Canvas camera={{ position: [0, 1, 6], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <AnimatedModel />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
