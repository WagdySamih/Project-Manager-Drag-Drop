interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  error: string
}

export function validate(input: Validatable) {
  let isValid: boolean = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length > 0;
  }
  if (input.maxLength && typeof input.value === "string") {
    isValid = isValid && input.value.trim().length <= input.maxLength;
  }
  if (input.minLength && typeof input.value === "string") {
    isValid = isValid && input.value.trim().length >= input.minLength;
  }
  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }

  return isValid;
}
