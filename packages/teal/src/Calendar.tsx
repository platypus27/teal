import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "./cn";
import { addMonths, startOfDay } from "./date-utils";
import { MonthGrid } from "./MonthGrid";

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

		return (
			<div
				ref={ref}
				className={cn("teal-u-w-fit teal-u-p-3", className)}
				{...props}
			>
				<MonthGrid
					month={viewMonth}
					onMonthChange={setMonth}
					onSelect={onSelect}
					selected={value}
					isDayDisabled={isDayDisabled}
				/>
			</div>
		);
	},
);
