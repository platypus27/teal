import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar } from "lucide-react";
import { cn } from "./cn";
import {
	addDays,
	addMonths,
	arrowDeltas,
	dateKey,
	startOfDay,
} from "./date-utils";
import { hasFormContent, useFormSemantics } from "./form-semantics";
import { Input } from "./Input";
import { MonthGrid } from "./MonthGrid";

export interface DateRange {
	/** First day of the range, or null when nothing is selected. */
	from: Date | null;
	/** Last day of the range, or null while the end is still being picked. */
	to: Date | null;
}

export interface DateRangePickerProps {
	/** Accessible name when there is no visible label. */
	"aria-label"?: string;
	className?: string;
	/** Initial range when uncontrolled. */
	defaultValue?: DateRange;
	/** Prevents interaction with the input. */
	disabled?: boolean;
	/** Explicit id; otherwise Field or an internal id is used. */
	id?: string;
	/** Disables specific days in the calendar grid. */
	isDateDisabled?: (date: Date) => boolean;
	/** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
	label?: ReactNode;
	/** Called with the range after every selection step. */
	onChange?: (range: DateRange) => void;
	/** Text shown when no range is selected. */
	placeholder?: string;
	/** Controlled range. */
	value?: DateRange;
}

const dayFormatter = new Intl.DateTimeFormat(undefined, {
	month: "short",
	day: "numeric",
});
const dayWithYearFormatter = new Intl.DateTimeFormat(undefined, {
	month: "short",
	day: "numeric",
	year: "numeric",
});

/** "MMM d – MMM d, yyyy", repeating the year on both ends when they differ. */
function formatRange(from: Date, to: Date) {
	const start =
		from.getFullYear() === to.getFullYear()
			? dayFormatter.format(from)
			: dayWithYearFormatter.format(from);
	return `${start} – ${dayWithYearFormatter.format(to)}`;
}

export const DateRangePicker = forwardRef<
	HTMLInputElement,
	DateRangePickerProps
>(function DateRangePicker(
	{
		"aria-label": ariaLabel,
		className,
		defaultValue,
		disabled,
		id,
		isDateDisabled,
		label,
		onChange,
		placeholder = "Pick a date range",
		value,
	},
	ref,
) {
	const semantics = useFormSemantics({ id, prefix: "teal-date-range-picker" });
	const showLabel = hasFormContent(label) && !semantics.labeledByField;
	const calendarId = `${semantics.controlId}-calendar`;

	const [internalValue, setInternalValue] = useState<DateRange>(
		defaultValue ?? { from: null, to: null },
	);
	const selected = value !== undefined ? value : internalValue;

	const [open, setOpen] = useState(false);
	const [viewMonth, setViewMonth] = useState<Date>(
		() => selected.from ?? new Date(),
	);
	const [focusedDate, setFocusedDate] = useState<Date>(
		() => selected.from ?? new Date(),
	);
	const shouldFocusDay = useRef(false);
	const suppressFocusOpen = useRef(false);
	const gridRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	function setInputRef(node: HTMLInputElement | null) {
		inputRef.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
	}

	useEffect(() => {
		if (!open || !shouldFocusDay.current) return;
		shouldFocusDay.current = false;
		// Defer past the pointer interaction that opened the picker; focusing the
		// day synchronously here is overwritten when the input's focus() completes.
		queueMicrotask(() => {
			gridRef.current
				?.querySelector<HTMLButtonElement>(
					`[data-date="${dateKey(focusedDate)}"]`,
				)
				?.focus();
		});
	}, [open, focusedDate, viewMonth]);

	function isDayDisabled(day: Date) {
		return isDateDisabled?.(day) ?? false;
	}

	function commitRange(next: DateRange) {
		if (value === undefined) setInternalValue(next);
		onChange?.(next);
	}

	function openPicker() {
		if (disabled) return;
		const base = selected.from ?? selected.to ?? new Date();
		setViewMonth(addMonths(base, 0));
		setFocusedDate(base);
		shouldFocusDay.current = true;
		setOpen(true);
	}

	function closePicker() {
		setOpen(false);
		suppressFocusOpen.current = true;
		inputRef.current?.focus();
	}

	function selectDay(day: Date) {
		if (isDayDisabled(day)) return;
		const { from, to } = selected;
		// Starting fresh, or clicking before the current start, begins a new range.
		if (from === null || to !== null || day.getTime() < from.getTime()) {
			commitRange({ from: day, to: null });
			return;
		}
		commitRange({ from, to: day });
		closePicker();
	}

	function applyPreset(from: Date, to: Date) {
		commitRange({ from: startOfDay(from), to: startOfDay(to) });
		setViewMonth(addMonths(to, 0));
		closePicker();
	}

	function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const delta = arrowDeltas[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		const next = addDays(focusedDate, delta);
		setFocusedDate(next);
		if (
			next.getMonth() !== viewMonth.getMonth() ||
			next.getFullYear() !== viewMonth.getFullYear()
		) {
			setViewMonth(next);
		}
		shouldFocusDay.current = true;
	}

	const today = new Date();
	const { from, to } = selected;
	const display =
		from !== null && to !== null
			? formatRange(from, to)
			: from !== null
				? `${dayFormatter.format(from)} – `
				: "";

	const presets = [
		{ label: "Today", from: startOfDay(today), to: startOfDay(today) },
		{
			label: "Last 7 days",
			from: addDays(startOfDay(today), -6),
			to: startOfDay(today),
		},
		{
			label: "Last 30 days",
			from: addDays(startOfDay(today), -29),
			to: startOfDay(today),
		},
	];

	return (
		<div className={cn("teal-u-grid teal-u-gap-1.5", className)}>
			{showLabel ? (
				<label
					htmlFor={semantics.controlId}
					className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface"
				>
					{label}
				</label>
			) : null}
			<PopoverPrimitive.Root
				open={open}
				onOpenChange={(nextOpen) => {
					if (nextOpen) openPicker();
					else setOpen(false);
				}}
			>
				<PopoverPrimitive.Anchor asChild>
					<div className="teal-u-relative">
						<Input
							ref={setInputRef}
							id={semantics.controlId}
							aria-label={ariaLabel}
							aria-haspopup="dialog"
							aria-controls={calendarId}
							autoComplete="off"
							disabled={disabled}
							placeholder={placeholder}
							readOnly
							value={display}
							className="teal-u-cursor-pointer teal-u-pr-9"
							onFocus={() => {
								if (suppressFocusOpen.current) {
									suppressFocusOpen.current = false;
									return;
								}
								if (!open) openPicker();
							}}
							onClick={() => {
								if (!open) openPicker();
							}}
							onKeyDown={(event) => {
								if (event.key === "ArrowDown" && !open) {
									event.preventDefault();
									openPicker();
								}
							}}
						/>
						<Calendar
							aria-hidden="true"
							className="teal-u-pointer-events-none teal-u-absolute teal-u-right-3 teal-u-top-1/2 teal-u-size-[var(--teal-icon-sm)] teal-u--translate-y-1/2 teal-u-text-on-surface-variant"
						/>
					</div>
				</PopoverPrimitive.Anchor>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						id={calendarId}
						align="start"
						side="bottom"
						sideOffset={6}
						onOpenAutoFocus={(event) => event.preventDefault()}
						className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-p-3 teal-u-text-on-surface teal-u-outline-none"
					>
						<div className="teal-u-flex teal-u-gap-1.5 teal-u-pb-2">
							{presets.map((preset) => (
								<button
									key={preset.label}
									type="button"
									onClick={() => applyPreset(preset.from, preset.to)}
									className="teal-focus-ring teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-px-2.5 teal-u-py-1 teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface hover:teal-u-bg-surface-container-high"
								>
									{preset.label}
								</button>
							))}
						</div>
						<div ref={gridRef}>
							<MonthGrid
								keyboard
								month={viewMonth}
								onMonthChange={setViewMonth}
								onSelect={selectDay}
								range={{ from, to }}
								focusedDate={focusedDate}
								onFocusDay={setFocusedDate}
								onKeyDown={handleGridKeyDown}
								isDayDisabled={isDayDisabled}
							/>
						</div>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		</div>
	);
});
