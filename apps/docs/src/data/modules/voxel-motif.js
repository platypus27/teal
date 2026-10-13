export default {
  "id": "voxel-motif",
  "name": "Voxel Motif",
  "apiNames": [
    "VoxelMotif"
  ],
  "imports": [
    "VoxelMotif"
  ],
  "description": "A per-product isometric voxel landmark — the product identities of the voxel-world design language — rendered as one scalable SVG.",
  "usage": "<VoxelMotif motif=\"home\" size={96} label=\"Home lighthouse\" />",
  "anatomy": [
    {
      "part": "Ground plate",
      "description": "The grass and sand base every build stands on."
    },
    {
      "part": "Build",
      "description": "The stacked landmark cubes — lighthouse, beacon, chart, tree, windmill, or firefly cluster."
    },
    {
      "part": "Glow",
      "description": "Light cubes rendered with a drop-shadow glow in their own color."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use the motif as the product's identity: rail icon, empty-state illustration, launcher card media.",
      "Provide a label when the motif carries meaning; omit it for purely decorative repeats.",
      "Scale with the size prop; proportions are preserved from the cube bounds."
    ],
    "donts": [
      "Don't recolor or restyle the cubes; the literal voxel colors are the identity on both themes.",
      "Don't invent local motifs; new product landmarks ship through teal."
    ]
  },
  "related": [
    "launcher-card",
    "empty-state",
    "ecosystem-rail"
  ],
  "examples": [
    {
      "title": "Product motifs",
      "description": "The six approved builds: home's lighthouse, both photos candidates, yang's beacon, trict's chart, and twinkle's fireflies."
    },
    {
      "title": "Accessible label",
      "description": "A labelled motif is exposed as an image; unlabelled motifs are hidden from assistive technology."
    }
  ],
  "guidance": {
    "useWhen": "A product identity is needed in the voxel-world language — rails, settings hubs, empty states, launcher cards.",
    "avoidWhen": "A generic glyph is enough; use an icon instead of borrowing another product's landmark.",
    "behavior": "Static SVG rendering with literal voxel colors that read on both light and dark themes.",
    "responsive": "The motif scales to any width via the size prop; height follows the build's proportions."
  }
}
