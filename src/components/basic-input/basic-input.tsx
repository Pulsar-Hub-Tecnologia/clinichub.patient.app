import { ReactNode, useState } from "react";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type BasicInputProps =
  | (React.ComponentPropsWithoutRef<"input"> & {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    useTextArea?: false;
    className?: string;
  })
  | (React.ComponentPropsWithoutRef<"textarea"> & {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: undefined;
    useTextArea: true;
    className?: string;
  });

const BasicInput = (props: BasicInputProps) => {
  const { label, error, leftIcon, rightIcon, useTextArea, className, value, ...rest } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inputProps = !useTextArea ? rest as React.ComponentPropsWithoutRef<"input"> : undefined;
  const textareaProps = useTextArea ? rest as React.ComponentPropsWithoutRef<"textarea"> : undefined;

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={rest.id}>{label}</Label>
      )}
      <div className="relative">
        {leftIcon}
        {useTextArea ? (
          <Textarea
            id={rest.id}
            className={cn(
              leftIcon && "pl-9",
              className
            )}
            {...textareaProps}
          />
        ) : (
          <Input
            id={rest.id}
            value={value || ""}
            className={cn(
              leftIcon && "pl-9",
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            onFocus={() => setIsFocused(true)}
            {...inputProps}
          />
        )}
        {rightIcon}
      </div>
      {error && (
        <div
          className={cn(
            'absolute w-full text-red-500 text-sm overflow-hidden transition-all duration-300 ease-in-out',
            isFocused
              ? 'translate-y-full opacity-100'
              : 'top-full opacity-100'
          )}
          style={{ transform: error ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default BasicInput