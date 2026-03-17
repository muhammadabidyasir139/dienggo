"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
    label: string;
    error?: string;
    helpText?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
    type: "text" | "number" | "email" | "password" | "date" | "url";
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
    type: "textarea";
    rows?: number;
}

type FormFieldProps = InputProps | TextareaProps;

export default function FormField(props: FormFieldProps) {
    const { label, error, helpText, type, className = "", ...rest } = props;

    const baseClasses =
        "w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow disabled:bg-slate-50 disabled:text-slate-500";
    const errorClasses = error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-300";

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>

            {type === "textarea" ? (
                <textarea
                    {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={`${baseClasses} ${errorClasses} ${className}`}
                />
            ) : (
                <input
                    type={type}
                    {...(rest as InputHTMLAttributes<HTMLInputElement>)}
                    className={`${baseClasses} ${errorClasses} ${className}`}
                />
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            {helpText && !error && <p className="text-sm text-slate-500">{helpText}</p>}
        </div>
    );
}
