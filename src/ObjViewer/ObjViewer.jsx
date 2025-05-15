import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

// Load & animate individual model
function Model({ path, isActive, onEnd }) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!isActive || !actions || animations.length === 0) return;

    const action = actions[animations[0].name];
    action.reset().play();
    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce, 1);

    const duration = animations[0].duration;

    const timeout = setTimeout(() => {
      onEnd();
    }, duration * 1000);

    return () => {
      action.stop();
      clearTimeout(timeout);
    };
  }, [isActive, actions, animations, onEnd]);

  // Only render the model if active
  return isActive ? (
    <primitive
      ref={group}
      object={scene}
      scale={2}
      position={[0, -0.4, 0]}
      dispose={null}
    />
  ) : null;
}

export default function ObjViewer() {
  const modelPaths = [
    "/model/layla.glb",
    "/model/rafaela.glb",
    "/model/alice.glb",
    "/model/wanwan.glb",
    "/model/freya.glb",
    "/model/esmeralda.glb",
  ];

  const [index, setIndex] = useState(0);

  const nextModel = () => {
    setIndex((prev) => (prev + 1) % modelPaths.length);
  };

  return (
    <div style={{ height: "100vh", background: "#0D1117", position: "relative" }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
  <ambientLight intensity={0.7} />
  <directionalLight position={[2, 2, 5]} intensity={1} />
  <OrbitControls
    enableZoom={false}
    enableRotate={false}
    enablePan={false}
    target={[0, 1, 0]} // Look slightly downward
  />
  <Suspense fallback={null}>
    {modelPaths.map((path, i) => (
      <Model
        key={path}
        path={path}
        isActive={i === index}
        onEnd={nextModel}
      />
    ))}
  </Suspense>
</Canvas>

      <div
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          marginBottom:20,
          color: 'white',
          background: "rgba(0, 0, 0, 0.2)",
          padding: "8px 12px",
          borderRadius: "8px",
          fontfamily: 'Orbitron', 
          fontWeight:200,
          fontSize: "16px",
          boxShadow: "0 -2px 10px rgba(0, 240, 255, 0.2)", // neon glow
        }}
      >
        <p>
        Enter the battlefield. Win. Earn. Repeat. Your legend begins now!</p>
      </div>
      <div
        style={{
          position: "relative",
          bottom: 0,
          width: "100%",
          padding: "15px 0",
          textAlign: "center",
          color: "black",
          fontFamily: "Orbitron",
          fontSize: "12px",
          textShadow: "0 0 3px #00f0ff, 0 0 7px #00f0ff", // Neon glow text
          
          zIndex: 1000,
        }}
      >
        <hr/>
        © 2025 The BattleField — All Rights Reserved
      </div>

    </div>
    
  );
}
