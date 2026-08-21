/**
 * React Three Fiber augments React's JSX namespace with every Three.js class,
 * but only inside modules that already import from it. Components that render
 * `<mesh>` or `<instancedMesh>` without importing the library otherwise fail
 * to type-check. This side-effect import loads the augmentation project-wide.
 */
import "@react-three/fiber";
