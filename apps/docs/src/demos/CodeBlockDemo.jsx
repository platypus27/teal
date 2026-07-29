import { CodeBlock } from '@kryv/teal'

export function CodeBlockDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-lg">
        <CodeBlock
          language="tsx"
          showLineNumbers
          code={`import { Button } from '@kryv/teal'\n\nexport function SaveAction() {\n  return <Button variant="primary">Save changes</Button>\n}`}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <CodeBlock
        language="bash"
        code={`npm install @kryv/teal\nnpm run dev`}
      />
    </div>
  )
}
