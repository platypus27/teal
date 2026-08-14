import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, IconButton } from "./Button";
import { cn } from "./cn";
import {
	addDays,
	addMonths,
	arrowDeltas,
	dateKey,
	pad,
	startOfDay,
} from "./date-utils";
import { FieldScaffolding } from "./field-scaffolding";
import {
	hasFormContent,
	isAriaTrue,
	mergeDescriptionIds,
	useFormSemantics,
} from "./form-semantics";
import { Input } from "./Input";
import { MonthGrid } from "./MonthGrid";
import { TimePicker } from "./TimePicker";

export interface DateRange {
	/** First day of the range, or null when nothing is selected. */
	from: Date | null;
	/** Last day of the range, or null while the end is still being picked. */
	to: Date | null;
}

export interface DatePickerProps {
	"aria-describedby"?: string;
	/** Accessible name when there is no visible label. */
	"aria-label"?: string;
	/** Marks the input invalid for form validation and screen readers. */
	"aria-invalid"?: boolean | "false" | "true";
	className?: string;
	/** Initial selection when uncontrolled. */
	defaultValue?: Date | DateRange;
	/** Supporting text rendered below the input. */
	description?: ReactNode;
	/** Prevents interaction with the input. */
	disabled?: boolean;
	/** 12 shows a 1–12 hour field with an AM/PM toggle; 24 shows a 0–23 hour field. Only for mode="datetime". */
	hourCycle?: 12 | 24;
	/** Explicit id; otherwise Field or an internal id is used. */
	id?: string;
	/** Disables specific days in the calendar grid. */
	isDateDisabled?: (date: Date) => boolean;
	/** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
	label?: ReactNode;
	/** Latest selectable date (inclusive). */
	maxDate?: Date;
	/** Earliest selectable date (inclusive). */
	minDate?: Date;
	/** Picker granularity: 'day' (default), 'month', 'year', or 'datetime' (day grid plus time fields). */
	mode?: "day" | "month" | "year" | "datetime";
	/** Called with the selected date, or the range after every selection step. */
	onValueChange?: (value: Date | DateRange | undefined) => void;
	/** Text shown when nothing is selected. */
	placeholder?: string;
	/** Marks the input as required. */
	required?: boolean;
	/** 'single' (default) picks one date; 'range' picks {from, to} (only meaningful with mode="day"). */
	selection?: "single" | "range";
	/** Controlled selection. */
	value?: Date | DateRange;
}

const monthShortFormatter = new Intl.DateTimeFormat(undefined, {
	month: "short",
});
const monthLongFormatter = new Intl.DateTimeFormat(undefined, {
	month: "long",
});
const monthYearFormatter = new Intl.DateTimeFormat(undefined, {
	month: "long",
	year: "numeric",
});
const monthNames = Array.from({ length: 12 }, (_, index) =>
	monthShortFormatter.format(new Date(2024, index, 1)),
);
const monthLongNames = Array.from({ length: 12 }, (_, index) =>
	monthLongFormatter.format(new Date(2024, index, 1)),
);

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

/** Arrow-key deltas for the 3-column month and year panels. */
const panelArrowDeltas: Record<string, number> = {
	ArrowLeft: -1,
	ArrowRight: 1,
	ArrowUp: -3,
	ArrowDown: 3,
};

function monthIndex(date: Date) {
	return date.getFullYear() * 12 + date.getMonth();
}

/** Years shown per page; a 3 × 4 grid. Pages align to multiples of PAGE_SIZE so any visible year maps back to the same page. */
const PAGE_SIZE = 12;

function pageStart(year: number) {
	return Math.floor(year / PAGE_SIZE) * PAGE_SIZE;
}

interface MonthModePanelProps {
	focusedMonth: number;
	gridRef: RefObject<HTMLDivElement | null>;
	isMonthDisabled: (month: number) => boolean;
	onFocusMonth: (month: number) => void;
	onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	onSelectMonth: (month: number) => void;
	onViewYearChange: (year: number) => void;
	selected: Date | undefined;
	viewYear: number;
}

function MonthModePanel({
	focusedMonth,
	gridRef,
	isMonthDisabled,
	onFocusMonth,
	onKeyDown,
	onSelectMonth,
	onViewYearChange,
	selected,
	viewYear,
}: MonthModePanelProps) {
	const today = new Date();
	return (
		<>
			<div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
				<IconButton
					label="Previous year"
					size="sm"
					onClick={() => onViewYearChange(viewYear - 1)}
				>
					<ChevronLeft aria-hidden="true" />
				</IconButton>
				<span
					aria-live="polite"
					className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface"
				>
					{viewYear}
				</span>
				<IconButton
					label="Next year"
					size="sm"
					onClick={() => onViewYearChange(viewYear + 1)}
				>
					<ChevronRight aria-hidden="true" />
				</IconButton>
			</div>
			<div
				ref={gridRef}
				role="group"
				aria-label="Months"
				onKeyDown={onKeyDown}
				className="teal-u-grid teal-u-grid-cols-3 teal-u-gap-1"
			>
				{monthNames.map((name, month) => {
					const isSelected =
						selected !== undefined &&
						selected.getFullYear() === viewYear &&
						selected.getMonth() === month;
					const isCurrent =
						today.getFullYear() === viewYear && today.getMonth() === month;
					const isDisabled = isMonthDisabled(month);
					return (
						<button
							key={name}
							type="button"
							data-month={month}
							aria-label={monthLongNames[month]}
							tabIndex={month === focusedMonth ? 0 : -1}
							disabled={isDisabled}
							aria-pressed={isSelected || undefined}
							aria-current={isCurrent ? "date" : undefined}
							onFocus={() => onFocusMonth(month)}
							onClick={() => onSelectMonth(month)}
							className={cn(
								"teal-focus-ring teal-u-inline-flex teal-u-h-9 teal-u-items-center teal-u-justify-center teal-u-rounded-xl teal-u-px-3 teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40",
								!isSelected && "teal-u-text-on-surface",
								isCurrent &&
									"teal-u-border teal-u-border-solid teal-u-border-primary",
								isSelected &&
									"teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90",
							)}
						>
							{name}
						</button>
					);
				})}
			</div>
		</>
	);
}

interface YearModePanelProps {
	focusedYear: number;
	gridRef: RefObject<HTMLDivElement | null>;
	isYearDisabled: (year: number) => boolean;
	onFocusYear: (year: number) => void;
	onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	onSelectYear: (year: number) => void;
	selected: Date | undefined;
}

function YearModePanel({
	focusedYear,
	gridRef,
	isYearDisabled,
	onFocusYear,
	onKeyDown,
	onSelectYear,
	selected,
}: YearModePanelProps) {
	const currentYear = new Date().getFullYear();
	const startYear = pageStart(focusedYear);
	const years = Array.from({ length: PAGE_SIZE }, (_, index) => startYear + index);
	return (
		<>
			<div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
				<IconButton
					label="Previous decade"
					size="sm"
					onClick={() => onFocusYear(focusedYear - 10)}
				>
					<ChevronLeft aria-hidden="true" />
				</IconButton>
				<span
					aria-live="polite"
					className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface"
				>
					{years[0]} – {years[years.length - 1]}
				</span>
				<IconButton
					label="Next decade"
					size="sm"
					onClick={() => onFocusYear(focusedYear + 10)}
				>
					<ChevronRight aria-hidden="true" />
				</IconButton>
			</div>
			<div
				ref={gridRef}
				role="group"
				aria-label="Years"
				onKeyDown={onKeyDown}
				className="teal-u-grid teal-u-grid-cols-3 teal-u-gap-1"
			>
				{years.map((year) => {
					const isSelected =
						selected !== undefined && selected.getFullYear() === year;
					const isCurrent = year === currentYear;
					const isDisabled = isYearDisabled(year);
					return (
						<button
							key={year}
							type="button"
							data-year={year}
							tabIndex={year === focusedYear ? 0 : -1}
							disabled={isDisabled}
							aria-pressed={isSelected || undefined}
							aria-current={isCurrent ? "date" : undefined}
							onFocus={() => onFocusYear(year)}
							onClick={() => onSelectYear(year)}
							className={cn(
								"teal-focus-ring teal-u-inline-flex teal-u-h-9 teal-u-items-center teal-u-justify-center teal-u-rounded-xl teal-u-px-3 teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40",
								!isSelected && "teal-u-text-on-surface",
								isCurrent &&
									"teal-u-border teal-u-border-solid teal-u-border-primary",
								isSelected &&
									"teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90",
							)}
						>
							{year}
						</button>
					);
				})}
			</div>
		</>
	);
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
	function DatePicker(
		{
			"aria-describedby": describedBy,
			"aria-label": ariaLabel,
			"aria-invalid": invalid,
			className,
			defaultValue,
			description,
			disabled,
			hourCycle = 24,
			id,
			isDateDisabled,
			label,
			maxDate,
			minDate,
			mode = "day",
			onValueChange,
			placeholder = "Pick a date",
			required,
			selection = "single",
			value,
		},
		ref,
	) {
		const isRange = selection === "range";
		const semantics = useFormSemantics({
			description,
			id,
			invalid: isAriaTrue(invalid),
			prefix: "teal-date-picker",
			required,
		});
		const showDescription = hasFormContent(description);
		const calendarId = `${semantics.controlId}-calendar`;

		const [internalValue, setInternalValue] = useState<
			Date | DateRange | undefined
		>(() => defaultValue ?? (isRange ? { from: null, to: null } : undefined));
		const selected = value !== undefined ? value : internalValue;
		const selectedDate = selected instanceof Date ? selected : undefined;
		const rangeValue: DateRange =
			isRange && selected !== undefined && !(selected instanceof Date)
				? selected
				: { from: null, to: null };

		const [open, setOpen] = useState(false);
		const [viewMonth, setViewMonth] = useState<Date>(
			() => selectedDate ?? rangeValue.from ?? new Date(),
		);
		const [focusedDate, setFocusedDate] = useState<Date>(
			() => selectedDate ?? rangeValue.from ?? new Date(),
		);
		const [viewYear, setViewYear] = useState(
			() => (selectedDate ?? new Date()).getFullYear(),
		);
		const [focusedMonth, setFocusedMonth] = useState(
			() => (selectedDate ?? new Date()).getMonth(),
		);
		const [focusedYear, setFocusedYear] = useState(
			() => (selectedDate ?? new Date()).getFullYear(),
		);
		// Draft time used before any date is chosen; a picked day keeps this time.
		const [draftTime, setDraftTime] = useState(() => {
			const base = selectedDate ?? new Date();
			return { hour: base.getHours(), minute: base.getMinutes() };
		});
		const time = selectedDate
			? { hour: selectedDate.getHours(), minute: selectedDate.getMinutes() }
			: draftTime;
		const shouldFocusDay = useRef(false);
		const suppressFocusOpen = useRef(false);
		const gridRef = useRef<HTMLDivElement>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);

		function setInputRef(node: HTMLInputElement | null) {
			inputRef.current = node;
			if (typeof ref === "function") ref(node);
			else if (ref)
				(ref as { current: HTMLInputElement | null }).current = node;
		}

		useEffect(() => {
			if (!open || !shouldFocusDay.current) return;
			shouldFocusDay.current = false;
			// Defer past the pointer interaction that opened the picker; focusing the
			// day synchronously here is overwritten when the input's focus() completes.
			queueMicrotask(() => {
				const selector =
					mode === "month"
						? `[data-month="${focusedMonth}"]`
						: mode === "year"
							? `[data-year="${focusedYear}"]`
							: `[data-date="${dateKey(focusedDate)}"]`;
				gridRef.current
					?.querySelector<HTMLButtonElement>(selector)
					?.focus();
			});
		}, [open, focusedDate, focusedMonth, focusedYear, viewMonth, viewYear, mode]);

		function isDayDisabled(day: Date) {
			const timeMs = startOfDay(day).getTime();
			if (minDate !== undefined && timeMs < startOfDay(minDate).getTime())
				return true;
			if (maxDate !== undefined && timeMs > startOfDay(maxDate).getTime())
				return true;
			return isDateDisabled?.(day) ?? false;
		}

		function isMonthDisabled(month: number) {
			const index = viewYear * 12 + month;
			if (minDate !== undefined && index < monthIndex(minDate)) return true;
			if (maxDate !== undefined && index > monthIndex(maxDate)) return true;
			return false;
		}

		function isYearDisabled(year: number) {
			if (minDate !== undefined && year < minDate.getFullYear()) return true;
			if (maxDate !== undefined && year > maxDate.getFullYear()) return true;
			return false;
		}

		function commit(next: Date | DateRange) {
			if (value === undefined) setInternalValue(next);
			onValueChange?.(next);
		}

		function openPicker() {
			if (disabled) return;
			const base =
				selectedDate ?? rangeValue.from ?? rangeValue.to ?? new Date();
			setViewMonth(addMonths(base, 0));
			setFocusedDate(base);
			setViewYear(base.getFullYear());
			setFocusedMonth(base.getMonth());
			setFocusedYear(base.getFullYear());
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
			if (isRange) {
				const { from, to } = rangeValue;
				// Starting fresh, or clicking before the current start, begins a new range.
				if (from === null || to !== null || day.getTime() < from.getTime()) {
					commit({ from: day, to: null });
					return;
				}
				commit({ from, to: day });
				closePicker();
				return;
			}
			if (mode === "datetime") {
				// The popover stays open so the time can be adjusted before Done.
				commit(
					new Date(
						day.getFullYear(),
						day.getMonth(),
						day.getDate(),
						time.hour,
						time.minute,
					),
				);
				return;
			}
			commit(day);
			closePicker();
		}

		function selectMonth(month: number) {
			if (isMonthDisabled(month)) return;
			commit(new Date(viewYear, month, 1));
			closePicker();
		}

		function selectYear(year: number) {
			if (isYearDisabled(year)) return;
			commit(new Date(year, 0, 1));
			closePicker();
		}

		function handleTimeChange(raw: string) {
			const match = /^(\d{2}):(\d{2})$/.exec(raw);
			if (!match) return;
			const hour = Number(match[1]);
			const minute = Number(match[2]);
			setDraftTime({ hour, minute });
			if (selectedDate) {
				commit(
					new Date(
						selectedDate.getFullYear(),
						selectedDate.getMonth(),
						selectedDate.getDate(),
						hour,
						minute,
					),
				);
			}
		}

		function applyPreset(from: Date, to: Date) {
			commit({ from: startOfDay(from), to: startOfDay(to) });
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

		function handleMonthKeyDown(event: KeyboardEvent<HTMLDivElement>) {
			let next: number | undefined;
			const delta = panelArrowDeltas[event.key];
			if (delta !== undefined)
				next = Math.min(11, Math.max(0, focusedMonth + delta));
			else if (event.key === "Home") next = 0;
			else if (event.key === "End") next = 11;
			if (next === undefined) return;
			event.preventDefault();
			setFocusedMonth(next);
			shouldFocusDay.current = true;
		}

		function handleYearKeyDown(event: KeyboardEvent<HTMLDivElement>) {
			let next: number | undefined;
			const delta = panelArrowDeltas[event.key];
			const startYear = pageStart(focusedYear);
			if (delta !== undefined) next = focusedYear + delta;
			else if (event.key === "Home") next = startYear;
			else if (event.key === "End") next = startYear + PAGE_SIZE - 1;
			if (next === undefined) return;
			event.preventDefault();
			setFocusedYear(next);
			shouldFocusDay.current = true;
		}

		const today = new Date();
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

		const displayValue = (() => {
			if (isRange) {
				const { from, to } = rangeValue;
				if (from !== null && to !== null) return formatRange(from, to);
				if (from !== null) return `${dayFormatter.format(from)} – `;
				return "";
			}
			if (selectedDate === undefined) return "";
			if (mode === "month") return monthYearFormatter.format(selectedDate);
			if (mode === "year") return String(selectedDate.getFullYear());
			if (mode === "datetime") return selectedDate.toLocaleString();
			return selectedDate.toLocaleDateString();
		})();

		return (
			<FieldScaffolding
				className={className}
				controlId={semantics.controlId}
				description={description}
				descriptionId={semantics.descriptionId}
				label={label}
				labeledByField={semantics.labeledByField}
			>
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
								aria-describedby={mergeDescriptionIds(
									describedBy,
									showDescription ? semantics.descriptionId : undefined,
								)}
								aria-invalid={invalid}
								autoComplete="off"
								required={required}
								disabled={disabled}
								placeholder={placeholder}
								readOnly
								value={displayValue}
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
					{/* No Portal: the content stays inside the component tree so tests and
					    callers can query the grid from the render container; Popper still
					    positions it against the anchor. */}
					<PopoverPrimitive.Content
						id={calendarId}
						align="start"
						side="bottom"
						sideOffset={6}
						onOpenAutoFocus={(event) => event.preventDefault()}
						className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-p-3 teal-u-text-on-surface teal-u-outline-none"
					>
						{mode === "month" ? (
							<MonthModePanel
								focusedMonth={focusedMonth}
								gridRef={gridRef}
								isMonthDisabled={isMonthDisabled}
								onFocusMonth={setFocusedMonth}
								onKeyDown={handleMonthKeyDown}
								onSelectMonth={selectMonth}
								onViewYearChange={setViewYear}
								selected={selectedDate}
								viewYear={viewYear}
							/>
						) : mode === "year" ? (
							<YearModePanel
								focusedYear={focusedYear}
								gridRef={gridRef}
								isYearDisabled={isYearDisabled}
								onFocusYear={setFocusedYear}
								onKeyDown={handleYearKeyDown}
								onSelectYear={selectYear}
								selected={selectedDate}
							/>
						) : (
							<>
								{isRange ? (
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
								) : null}
								<div ref={gridRef}>
									<MonthGrid
										keyboard
										focusedDate={focusedDate}
										isDayDisabled={isDayDisabled}
										month={viewMonth}
										onFocusDay={setFocusedDate}
										onKeyDown={handleGridKeyDown}
										onMonthChange={setViewMonth}
										onSelect={selectDay}
										range={isRange ? rangeValue : undefined}
										selected={!isRange ? (selectedDate ?? null) : null}
									/>
								</div>
								{mode === "datetime" ? (
									<div className="teal-u-mt-3 teal-u-flex teal-u-items-end teal-u-gap-2 teal-u-border-0 teal-u-border-t teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-pt-3">
										<TimePicker
											label="Time"
											hourCycle={hourCycle}
											value={`${pad(time.hour)}:${pad(time.minute)}`}
											onChange={handleTimeChange}
										/>
										<Button
											variant="secondary"
											size="sm"
											onClick={closePicker}
										>
											Done
										</Button>
									</div>
								) : null}
							</>
						)}
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Root>
			</FieldScaffolding>
		);
	},
);
