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
import {
	hasFormContent,
	isAriaTrue,
	mergeDescriptionIds,
	useFormSemantics,
} from "./form-semantics";
import { Input } from "./Input";
import { MonthGrid } from "./MonthGrid";

export interface DatePickerProps {
	"aria-describedby"?: string;
	/** Accessible name when there is no visible label. */
	"aria-label"?: string;
	/** Marks the input invalid for form validation and screen readers. */
	"aria-invalid"?: boolean | "false" | "true";
	className?: string;
	/** Initial selected date when uncontrolled. */
	defaultValue?: Date;
	/** Supporting text rendered below the input. */
	description?: ReactNode;
	/** Prevents interaction with the input. */
	disabled?: boolean;
	/** Explicit id; otherwise Field or an internal id is used. */
	id?: string;
	/** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
	label?: ReactNode;
	/** Latest selectable date (inclusive). */
	maxDate?: Date;
	/** Earliest selectable date (inclusive). */
	minDate?: Date;
	/** Called with the selected date. */
	onValueChange?: (date: Date | undefined) => void;
	/** Text shown when no date is selected. */
	placeholder?: string;
	/** Marks the input as required. */
	required?: boolean;
	/** Controlled selected date. */
	value?: Date;
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
			id,
			label,
			maxDate,
			minDate,
			onValueChange,
			placeholder = "Pick a date",
			required,
			value,
		},
		ref,
	) {
		const semantics = useFormSemantics({
			description,
			id,
			invalid: isAriaTrue(invalid),
			prefix: "teal-date-picker",
			required,
		});
		const showLabel = hasFormContent(label) && !semantics.labeledByField;
		const showDescription = hasFormContent(description);
		const calendarId = `${semantics.controlId}-calendar`;

		const [internalValue, setInternalValue] = useState<Date | undefined>(
			defaultValue,
		);
		const selected = value !== undefined ? value : internalValue;

		const [open, setOpen] = useState(false);
		const [viewMonth, setViewMonth] = useState<Date>(
			() => selected ?? new Date(),
		);
		const [focusedDate, setFocusedDate] = useState<Date>(
			() => selected ?? new Date(),
		);
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
				gridRef.current
					?.querySelector<HTMLButtonElement>(
						`[data-date="${dateKey(focusedDate)}"]`,
					)
					?.focus();
			});
		}, [open, focusedDate, viewMonth]);

		function isDayDisabled(day: Date) {
			const time = startOfDay(day).getTime();
			if (minDate !== undefined && time < startOfDay(minDate).getTime())
				return true;
			if (maxDate !== undefined && time > startOfDay(maxDate).getTime())
				return true;
			return false;
		}

		function openPicker() {
			if (disabled) return;
			const base = selected ?? new Date();
			setViewMonth(addMonths(base, 0));
			setFocusedDate(base);
			shouldFocusDay.current = true;
			setOpen(true);
		}

		function selectDay(day: Date) {
			if (isDayDisabled(day)) return;
			if (value === undefined) setInternalValue(day);
			onValueChange?.(day);
			setOpen(false);
			suppressFocusOpen.current = true;
			inputRef.current?.focus();
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
								value={selected ? selected.toLocaleDateString() : ""}
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
							<div ref={gridRef}>
								<MonthGrid
									keyboard
									month={viewMonth}
									onMonthChange={setViewMonth}
									onSelect={selectDay}
									selected={selected ?? null}
									focusedDate={focusedDate}
									onFocusDay={setFocusedDate}
									onKeyDown={handleGridKeyDown}
									isDayDisabled={isDayDisabled}
								/>
							</div>
						</PopoverPrimitive.Content>
					</PopoverPrimitive.Portal>
				</PopoverPrimitive.Root>
				{showDescription ? (
					<p
						id={semantics.descriptionId}
						className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant"
					>
						{description}
					</p>
				) : null}
			</div>
		);
	},
);
