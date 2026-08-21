"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BEATS, damp, sceneState, smoother } from "@/lib/scene-state";

interface Shot {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * One camera position per beat of the narrative.
 *
 * These are shots, not waypoints — each is framed to be held and looked at
 * while the copy beside it is read, which is why the rig eases hold → move →
 * hold within every segment rather than drifting continuously. A camera that
 * never settles gives the viewer nothing to actually look at.
 */
const SHOTS: Record<(typeof BEATS)[number], Shot> = {
  // Wide and low. The court is an object in a dark room, not a place yet.
  hero: { pos: [14.5, 3.0, 11.5], target: [0, 0.15, 0], fov: 38 },
  // Down onto the boards, grazing, so the grain and the sheen do the talking.
  descent: { pos: [4.6, 0.19, 1.7], target: [-7, 0.02, -0.5], fov: 34 },
  // Back and side-on: the only angle where a six-layer stack reads as six.
  exploded: { pos: [10.8, 2.6, 8.2], target: [0, 1.1, 0], fov: 33 },
  // Inside a plank joint. Hidden nailing through the tongue, life-size.
  joint: { pos: [0.46, 0.1, 0.3], target: [0, -0.01, 0], fov: 30 },
  // Looking up the hall as the rig strikes.
  lighting: { pos: [-11.5, 1.9, 5.4], target: [2.5, 4.6, 0], fov: 45 },
  // The finished court, lit. The shot the client puts on a hoarding.
  court: { pos: [12.8, 6.6, 10.8], target: [0, 0.5, 0], fov: 36 },
  // Front-on and level — the configurator needs a readable, unbiased view.
  configurator: { pos: [0.01, 5.4, 15.5], target: [0, 0.3, 0], fov: 34 },
  // Pulled away and dimmed, so the numbers on the page carry the section.
  proof: { pos: [17, 8.4, 14.5], target: [0, 0, 0], fov: 30 },
};

const ORDER = BEATS.map((b) => SHOTS[b]);

/** Proportion of each segment spent moving; the rest is held on the shot. */
const MOVE_WINDOW = 0.62;
const MOVE_START = (1 - MOVE_WINDOW) / 2;

const posA = new THREE.Vector3();
const posB = new THREE.Vector3();
const tgtA = new THREE.Vector3();
const tgtB = new THREE.Vector3();
const desiredPos = new THREE.Vector3();
const desiredTarget = new THREE.Vector3();

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const target = useRef(new THREE.Vector3(0, 0.15, 0));
  const initialised = useRef(false);

  const segments = useMemo(() => ORDER.length - 1, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);

    const f = THREE.MathUtils.clamp(sceneState.progress, 0, 1) * segments;
    const i = Math.min(Math.floor(f), segments - 1);
    const local = f - i;

    // Hold, move, hold. The shot arrives before the copy does and stays put
    // while it's being read.
    const t = smoother(
      THREE.MathUtils.clamp((local - MOVE_START) / MOVE_WINDOW, 0, 1),
    );

    const a = ORDER[i];
    const b = ORDER[i + 1];

    posA.fromArray(a.pos);
    posB.fromArray(b.pos);
    tgtA.fromArray(a.target);
    tgtB.fromArray(b.target);

    desiredPos.lerpVectors(posA, posB, t);
    desiredTarget.lerpVectors(tgtA, tgtB, t);

    // Pointer parallax scaled by how far the camera is from what it's looking
    // at — a fixed offset that reads as a gentle drift in a wide shot throws
    // the framing completely inside a plank joint.
    const reach = desiredPos.distanceTo(desiredTarget);
    const sway = THREE.MathUtils.clamp(reach * 0.018, 0.004, 0.42);
    desiredPos.x += sceneState.pointer.x * sway;
    desiredPos.y += sceneState.pointer.y * sway * 0.6;

    if (!initialised.current) {
      camera.position.copy(desiredPos);
      target.current.copy(desiredTarget);
      initialised.current = true;
    } else {
      // Damped rather than snapped: scroll arrives in discrete jumps and the
      // camera should not inherit that texture.
      camera.position.x = damp(camera.position.x, desiredPos.x, 6.5, dt);
      camera.position.y = damp(camera.position.y, desiredPos.y, 6.5, dt);
      camera.position.z = damp(camera.position.z, desiredPos.z, 6.5, dt);

      target.current.x = damp(target.current.x, desiredTarget.x, 6.5, dt);
      target.current.y = damp(target.current.y, desiredTarget.y, 6.5, dt);
      target.current.z = damp(target.current.z, desiredTarget.z, 6.5, dt);
    }

    const fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = damp(camera.fov, fov, 6.5, dt);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(target.current);
  });

  return null;
}

export { SHOTS };
