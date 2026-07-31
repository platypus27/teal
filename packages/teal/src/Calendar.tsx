import { forwardRef, useState, type HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./Button";
import { cn } from "./cn";

export interface CalendarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Disables specific dates when it returns true. */
	disabledDates?: (date: Date) => boolean;
	/** Latest selectable date (inclusive). */
	max?: Date;
	/** Earliest selectable date (inclusive). */
	min?: Date;
	/** Called when the visible month changes. */
	onMonthChange?: (month: Date) => void;
	/** Called with the date the user picks. */
	onSelect: (date: Date) => void;
	/** Currently selected date, or null for none. */
	value: Date | null;
	/** Controlled visible month; any day within the month is accepted. */
	visibleMonth?: Date;
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
// 2024-01-07 is a Sunday, so this yields locale weekday names starting Sunday.
const weekdayNames = Array.from({ length: 7 }, (_, index) =>
	weekdayFormatter.format(addDays(new Date(2024, 0, 7), index)),
);

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
	function Calendar(
		{
			className,
			disabledDates,
			max,
			min,
			onMonthChange,
			onSelect,
			value,
			visibleMonth,
			...props
		},
		ref,
	) {
		const [internalMonth, setInternalMonth] = useState<Date>(() =>
			addMonths(value ?? new Date(), 0),
		);
		const viewMonth = visibleMonth ?? internalMonth;

		function setMonth(month: Date) {
			if (visibleMonth === undefined) setInternalMonth(month);
			onMonthChange?.(month);
		}

		function isDayDisabled(day: Date) {
			const time = startOfDay(day).getTime();
			if (min !== undefined && time < startOfDay(min).getTime()) return true;
			if (max !== undefined && time > startOfDay(max).getTime()) return true;
			if (disabledDates?.(day)) return true;
			return false;
		}

		const days = getMonthGrid(viewMonth);
		const today = new Date();

		return (
			<div
				ref={ref}
				className={cn("teal-u-w-fit teal-u-p-3", className)}
				{...props}
			>
				<div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
					<IconButton
						label="Previous month"
						size="sm"
						onClick={() => setMonth(addMonths(viewMonth, -1))}
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
						onClick={() => setMonth(addMonths(viewMonth, 1))}
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
						const isSelected = value !== null && isSameDay(day, value);
						const isToday = isSameDay(day, today);
						const isOutsideMonth = day.getMonth() !== viewMonth.getMonth();
						const isDisabled = isDayDisabled(day);
						return (
							<button
								key={dateKey(day)}
								type="button"
								disabled={isDisabled}
								aria-pressed={isSelected || undefined}
								aria-current={isToday ? "date" : undefined}
								onClick={() => onSelect(day)}
								className={cn(
									"teal-focus-ring teal-u-box-border teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40",
									!isSelected && "teal-u-text-on-surface",
									isOutsideMonth && "teal-u-text-on-surface-variant/50",
									isToday &&
										"teal-u-border teal-u-border-solid teal-u-border-primary",
									isSelected &&
										"teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90",
								)}
							>
								{day.getDate()}
							</button>
						);
					})}
				</div>
			</div>
		);
	},
);
