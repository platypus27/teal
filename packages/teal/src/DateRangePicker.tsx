import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./Button";
import { cn } from "./cn";
import { hasFormContent, useFormSemantics } from "./form-semantics";
import { Input } from "./Input";

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

function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function addDays(date: Date, amount: number) {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}

function addMonths(date: Date, amount: number) {
	return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function dateKey(date: Date) {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Six weeks covering the visible month, starting on Sunday. */
function getMonthGrid(month: Date) {
	const first = new Date(month.getFullYear(), month.getMonth(), 1);
	const start = addDays(first, -first.getDay());
	return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
	weekday: "narrow",
});
const monthFormatter = new Intl.DateTimeFormat(undefined, {
	month: "long",
	year: "numeric",
});
const dayFormatter = new Intl.DateTimeFormat(undefined, {
	month: "short",
	day: "numeric",
});
const dayWithYearFormatter = new Intl.DateTimeFormat(undefined, {
	month: "short",
	day: "numeric",
	year: "numeric",
});
// 2024-01-07 is a Sunday, so this yields locale weekday names starting Sunday.
const weekdayNames = Array.from({ length: 7 }, (_, index) =>
	weekdayFormatter.format(addDays(new Date(2024, 0, 7), index)),
);

/** "MMM d – MMM d, yyyy", repeating the year on both ends when they differ. */
function formatRange(from: Date, to: Date) {
	const start =
		from.getFullYear() === to.getFullYear()
			? dayFormatter.format(from)
			: dayWithYearFormatter.format(from);
	return `${start} – ${dayWithYearFormatter.format(to)}`;
}

const arrowDeltas: Record<string, number> = {
	ArrowLeft: -1,
	ArrowRight: 1,
	ArrowUp: -7,
	ArrowDown: 7,
};

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

	const days = getMonthGrid(viewMonth);
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
						<div ref={gridRef} onKeyDown={handleGridKeyDown}>
							<div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
								<IconButton
									label="Previous month"
									size="sm"
									onClick={() => setViewMonth(addMonths(viewMonth, -1))}
								>
									<ChevronLeft aria-hidden="true" />
								</IconButton>
								<span
									aria-live="polite"
									className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface"
								>
									{monthFormatter.format(viewMonth)}
								</span>
								<IconButton
									label="Next month"
									size="sm"
									onClick={() => setViewMonth(addMonths(viewMonth, 1))}
								>
									<ChevronRight aria-hidden="true" />
								</IconButton>
							</div>
							<div className="teal-u-grid teal-u-grid-cols-7 teal-u-justify-items-center">
								{weekdayNames.map((name, index) => (
									<span
										key={index}
										aria-hidden="true"
										className="teal-u-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface-variant"
									>
										{name}
									</span>
								))}
								{days.map((day) => {
									const isStart = from !== null && isSameDay(day, from);
									const isEnd = to !== null && isSameDay(day, to);
									const isInRange =
										from !== null &&
										to !== null &&
										day.getTime() > from.getTime() &&
										day.getTime() < to.getTime();
									const isToday = isSameDay(day, today);
									const isOutsideMonth =
										day.getMonth() !== viewMonth.getMonth();
									const isDisabled = isDayDisabled(day);
									return (
										<button
											key={dateKey(day)}
											type="button"
											data-date={dateKey(day)}
											tabIndex={isSameDay(day, focusedDate) ? 0 : -1}
											disabled={isDisabled}
											aria-pressed={isStart || isEnd || undefined}
											aria-current={isToday ? "date" : undefined}
											onFocus={() => setFocusedDate(day)}
											onClick={() => selectDay(day)}
											className={cn(
												"teal-focus-ring teal-u-box-border teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40",
												!isStart && !isEnd && "teal-u-text-on-surface",
												isOutsideMonth && "teal-u-text-on-surface-variant/50",
												isToday &&
													"teal-u-border teal-u-border-solid teal-u-border-primary",
												isInRange && "teal-u-rounded-none teal-u-bg-primary/10",
												(isStart || isEnd) &&
													"teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90",
											)}
										>
											{day.getDate()}
										</button>
									);
								})}
							</div>
						</div>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		</div>
	);
});
