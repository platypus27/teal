import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../src/DatePicker";
import { addDays, dateKey, startOfDay } from "../src/date-utils";

function monthLabel(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		month: "long",
		year: "numeric",
	}).format(date);
}

describe("DatePicker", () => {
	it("renders the label and placeholder", () => {
		render(<DatePicker label="Due date" />);
		const input = screen.getByRole("textbox", { name: "Due date" });
		expect(input).toHaveAttribute("placeholder", "Pick a date");
		expect(input).toHaveAttribute("aria-haspopup", "dialog");
		expect(
			screen.queryByRole("button", { name: "Next month" }),
		).not.toBeInTheDocument();
	});

	it("opens the calendar on click showing the selected month", async () => {
		const user = userEvent.setup();
		render(
			<DatePicker label="Due date" defaultValue={new Date(2024, 0, 15)} />,
		);
		const input = screen.getByRole("textbox", { name: "Due date" });

		await user.click(input);
		expect(
			await screen.findByText(monthLabel(new Date(2024, 0, 1))),
		).toBeInTheDocument();
		const selected = screen.getByRole("button", { name: "15" });
		expect(selected).toHaveAttribute("aria-pressed", "true");
		expect(selected).toHaveClass("teal-u-text-on-primary");
		expect(selected).not.toHaveClass("teal-u-text-on-surface");
	});

	it("navigates between months with the header buttons", async () => {
		const user = userEvent.setup();
		render(
			<DatePicker label="Due date" defaultValue={new Date(2024, 0, 15)} />,
		);

		await user.click(screen.getByRole("textbox", { name: "Due date" }));
		await user.click(await screen.findByRole("button", { name: "Next month" }));
		expect(
			screen.getByText(monthLabel(new Date(2024, 1, 1))),
		).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Previous month" }));
		await user.click(screen.getByRole("button", { name: "Previous month" }));
		expect(
			screen.getByText(monthLabel(new Date(2023, 11, 1))),
		).toBeInTheDocument();
	});

	it("selects a day, reports it, and closes the calendar", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker
				label="Due date"
				defaultValue={new Date(2024, 0, 10)}
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByRole("textbox", { name: "Due date" });

		await user.click(input);
		await user.click(await screen.findByRole("button", { name: "15" }));

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 15));
		expect(input).toHaveValue(new Date(2024, 0, 15).toLocaleDateString());
		expect(
			screen.queryByText(monthLabel(new Date(2024, 0, 1))),
		).not.toBeInTheDocument();
	});

	it("supports arrow-key navigation and Enter selection", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker
				label="Due date"
				defaultValue={new Date(2024, 0, 15)}
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByRole("textbox", { name: "Due date" });

		await user.click(input);
		expect(await screen.findByRole("button", { name: "15" })).toHaveFocus();
		await user.keyboard("{ArrowRight}{ArrowRight}");
		expect(screen.getByRole("button", { name: "17" })).toHaveFocus();
		await user.keyboard("{Enter}");

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 17));
		expect(
			screen.queryByRole("button", { name: "Next month" }),
		).not.toBeInTheDocument();
	});

	it("closes on Escape without changing the value", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<DatePicker label="Due date" onValueChange={onValueChange} />);
		const input = screen.getByRole("textbox", { name: "Due date" });

		await user.click(input);
		await screen.findByRole("button", { name: "Next month" });
		await user.keyboard("{Escape}");

		expect(
			screen.queryByRole("button", { name: "Next month" }),
		).not.toBeInTheDocument();
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("disables days outside the min/max range", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker
				label="Due date"
				defaultValue={new Date(2024, 0, 15)}
				minDate={new Date(2024, 0, 12)}
				maxDate={new Date(2024, 0, 18)}
				onValueChange={onValueChange}
			/>,
		);

		await user.click(screen.getByRole("textbox", { name: "Due date" }));
		expect(await screen.findByRole("button", { name: "11" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "20" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "15" })).toBeEnabled();

		await user.click(screen.getByRole("button", { name: "11" }));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(
			screen.getByRole("button", { name: "Next month" }),
		).toBeInTheDocument();
	});
});

describe("DatePicker month mode", () => {
	it("opens twelve months of the selected year and commits the first of the month", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker
				label="Month"
				mode="month"
				value={new Date(2024, 5, 1)}
				onValueChange={onValueChange}
			/>,
		);

		await user.click(screen.getByRole("textbox", { name: "Month" }));

		expect(
			await screen.findByRole("group", { name: "Months" }),
		).toBeInTheDocument();
		expect(screen.getByText("2024")).toBeInTheDocument();
		const june = screen.getByRole("button", { name: "June" });
		expect(june).toHaveAttribute("aria-pressed", "true");

		await user.click(screen.getByRole("button", { name: "March" }));
		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 1));
	});

	it("clamps arrow-key movement at January and December", async () => {
		const user = userEvent.setup();
		render(
			<DatePicker
				label="Month"
				mode="month"
				defaultValue={new Date(2024, 0, 1)}
			/>,
		);
		const input = screen.getByRole("textbox", { name: "Month" });
		await user.click(input);
		const january = await screen.findByRole("button", { name: "January" });

		fireEvent.keyDown(january, { key: "ArrowLeft" });

		expect(january).toHaveFocus();
	});
});

describe("DatePicker year mode", () => {
	it("shows the decade page of the selected year and pages decades", async () => {
		const user = userEvent.setup();
		render(<DatePicker label="Year" mode="year" value={new Date(2024, 0, 1)} />);

		await user.click(screen.getByRole("textbox", { name: "Year" }));

		expect(await screen.findByText("2016 – 2027")).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Next decade" }));
		expect(await screen.findByText("2028 – 2039")).toBeInTheDocument();
	});

	it("commits January 1 of the chosen year and closes", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker label="Year" mode="year" onValueChange={onValueChange} />,
		);
		await user.click(screen.getByRole("textbox", { name: "Year" }));

		await user.click(await screen.findByRole("button", { name: "2026" }));

		expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 1));
		expect(
			screen.queryByRole("button", { name: "2026" }),
		).not.toBeInTheDocument();
	});
});

describe("DatePicker datetime mode", () => {
	it("shows time fields, keeps the popover open on day select, and closes with Done", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker
				label="Starts"
				mode="datetime"
				value={new Date(2024, 0, 15, 9, 30)}
				onValueChange={onValueChange}
			/>,
		);

		await user.click(screen.getByRole("textbox", { name: "Starts" }));

		expect(
			await screen.findByRole("group", { name: "Time" }),
		).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "20" }));
		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 20, 9, 30));
		expect(screen.getByRole("group", { name: "Time" })).toBeInTheDocument(); // still open

		await user.click(screen.getByRole("button", { name: "Done" }));
		expect(
			screen.queryByRole("group", { name: "Time" }),
		).not.toBeInTheDocument();
	});
});

describe("DatePicker range selection", () => {
	function dayOfCurrentMonth(day: number) {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), day);
	}

	it("selects a start then an end date, reports both steps, and closes", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker label="Range" selection="range" onValueChange={onValueChange} />,
		);
		await user.click(screen.getByRole("textbox", { name: "Range" }));

		await user.click(await screen.findByRole("button", { name: "10" }));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: startOfDay(dayOfCurrentMonth(10)),
			to: null,
		});

		await user.click(screen.getByRole("button", { name: "15" }));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: startOfDay(dayOfCurrentMonth(10)),
			to: startOfDay(dayOfCurrentMonth(15)),
		});
	});

	it("applies the Last 7 days preset ending today", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<DatePicker label="Range" selection="range" onValueChange={onValueChange} />,
		);
		await user.click(screen.getByRole("textbox", { name: "Range" }));

		await user.click(await screen.findByRole("button", { name: "Last 7 days" }));

		expect(onValueChange).toHaveBeenLastCalledWith({
			from: startOfDay(addDays(new Date(), -6)),
			to: startOfDay(new Date()),
		});
	});

	it("renders a connected band between the range endpoints", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<DatePicker
				label="Range"
				selection="range"
				value={{
					from: startOfDay(dayOfCurrentMonth(10)),
					to: startOfDay(dayOfCurrentMonth(15)),
				}}
			/>,
		);
		await user.click(screen.getByRole("textbox", { name: "Range" }));
		await screen.findByRole("button", { name: "12" });

		const key = (day: number) => dateKey(dayOfCurrentMonth(day));
		const startCell = container.querySelector(`[data-date-cell="${key(10)}"]`);
		const midCell = container.querySelector(`[data-date-cell="${key(12)}"]`);
		const endCell = container.querySelector(`[data-date-cell="${key(15)}"]`);
		expect(midCell).toHaveClass("teal-u-w-full", "teal-u-bg-primary/10");
		expect(startCell).toHaveClass(
			"teal-u-bg-primary/10",
			"teal-u-rounded-l-full",
		);
		expect(endCell).toHaveClass("teal-u-bg-primary/10", "teal-u-rounded-r-full");
		// Endpoints keep their primary circle:
		expect(screen.getByRole("button", { name: "10" })).toHaveClass(
			"teal-u-bg-primary",
			"teal-u-rounded-full",
		);
	});
});
