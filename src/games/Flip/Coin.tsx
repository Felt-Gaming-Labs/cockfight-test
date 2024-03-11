// src/games/Flip/Coin.tsx

import React, { useEffect, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import { Group } from "three";
import { useFrame } from "@react-three/fiber";

const MODEL_COIN = "/games/flip/Coin.glb";
const TEXTURE_HEADS = "/games/flip/heads.png";
const TEXTURE_TAILS = "/games/flip/tails.png";

function CoinModel() {
  // Use the `useGLTF` and `useTexture` hooks with the paths
  const { nodes } = useGLTF(MODEL_COIN);
  const [heads, tails] = useTexture([TEXTURE_HEADS, TEXTURE_TAILS]);

  return (
    <>
      <primitive object={nodes.Coin} />
      <mesh position-z={0.3}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial transparent map={heads} />
      </mesh>
      <group rotation-y={Math.PI}>
        <mesh position-z={0.3}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshStandardMaterial transparent map={tails} />
        </mesh>
      </group>
    </>
  );
}

interface CoinFlipProps {
  flipping: boolean;
  result: number;
}

export function Coin({ flipping, result }: CoinFlipProps) {
  const group = useRef<Group | null>(null);
  const target = useRef(0);

  useEffect(() => {
    if (!flipping && group.current) {
      const fullTurns = Math.floor(group.current.rotation.y / (Math.PI * 2));
      target.current = (fullTurns + 1) * Math.PI * 2 + result * Math.PI;
    }
  }, [flipping, result]);

  useFrame((state, dt) => {
    if (group.current) {
      if (flipping) {
        group.current.rotation.y += 25 * dt;
      } else {
        const clamp = (value: number, min: number, max: number) =>
          Math.min(Math.max(value, min), max);
        group.current.rotation.y += clamp(
          (target.current - group.current.rotation.y) * 10 * dt,
          0,
          1,
        );
      }
      const scale = flipping ? 1.25 : 1;
      group.current.scale.y += (scale - group.current.scale.y) * 0.1;
      group.current.scale.setScalar(group.current.scale.y);
    }
  });

  return (
    <group ref={group}>
      <CoinModel />
    </group>
  );
}

useGLTF.preload(MODEL_COIN);

export { TEXTURE_HEADS, TEXTURE_TAILS };
