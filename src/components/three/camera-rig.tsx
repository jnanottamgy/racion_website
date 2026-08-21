"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BEATS, beatStops, damp, sceneState, smoother } from "@/lib/scene-state";
import { exposeDebug } from "@/lib/debug";

interface Shot {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  /** Shot's X is an offset from the nailing tool rather than world space. */
  followsNail?: boolean;
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
  // The finished court as an object in a dark room. No rig yet — this is a
  // staged light, and the room stays a room.
  hero: { pos: [13.6, 4.4, 12.2], target: [0, 0.1, 0], fov: 39 },
  // Down at slab level once the court has stripped itself back.
  base: { pos: [6.4, 2.3, 5.2], target: [-0.3, -0.14, 0], fov: 40 },
  // Over the grid as the first direction of pine lands.
  framework: { pos: [3.5, 2.9, 3.0], target: [0, -0.07, 0], fov: 36 },
  // Pushed in on the crossings, where the half laps seat into one another.
  // Steep rather than shallow: near the floor at a shallow angle the camera
  // sees nine metres of receding grid, which reads as a wide shot no matter how
  // close it actually is. Height is what makes a close-up close.
  interlock: { pos: [1.3, 1.2, 1.1], target: [0, -0.069, 0], fov: 34 },
  // Low and along the framework, following the nailing pass.
  // Relative to the tool: the X of this shot is added to wherever the pass
  // has reached, so the camera travels with the machine.
  nailing: { pos: [1.5, 0.8, 1.35], target: [-0.6, -0.06, 0], fov: 39, followsNail: true },
  // --- The closing arc ------------------------------------------------------
  // These four shots stay on one side of the court and move monotonically out.
  // The lighting shot used to sit at x = -9.8 between two shots at +7.6 and
  // +14.6, so the camera whipped seventeen metres across the hall and
  // twenty-four back, in consecutive segments, while the rig was igniting.
  // Nothing was wrong with the easing — the shots themselves were the break.
  // Now it is one move: pull back, drop and look up as the fixtures strike,
  // then rise and keep pulling away.

  // Back out as plywood and teak arrive over the completed frame.
  decking: { pos: [7.6, 3.2, 6.1], target: [0, 0.05, 0], fov: 37 },
  // Looks up at the rig by raising the *target*, not by dropping the camera.
  // Moving the camera to floor level to get the angle put four-fifths of the
  // frame on empty ceiling; tilting from the same arc keeps the court in shot
  // and lets both fixture rows recede down the hall.
  lighting: { pos: [10.8, 3.0, 6.8], target: [-1.5, 3.9, 0], fov: 46 },
  // Rises to the finished court, lit. The shot that goes on a hoarding.
  court: { pos: [12.8, 8.4, 12.2], target: [0, 0.3, 0], fov: 35 },
  // Keeps pulling away, so the numbers on the page carry the section.
  proof: { pos: [16.8, 9.6, 15.2], target: [0, 0, 0], fov: 31 },
};

const ORDER = BEATS.map((b) => SHOTS[b]);

/** Higher = the camera settles onto its shot sooner after a scroll. */
const CAMERA_LAMBDA = 9;

/** Proportion of each segment spent moving; the rest is held on the shot. */
const MOVE_WINDOW = 0.62;
const MOVE_START = (1 - MOVE_WINDOW) / 2;

const posA = new THREE.Vector3();
const posB = new THREE.Vector3();
const tgtA = new THREE.Vector3();
const tgtB = new THREE.Vector3();
const desiredPos = new THREE.Vector3();
const desiredTarget = new THREE.Vector3();

function useDebugSurface(camera: THREE.PerspectiveCamera) {
  useEffect(
    () =>
      exposeDebug({
        camera: {
          get: () => ({
            pos: camera.position.toArray().map((n) => +n.toFixed(3)),
            fov: +camera.fov.toFixed(2),
          }),
          configurable: true,
        },
        state: { get: () => ({ ...sceneState }), configurable: true },
        stops: { get: () => [...beatStops], configurable: true },
      }),
    [camera],
  );
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useDebugSurface(camera);
  const target = useRef(new THREE.Vector3(0, 0.15, 0));
  const initialised = useRef(false);

  const segments = useMemo(() => ORDER.length - 1, []);

  useFrame((_, delta) => {
    // Clamped at 10fps rather than 20. The clamp exists to stop a tab regaining
    // focus from teleporting the camera, but setting it too tight means every
    // device below the clamp eases in slow motion — the camera lags a beat or
    // two behind the copy, which is the one thing this rig must never do.
    const dt = Math.min(delta, 1 / 10);

    const p = THREE.MathUtils.clamp(sceneState.progress, 0, 1);

    // Find which pair of measured stops we're between. Eight stops is not
    // worth a binary search, and a linear scan is immune to a stale sort.
    let i = 0;
    while (i < segments - 1 && p >= beatStops[i + 1]) i++;

    const span = Math.max(1e-4, beatStops[i + 1] - beatStops[i]);
    const local = THREE.MathUtils.clamp((p - beatStops[i]) / span, 0, 1);

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

    // Blend in the tool's position for whichever end of this segment tracks it,
    // so the camera arrives travelling with the machine rather than cutting to
    // it.
    const follow = (a.followsNail ? 1 - t : 0) + (b.followsNail ? t : 0);
    if (follow > 0) {
      desiredPos.x += sceneState.nailX * follow;
      desiredTarget.x += sceneState.nailX * follow;
    }

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
      camera.position.x = damp(camera.position.x, desiredPos.x, CAMERA_LAMBDA, dt);
      camera.position.y = damp(camera.position.y, desiredPos.y, CAMERA_LAMBDA, dt);
      camera.position.z = damp(camera.position.z, desiredPos.z, CAMERA_LAMBDA, dt);

      target.current.x = damp(target.current.x, desiredTarget.x, CAMERA_LAMBDA, dt);
      target.current.y = damp(target.current.y, desiredTarget.y, CAMERA_LAMBDA, dt);
      target.current.z = damp(target.current.z, desiredTarget.z, CAMERA_LAMBDA, dt);
    }

    const fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = damp(camera.fov, fov, CAMERA_LAMBDA, dt);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(target.current);
  });

  return null;
}

export { SHOTS };
