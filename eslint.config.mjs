import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    /**
     * The WebGL scene is driven imperatively, by design.
     *
     * `react-hooks/immutability` models React render semantics, but everything
     * under `three/` runs inside react-three-fiber's `useFrame` — an animation
     * loop that executes outside render, sixty times a second, and mutates
     * cameras, materials and object transforms in place. That is not a
     * workaround; it is how the library is meant to be driven, and routing
     * per-frame updates through React state is precisely what this scene must
     * not do.
     *
     * Scoped to the 3D directory so the rule keeps protecting the rest of the
     * application, where it is entirely correct.
     */
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
]);

export default eslintConfig;
