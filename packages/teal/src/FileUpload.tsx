import { useRef, useState, type DragEvent, type ReactNode } from 'react'
import { File as FileIcon, Upload, X } from 'lucide-react'
import { Button, IconButton } from './Button'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface FileUploadFile {
  /** Display name of the file. */
  name: string
  /** Size in bytes, formatted for display. */
  size: number
}

export interface FileUploadProps {
  'aria-describedby'?: string
  /** Marks the control invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Comma-separated list of accepted file types, forwarded to the file input. */
  accept?: string
  className?: string
  /** Supporting text rendered below the dropzone. */
  description?: ReactNode
  /** Prevents adding or removing files. */
  disabled?: boolean
  /** Visible label rendered above the dropzone. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Allows selecting more than one file at a time. */
  multiple?: boolean
  /** Called with the raw File objects each time files are added. */
  onFilesAdded?: (files: File[]) => void
  /** Called with the next file list whenever files are added or removed. */
  onValueChange?: (files: FileUploadFile[]) => void
  /** Marks the control as required. */
  required?: boolean
  /** Controlled file list. When omitted the component tracks the list internally. */
  value?: FileUploadFile[]
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** A labeled dropzone with a browsable file input and a removable file list. */
export function FileUpload({
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  accept,
  className,
  description,
  disabled = false,
  id,
  label,
  multiple = false,
  onFilesAdded,
  onValueChange,
  required,
  value,
}: FileUploadProps) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-file-upload',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)

  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [internalFiles, setInternalFiles] = useState<FileUploadFile[]>([])
  const files = value ?? internalFiles

  function commitFiles(next: FileUploadFile[], added?: File[]) {
    if (value === undefined) setInternalFiles(next)
    onValueChange?.(next)
    if (added && added.length > 0) onFilesAdded?.(added)
  }

  function addFiles(fileList: FileList | File[] | null) {
    if (disabled || !fileList) return
    const added = Array.from(fileList)
    if (added.length === 0) return
    const mapped = added.map((file) => ({ name: file.name, size: file.size }))
    commitFiles(multiple ? [...files, ...mapped] : mapped.slice(0, 1), added)
  }

  function removeFile(index: number) {
    if (disabled) return
    commitFiles(files.filter((_, fileIndex) => fileIndex !== index))
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (!disabled) setDragOver(true)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {showLabel ? (
        <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'teal-u-grid teal-u-justify-items-center teal-u-gap-2 teal-u-rounded-2xl teal-u-border-2 teal-u-border-dashed teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6 teal-u-text-center teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
          dragOver && 'teal-u-border-primary teal-u-bg-primary/5',
          disabled && 'teal-u-opacity-55',
        )}
      >
        <Upload aria-hidden="true" className="teal-u-size-[var(--teal-icon-lg)] teal-u-text-on-surface-variant" />
        <p className="teal-u-text-sm teal-u-text-on-surface-variant">Drag files here or browse</p>
        <input
          ref={inputRef}
          id={semantics.controlId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={semantics.required}
          aria-invalid={invalid}
          aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
          className="teal-u-sr-only"
          tabIndex={-1}
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Browse
        </Button>
      </div>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
      {files.length > 0 ? (
        <ul className="teal-u-grid teal-u-gap-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="teal-u-flex teal-u-items-center teal-u-gap-3 teal-u-rounded-xl teal-u-border teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-px-3 teal-u-py-2"
            >
              <FileIcon aria-hidden="true" className="teal-u-size-[var(--teal-icon-md)] teal-u-shrink-0 teal-u-text-on-surface-variant" />
              <span className="teal-u-min-w-0 teal-u-flex-1 teal-u-truncate teal-u-text-sm teal-u-text-on-surface">{file.name}</span>
              <span className="teal-u-shrink-0 teal-u-text-xs teal-u-tabular-nums teal-u-text-on-surface-variant">{formatSize(file.size)}</span>
              <IconButton
                label={`Remove ${file.name}`}
                size="sm"
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <X aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
