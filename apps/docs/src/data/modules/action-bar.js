export default {
  "id": "action-bar",
  "name": "Action Bar",
  "apiNames": [
    "ActionBar"
  ],
  "description": "A horizontal bar for contextual page-level actions such as a sticky save/cancel bar at the bottom of an editing surface.",
  "usage": "<ActionBar sticky label=\"Edit actions\">\n  <Button variant=\"ghost\">Cancel</Button>\n  <Button variant=\"primary\">Save changes</Button>\n</ActionBar>",
  "anatomy": [
    {
      "part": "Region",
      "description": "The labelled landmark (role=\"region\") wrapping the bar, named by the label prop."
    },
    {
      "part": "Actions",
      "description": "The caller-supplied buttons aligned to the end of the bar."
    },
    {
      "part": "Sticky edge",
      "description": "The optional sticky positioning that pins the bar to the top or bottom of its scroll container."
    }
  ],
  "dosDonts": {
    "dos": [
      "Label the region so multiple landmarks stay distinguishable.",
      "Place the primary commit action last in the bar.",
      "Keep the bar to two or three actions that apply to the whole surface."
    ],
    "donts": [
      "Don't use it for actions scoped to one field or card; place those inline.",
      "Don't stack more than one action bar on a page."
    ]
  },
  "related": [
    "toolbar",
    "bulk-action-bar",
    "page-header"
  ],
  "examples": [
    {
      "title": "Sticky bottom bar",
      "description": "The default bottom-positioned bar stays pinned while the surrounding form scrolls, keeping commit actions reachable."
    },
    {
      "title": "Top bar",
      "description": "Positioned above the content for toolbars whose actions scope everything below them."
    }
  ],
  "guidance": {
    "useWhen": "A page or panel has primary and secondary actions that apply to the whole content, like saving an edited record.",
    "avoidWhen": "Actions belong to a single field or card; place buttons inline or use a ButtonGroup instead.",
    "behavior": "Renders a labelled region with actions aligned to the end; sticky pins it to the configured edge of the scrolling container.",
    "responsive": "The bar stretches full width and lets its actions wrap or shrink; keep the action set small on narrow screens."
  }
}
