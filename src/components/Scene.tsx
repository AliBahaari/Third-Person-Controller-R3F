import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const characterRef = useRef<RapierRigidBody | null>(null);
  const smoothedCharacterTranslationRef = useRef(new THREE.Vector3());
  const smoothedCharacterRotationRef = useRef(new THREE.Quaternion());
  const towardAngleRef = useRef(0);

  useFrame((state) => {
    if (
      !characterRef.current ||
      !smoothedCharacterTranslationRef.current ||
      !smoothedCharacterRotationRef.current
    )
      return;
    const character = characterRef.current;
    const smoothedCharacterTranslations =
      smoothedCharacterTranslationRef.current;
    const smoothedCharacterRotation = smoothedCharacterRotationRef.current;

    const { Forward, Rightward, Backward, Leftward, Speed } = getKeys();

    if (Rightward) {
      towardAngleRef.current -= Math.PI / 20;
    } else if (Leftward) {
      towardAngleRef.current += Math.PI / 20;
    }
    character.setRotation(
      new THREE.Quaternion().setFromAxisAngle(
        { x: 0, y: 1, z: 0 },
        towardAngleRef.current,
      ),
      true,
    );

    const displacementDirection = new THREE.Vector3(0, 0, 0);
    displacementDirection.add({
      x: 0,
      y: 0,
      z: Forward ? (Speed ? -10 : -5) : Backward ? (Speed ? 10 : 5) : 0,
    });
    displacementDirection.applyAxisAngle(
      { x: 0, y: 1, z: 0 },
      towardAngleRef.current,
    );
    character.setLinvel(
      {
        x: displacementDirection.x,
        y: character.linvel().y,
        z: displacementDirection.z,
      },
      true,
    );

    smoothedCharacterTranslations.lerp(character.translation(), 0.1);

    const characterRotation = character.rotation();
    smoothedCharacterRotation.slerp(
      new THREE.Quaternion(
        characterRotation.x,
        characterRotation.y,
        characterRotation.z,
        characterRotation.w,
      ),
      0.1,
    );

    const cameraOffset = new THREE.Vector3(0, 4, 6);
    cameraOffset.applyQuaternion(smoothedCharacterRotation);
    cameraOffset.add(smoothedCharacterTranslations);
    state.camera.position.copy(cameraOffset);

    state.camera.lookAt(
      smoothedCharacterTranslations.x,
      smoothedCharacterTranslations.y,
      smoothedCharacterTranslations.z,
    );
  });

  useEffect(() => {
    const unsubscribeJumpKey = subscribeKeys(
      (state) => state.Jump,
      (isPressed) => {
        if (isPressed) {
          if (!characterRef.current) return;

          const character = characterRef.current;
          const currentVelocity = character.linvel();
          character.setLinvel(
            {
              x: currentVelocity.x,
              y: 5,
              z: currentVelocity.z,
            },
            true,
          );
        }
      },
    );

    return () => {
      unsubscribeJumpKey();
    };
  }, []);

  return (
    <>
      <RigidBody ref={characterRef} position={[0, 1, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={"#FFC857"} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[20, 20, 20]} />
          <meshStandardMaterial color={"#101010"} />
        </mesh>
      </RigidBody>
    </>
  );
}
