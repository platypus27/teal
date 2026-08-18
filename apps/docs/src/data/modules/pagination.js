export default {
  "id": "pagination",
  "name": "Pagination",
  "apiNames": [
    "Pagination"
  ],
  "description": "A controlled page navigator with compact ranges and unavailable directions.",
  "usage": "const [page, setPage] = useState(1)\n\n<Pagination page={page} pageCount={12} onPageChange={setPage} />",
  "anatomy": [
    {
      "part": "Previous and next",
      "description": "Directional controls that disable at the first and last page."
    },
    {
      "part": "Page buttons",
      "description": "Numbered pages; the current one sets aria-current=\"page\"."
    },
    {
      "part": "Ellipsis",
      "description": "Collapsed ranges that keep long page counts compact."
    }
  ],
  "dosDonts": {
    "dos": [
      "Drive it from state with page and onPageChange; it is fully controlled.",
      "Pair it with a result count so the page numbers have context.",
      "Reset to page one when filters or sorting change."
    ],
    "donts": [
      "Don't use it for a linear wizard; use Steps.",
      "Don't paginate content that streams better with infinite scroll.",
      "Don't render it for a single page of results."
    ]
  },
  "related": [
    "table",
    "steps"
  ],
  "examples": [
    {
      "title": "Controlled pages",
      "description": "Pagination is fully controlled through page and onPageChange."
    },
    {
      "title": "Boundary pages",
      "description": "Disable previous and next controls at the collection boundaries."
    }
  ],
  "guidance": {
    "useWhen": "A large collection is split into stable pages.",
    "avoidWhen": "Users need continuous search, sorting, or infinite history.",
    "behavior": "The page is controlled by the consumer and unavailable directions are disabled.",
    "responsive": "Keep controls large enough for touch and preserve the current page label."
  }
}
