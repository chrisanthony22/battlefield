import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

// AnimatedModel Component
function AnimatedModel({ modelPath, onAnimationEnd }) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      const action = actions[animations[0].name];
      const duration = animations[0].duration;

      action.reset().play();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      // Use animation duration to schedule the callback
      const timeout = setTimeout(() => {
        onAnimationEnd();
      }, duration * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [actions, animations, modelPath, onAnimationEnd]);

  const isMobile = window.innerWidth <= 768;
  const scale = isMobile ? 2.0 : 2.0;
  const positionY = isMobile ? -1.0 : -1.0;

  return (
    <primitive
      ref={group}
      object={scene}
      scale={scale}
      position={[0, positionY, 0]}
    />
  );
}

// ObjViewer Component
export default function ObjViewer() {
  const models = [
    "/model/layla.glb",
    "/model/rafaela.glb",
    "/model/alice.glb",
    "/model/esmeralda.glb"
  ];

  const [modelPath, setModelPath] = useState(models[0]);
  const [animationKey, setAnimationKey] = useState(0); // Triggers remount

  const onAnimationEnd = () => {
    // Pick a new random model path (excluding the current one)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * models.length);
    } while (models[newIndex] === modelPath);

    setModelPath(models[newIndex]);
    setAnimationKey((prevKey) => prevKey + 1);
  };

  return (
    <div style={{ height: "100vh", background: "#0D1117" }}>
      <Canvas camera={{ position: [0, 1, 6], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 5]} intensity={1} />

        <AnimatedModel
          key={animationKey}
          modelPath={modelPath}
          onAnimationEnd={onAnimationEnd}
        />

        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
