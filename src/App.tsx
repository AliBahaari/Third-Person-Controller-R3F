import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Scene from "./components/Scene";
import { KeyboardControls } from "@react-three/drei";

function App() {
  return (
    <Canvas>
      <KeyboardControls
        map={[
          { name: "Forward", keys: ["KeyW", "ArrowUp"] },
          { name: "Backward", keys: ["KeyS", "ArrowDown"] },
          { name: "Rightward", keys: ["KeyD", "ArrowRight"] },
          { name: "Leftward", keys: ["KeyA", "ArrowLeft"] },
          { name: "Jump", keys: ["Space"] },
          { name: "Speed", keys: ["ShiftLeft", "ShiftRight"] },
        ]}
      >
        <ambientLight intensity={1} />
        <directionalLight intensity={2} position={[0, 10, 0]} />

        <Physics>
          <Scene />
        </Physics>
      </KeyboardControls>
    </Canvas>
  );
}

export default App;
