import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
} from "react";
import { Check, Copy } from "lucide-react";
import { IconButton } from "./Button";
import { cn } from "./cn";

export interface CodeBlockProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	/** Source text to display. */
	code: string;
	/** Language name shown in the header; also used for the copy feedback. */
	language?: string;
	/** Renders a line-number gutter when true. */
	showLineNumbers?: boolean;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
	function CodeBlock(
		{ className, code, language, showLineNumbers = false, ...props },
		ref,
	) {
		const [copied, setCopied] = useState(false);
		const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

		useEffect(
			() => () => {
				if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
			},
			[],
		);

		const copyCode = async () => {
			try {
				await navigator.clipboard.writeText(code);
			} catch {
				// Clipboard access can be denied; still give feedback so the UI feels responsive.
			}
			setCopied(true);
			if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setCopied(false), 2000);
		};

		const lines = code.split("\n");

		return (
			<div
				ref={ref}
				className={cn(
					"teal-u-overflow-hidden teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-[color:var(--teal-color-inverse-surface)] teal-u-text-[color:var(--teal-color-inverse-on-surface)]",
					className,
				)}
				{...props}
			>
				<div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-2 teal-u-border-0 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-py-1 teal-u-pl-4 teal-u-pr-2">
					<span className="teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wider teal-u-opacity-70">
						{language ?? "code"}
					</span>
					<IconButton
						size="sm"
						label={copied ? "Copied" : "Copy code"}
						onClick={copyCode}
						className="teal-u-text-inherit teal-u-opacity-80 hover:teal-u-bg-white/10 hover:teal-u-text-inherit hover:teal-u-opacity-100"
					>
						{copied ? (
							<Check aria-hidden="true" />
						) : (
							<Copy aria-hidden="true" />
						)}
					</IconButton>
				</div>
				<pre
					tabIndex={0}
					className="teal-focus-ring teal-u-overflow-x-auto teal-u-p-4 teal-u-font-mono teal-u-text-sm teal-u-leading-relaxed"
				>
					{showLineNumbers ? (
						lines.map((line, index) => (
							<div key={index} className="teal-u-flex teal-u-min-w-max">
								<span
									aria-hidden="true"
									className="teal-u-w-8 teal-u-shrink-0 teal-u-select-none teal-u-pr-4 teal-u-text-right teal-u-opacity-40"
								>
									{index + 1}
								</span>
								<code className="teal-u-whitespace-pre">{line}</code>
							</div>
						))
					) : (
						<code>{code}</code>
					)}
				</pre>
			</div>
		);
	},
);
