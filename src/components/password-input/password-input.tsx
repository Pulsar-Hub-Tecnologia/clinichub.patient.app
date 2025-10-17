import { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Eye, EyeClosed, Info, Lock, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
}

interface PasswordStrengthResult {
  isValid: boolean;
  lengthValid: boolean;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  strengthLength: number;
  strengthText: string;
  errors: string[];
}

const PASSWORD_RULES = [
  {
    key: "lengthValid",
    test: (v: string) => v.length >= 8 && v.length <= 70,
    message: "A senha deve conter entre 8 e 70 caracteres."
  },
  {
    key: "hasLowerCase",
    test: (v: string) => /[a-z]/.test(v),
    message: "A senha deve conter pelo menos uma letra minúscula (a-z)."
  },
  {
    key: "hasUpperCase",
    test: (v: string) => /[A-Z]/.test(v),
    message: "A senha deve conter pelo menos uma letra maiúscula (A-Z)."
  },
  {
    key: "hasNumber",
    test: (v: string) => /[0-9]/.test(v),
    message: "A senha deve conter pelo menos um número (0-9)."
  },
  {
    key: "hasSymbol",
    test: (v: string) => /[!@#$*]/.test(v),
    message: "A senha deve conter pelo menos um símbolo (!@#$*)."
  }
] as const;

function evaluatePasswordStrength(value: string): PasswordStrengthResult {
  const result: PasswordStrengthResult = {
    isValid: true,
    lengthValid: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSymbol: false,
    strengthLength: 0,
    strengthText: "Muito Fraca",
    errors: []
  };

  for (const rule of PASSWORD_RULES) {
    const passed = rule.test(value);
    (result as any)[rule.key] = passed;
    if (passed) {
      result.strengthLength++;
    } else {
      result.isValid = false;
      result.errors.push(rule.message);
    }
  }

  if (result.strengthLength > 2 && result.strengthLength <= 4) {
    result.strengthText = "Fraca";
  } else if (result.strengthLength > 4) {
    result.strengthText = "Forte";
  }

  return result;
}

const STRENGTH_COLORS = ["bg-gray-300", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-green-500"];

export default function PasswordInput({ label, value, ...rest }: PasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const passwordStrength = useMemo(
    () => evaluatePasswordStrength(String(value)),
    [value]
  );

  const getBarColor = (barIndex: number) => {
    const level = passwordStrength.strengthLength;
    if (level < barIndex) return STRENGTH_COLORS[0];
    return STRENGTH_COLORS[Math.min(level, STRENGTH_COLORS.length - 1)];
  };

  return (
    <div>
      {label && <Label htmlFor="password">{label}</Label>}

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input id="password" type={passwordVisible ? "text" : "password"} placeholder="Crie uma senha" className="pl-10" value={value} {...rest} />
        <div onClick={() => setPasswordVisible(prev => !prev)}>
          {passwordVisible ? (
            <EyeClosed className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
          ) : (
            <Eye
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
            />
          )}
        </div>
      </div>

      <div className="flex space-x-1 mt-2">
        {[1, 2, 4].map((threshold, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full", getBarColor(threshold))} />
        ))}
      </div>

      <div className="flex flex-row gap-2 mt-1">
        <p className="text-xs text-gray-500">Força da senha: {passwordStrength.strengthText}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <Info size={16} />
            </TooltipTrigger>
            <TooltipContent className="bg-accent text-foreground border">
              <div className="space-y-2">
                <h2 className="text-sm">Sua senha deve conter:</h2>
                <div>
                  {PASSWORD_RULES.map((rule) => {
                    const passed = (passwordStrength as any)[rule.key];
                    return (
                      <div key={rule.key} className="flex flex-row gap-2">
                        {passed ? <Check size={20} className="text-green-500" /> : <X size={20} className="text-red-500" />}
                        <p className={cn("text-xs", passed ? "text-green-500" : "text-red-500")}>{rule.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
