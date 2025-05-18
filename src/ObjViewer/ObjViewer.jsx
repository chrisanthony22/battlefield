import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import './ObjViewer.css';
import LoginForm from "../LoginForm/LoginForm";

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

    const timeout = setTimeout(() => {
      onEnd();
    }, animations[0].duration * 1000);

    return () => {
      action.stop();
      clearTimeout(timeout);
    };
  }, [isActive, actions, animations, onEnd]);

  return isActive ? (
    <primitive ref={group} object={scene} scale={2} position={[0, -0.4, 0]} dispose={null} />
  ) : null;
}

function NewsPage() {
  return (
    <div className="news-page" style={{ color: "white", padding: "20px" }}>
      <h2>Welcome to The Battlefield News!</h2>
      <p>Your latest updates will be shown here.</p>
    </div>
  );
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
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      setLoggedInUser(userData);
    };

    loadUser();
    window.addEventListener("userLoggedIn", loadUser);
    window.addEventListener("userLoggedOut", loadUser);

    return () => {
      window.removeEventListener("userLoggedIn", loadUser);
      window.removeEventListener("userLoggedOut", loadUser);
    };
  }, []);

  const nextModel = () => {
    setIndex((prev) => (prev + 1) % modelPaths.length);
  };

  return (
    <div className="battle-container">
      <div className="canvas-section">
        <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2, 5]} intensity={1} />
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} target={[0, 1, 0]} />
          <Suspense fallback={null}>
            {modelPaths.map((path, i) => (
              <Model key={path} path={path} isActive={i === index} onEnd={nextModel} />
            ))}
          </Suspense>
        </Canvas>
        <div className="viewer-overlay">
          Enter the battlefield. Win. Earn. Repeat. Your legend begins now!
        </div>
      </div>

      <div className="form-section">
        {loggedInUser ? <NewsPage /> : <LoginForm />}
      </div>
    </div>
  );
}
