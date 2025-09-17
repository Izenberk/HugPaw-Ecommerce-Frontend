import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function VerificationForm({
  length = 4,
  onlyNumber = true,
  onChange,
  onComplete,
}) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const normalize = (str) => {
    let s = str || "";
    if (onlyNumber) s = s.replace(/\D/g, "");
    return s.slice(0, 1);
  };
  const emit = (next) => {
    setValues(next);
    const code = next.join("");
    onChange && onChange(code);
    if (next.every((v) => v.length === 1)) onComplete && onComplete(code);
  };

  const handleChange = (index, e) => {
    const char = normalize(e.target.value);
    const next = [...values];
    next[index] = char;
    emit(next);
    if (char && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index, e) => {
    const raw = e.clipboardData.getData("text") || "";
    const cleaned = onlyNumber ? raw.replace(/\D/g, "") : raw;
    if (!cleaned) return;
    e.preventDefault();

    const next = [...values];
    for (let i = 0; i < cleaned.length && index + i < length; i++) {
      next[index + i] = normalize(cleaned[i]);
    }
    emit(next);
    const last = Math.min(index + cleaned.length - 1, length - 1);
    inputRefs.current[last]?.focus();
  };
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>Fill your OTP</CardDescription>
          </CardHeader>

          <CardContent>
            <label className="sr-only" htmlFor="otp-group">
              OTP
            </label>
            <div
              id="otp-group"
              className="flex justify-center items-center gap-3"
              aria-label="OTP input group"
            >
              {Array.from({ length }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  value={values[i]}
                  onChange={(e) => handleChange(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={(e) => handlePaste(i, e)}
                  inputMode={onlyNumber ? "numeric" : "text"}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl"
                  autoComplete="one-time-code"
                  placeholder="•"
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 justify-center">
            <Button disabled={values.join("").length < length}>
              <Link to="/resetpassword">Verify</Link>
            </Button>
            <Button>Resend</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
