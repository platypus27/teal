import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "../src/NumberInput";

describe("NumberInput", () => {
	it("renders the label and initial value", () => {
		render(<NumberInput label="Team size" defaultValue={3} />);
		expect(screen.getByRole("spinbutton", { name: "Team size" })).toHaveValue(
			3,
		);
	});

	it("reports typed numbers and undefined when cleared", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<NumberInput label="Team size" onValueChange={onValueChange} />);
		const input = screen.getByRole("spinbutton", { name: "Team size" });

		await user.type(input, "12");
		expect(onValueChange).toHaveBeenLastCalledWith(12);

		await user.clear(input);
		expect(onValueChange).toHaveBeenLastCalledWith(undefined);
		expect(input).toHaveValue(null);
	});

	it("increments and decrements with the stepper buttons", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<NumberInput
				label="Team size"
				defaultValue={3}
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByRole("spinbutton", { name: "Team size" });
		expect(screen.getByRole("button", { name: "Increment" })).toHaveClass(
			"teal-u-size-6",
		);
		expect(screen.getByRole("button", { name: "Decrement" })).toHaveClass(
			"teal-u-size-6",
		);

		await user.click(screen.getByRole("button", { name: "Increment" }));
		expect(onValueChange).toHaveBeenLastCalledWith(4);
		expect(input).toHaveValue(4);

		await user.click(screen.getByRole("button", { name: "Decrement" }));
		await user.click(screen.getByRole("button", { name: "Decrement" }));
		expect(onValueChange).toHaveBeenLastCalledWith(2);
		expect(input).toHaveValue(2);
	});

	it("clamps stepper values at min and max", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<NumberInput
				label="Team size"
				defaultValue={5}
				min={1}
				max={6}
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByRole("spinbutton", { name: "Team size" });

		await user.click(screen.getByRole("button", { name: "Increment" }));
		expect(onValueChange).toHaveBeenLastCalledWith(6);
		expect(input).toHaveValue(6);
		expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();

		await user.click(screen.getByRole("button", { name: "Decrement" }));
		expect(onValueChange).toHaveBeenLastCalledWith(5);

		await user.click(screen.getByRole("button", { name: "Decrement" }));
		await user.click(screen.getByRole("button", { name: "Decrement" }));
		await user.click(screen.getByRole("button", { name: "Decrement" }));
		await user.click(screen.getByRole("button", { name: "Decrement" }));
		expect(onValueChange).toHaveBeenLastCalledWith(1);
		expect(input).toHaveValue(1);
		expect(screen.getByRole("button", { name: "Decrement" })).toBeDisabled();
	});

	it("applies the step and still clamps to the bounds", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<NumberInput
				label="Velocity"
				defaultValue={2}
				min={0}
				max={9}
				step={5}
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByRole("spinbutton", { name: "Velocity" });

		await user.click(screen.getByRole("button", { name: "Increment" }));
		expect(onValueChange).toHaveBeenLastCalledWith(7);

		await user.click(screen.getByRole("button", { name: "Increment" }));
		expect(onValueChange).toHaveBeenLastCalledWith(9);
		expect(input).toHaveValue(9);
	});

	it("starts stepping from min when the field is empty", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<NumberInput label="Team size" min={2} onValueChange={onValueChange} />,
		);

		await user.click(screen.getByRole("button", { name: "Increment" }));
		expect(onValueChange).toHaveBeenLastCalledWith(3);
	});
});
