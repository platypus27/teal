import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../src/DatePicker";

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
