import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "../src/MultiSelect";

const options = [
	{ value: "admin", label: "Administrator" },
	{ value: "editor", label: "Editor" },
	{ value: "viewer", label: "Viewer" },
];

describe("MultiSelect", () => {
	it("renders the label and placeholder", () => {
		render(
			<MultiSelect
				label="Project roles"
				placeholder="Pick roles"
				options={options}
			/>,
		);
		const control = screen.getByRole("combobox", { name: "Project roles" });
		expect(control).toHaveTextContent("Pick roles");
		expect(control).toHaveAttribute("aria-expanded", "false");
	});

	it("opens a multi-selectable listbox and toggles options without closing", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<MultiSelect
				label="Project roles"
				options={options}
				onValueChange={onValueChange}
			/>,
		);
		const control = screen.getByRole("combobox", { name: "Project roles" });

		await user.click(control);
		const listbox = await screen.findByRole("listbox");
		expect(listbox).toHaveAttribute("aria-multiselectable", "true");

		await user.click(screen.getByRole("option", { name: "Editor" }));
		expect(onValueChange).toHaveBeenCalledWith(["editor"]);
		expect(control).toHaveTextContent("Editor");
		expect(control).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByRole("option", { name: "Editor" })).toHaveAttribute(
			"aria-selected",
			"true",
		);

		await user.click(screen.getByRole("option", { name: "Viewer" }));
		expect(onValueChange).toHaveBeenCalledWith(["editor", "viewer"]);
	});

	it("removes a selected value via its chip remove button", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<MultiSelect
				label="Project roles"
				options={options}
				defaultValue={["editor", "viewer"]}
				onValueChange={onValueChange}
			/>,
		);

		const removeEditor = screen.getByRole("button", { name: "Remove Editor" });
		expect(removeEditor).toHaveClass("teal-u-size-6");
		await user.click(removeEditor);

		expect(onValueChange).toHaveBeenCalledWith(["viewer"]);
		const control = screen.getByRole("combobox", { name: "Project roles" });
		expect(within(control).queryByText("Editor")).not.toBeInTheDocument();
		expect(within(control).getByText("Viewer")).toBeInTheDocument();
	});

	it("filters options from the popover input", async () => {
		const user = userEvent.setup();
		render(<MultiSelect label="Project roles" options={options} />);

		await user.click(screen.getByRole("combobox", { name: "Project roles" }));
		await user.type(await screen.findByLabelText("Filter options"), "view");

		const visible = screen.getAllByRole("option");
		expect(visible).toHaveLength(1);
		expect(visible[0]).toHaveTextContent("Viewer");
	});

	it("closes on Escape", async () => {
		const user = userEvent.setup();
		render(<MultiSelect label="Project roles" options={options} />);
		const control = screen.getByRole("combobox", { name: "Project roles" });

		await user.click(control);
		await screen.findByRole("listbox");
		await user.keyboard("{Escape}");

		expect(control).toHaveAttribute("aria-expanded", "false");
	});
});
