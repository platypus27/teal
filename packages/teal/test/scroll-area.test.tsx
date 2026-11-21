import { render, screen } from "@testing-library/react";
import { ScrollArea } from "../src/ScrollArea";

describe("ScrollArea", () => {
	it("renders its children inside the viewport", () => {
		const { container } = render(
			<ScrollArea maxHeight={200}>
				<ul>
					<li>First entry</li>
					<li>Last entry</li>
				</ul>
			</ScrollArea>,
		);

		const viewport = container.querySelector(
			"[data-radix-scroll-area-viewport]",
		);
		expect(viewport).toHaveAttribute("tabindex", "0");
		expect(viewport).toHaveClass("teal-focus-ring");
		expect(viewport).toContainElement(screen.getByText("First entry"));
		expect(viewport).toContainElement(screen.getByText("Last entry"));
	});

	it("applies maxHeight to the root element", () => {
		const { container } = render(
			<ScrollArea maxHeight="12rem">
				<p>Content</p>
			</ScrollArea>,
		);

		// jsdom resolves rem in computed styles (12rem -> 192px), so assert the
		// specified inline declaration rather than a computed value.
		expect((container.firstChild as HTMLElement).style.maxHeight).toBe("12rem");
	});
});
