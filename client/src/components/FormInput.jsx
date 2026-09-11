import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  maxLength,
  inputMode,
  error,
}) {
  const { t } = useTranslation();
  const errorId = `${id}-error`;
  const [isRevealed, setIsRevealed] = useState(false);

  const isPasswordType = type === "password";
  const resolvedType = isPasswordType && isRevealed ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-pf-ink-dim tracking-wide"
      >
        {label}{" "}
        {required && (
          <span className="text-pf-coral" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`border bg-pf-bg text-pf-ink px-3 py-2.5 rounded-lg font-medium text-[14px] w-full transition-all ease-in-out focus:outline-2 focus:outline-pf-teal focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
            isPasswordType ? "pr-11" : ""
          } ${error ? "border-pf-coral" : "border-pf-border"}`}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setIsRevealed((v) => !v)}
            disabled={disabled}
            aria-pressed={isRevealed}
            aria-label={isRevealed ? t("common.hide") : t("common.show")}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-pf-ink-faint hover:text-pf-ink-dim disabled:opacity-50"
          >
            {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-[11px] font-medium text-pf-coral"
        >
          {t(error)}
        </p>
      )}
    </div>
  );
}
