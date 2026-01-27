"use client";
import React from "react";

type ButtonProps = {
	label?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	type?: "button" | "submit" | "reset";
	className?: string;
	disabled?: boolean;
	children?: React.ReactNode;
	imageDefault?: string;
	imageHover?: string;
	imageAlt?: string;
};

const Button: React.FC<ButtonProps> = ({
	label,
	onClick,
	type = "button",
	className = "",
	disabled = false,
	children,
	imageDefault,
	imageHover,
	imageAlt = "button",
}) => {
	const [isHovered, setIsHovered] = React.useState(false);
	const base =
		"inline-flex items-center justify-center rounded-md w-48 h-32 text-sm font-medium bg-black text-white border-4 border-white hover:bg-white hover:text-black hover:border-black focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed";

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${base} ${className}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{imageDefault && imageHover ? (
				<img
					src={isHovered ? imageHover : imageDefault}
					alt={imageAlt}
					className="w-20 h-20 transition-all duration-200"
				/>
			) : (
				label ?? children
			)}
		</button>
	);
};



export default Button;