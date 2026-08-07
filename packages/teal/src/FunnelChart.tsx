import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface FunnelStage {
  /** Stage name rendered inside the band. */
  name: string
  /** Stage value; typically non-increasing down the funnel. */
  value: number
}

export interface FunnelChartProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the funnel, applied as aria-label. */
  'aria-label': string
  /** Stages from top (widest) to bottom. */
  stages: FunnelStage[]
  /** SVG width in pixels. */
  width?: number
  /** SVG height in pixels. */
  height?: number
  /** Shows the stage-to-stage conversion percentage next to each junction. */
  showPercentages?: boolean
}

const FILL = 'var(--teal-color-primary)'
const LABEL_COLOR = 'var(--teal-color-on-primary)'
const TEXT_COLOR = 'var(--teal-color-on-surface-variant)'

const STAGE_GAP = 6
const MIN_WIDTH_RATIO = 0.08

export const FunnelChart = forwardRef<SVGSVGElement, FunnelChartProps>(function FunnelChart(
  { 'aria-label': ariaLabel, className, stages, width = 320, height = 240, showPercentages = true, ...props },
  ref,
) {
  const maxValue = stages.length > 0 ? Math.max(...stages.map((stage) => stage.value), 1) : 1
  const bandHeight = stages.length > 0 ? (height - STAGE_GAP * (stages.length - 1)) / stages.length : 0
  const centerX = width / 2

  function widthOf(value: number) {
    const ratio = Math.max(value / maxValue, 0)
    return Math.max(ratio, MIN_WIDTH_RATIO) * width
  }

  const summary =
    stages.length === 0
      ? 'No stages'
      : stages
          .map((stage, index) => {
            const previous = stages[index - 1]
            const conversion =
              previous && previous.value > 0
                ? `, ${Math.round((stage.value / previous.value) * 100)}% of previous`
                : ''
            return `${stage.name}: ${stage.value}${conversion}`
          })
          .join('; ')

  return (
    <>
      <svg
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn('teal-u-block', className)}
        {...props}
      >
        {stages.map((stage, index) => {
          const top = index * (bandHeight + STAGE_GAP)
          const topWidth = widthOf(stage.value)
          const next = stages[index + 1]
          const bottomWidth = next ? widthOf(next.value) : topWidth * 0.7
          const points = [
            `${centerX - topWidth / 2},${top}`,
            `${centerX + topWidth / 2},${top}`,
            `${centerX + bottomWidth / 2},${top + bandHeight}`,
            `${centerX - bottomWidth / 2},${top + bandHeight}`,
          ].join(' ')
          const conversion =
            next && stage.value > 0 ? Math.round((next.value / stage.value) * 100) : undefined

          return (
            <g key={index}>
              <polygon points={points} fill={FILL} fillOpacity={1 - index * (0.6 / Math.max(stages.length, 1))}>
                <title>{`${stage.name}: ${stage.value}`}</title>
              </polygon>
              <text
                x={centerX}
                y={top + bandHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill={LABEL_COLOR}
              >
                {`${stage.name} · ${stage.value}`}
              </text>
              {showPercentages && conversion !== undefined ? (
                <text
                  x={width - 4}
                  y={top + bandHeight + STAGE_GAP / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill={TEXT_COLOR}
                >
                  {`${conversion}%`}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
