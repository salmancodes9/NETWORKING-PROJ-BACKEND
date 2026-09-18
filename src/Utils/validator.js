const normalizeValue = (value) => {
  if (typeof value === "string") return value.trim();
  return value;
};

const formatLabel = (fieldName) => {
  const label = String(fieldName)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return label.charAt(0).toUpperCase() + label.slice(1);
};

const validateRequired = (fieldName, value, options = {}) => {
  const label = options.label || formatLabel(fieldName);
  const normalizedValue = normalizeValue(value);

  if (
    normalizedValue === undefined ||
    normalizedValue === null ||
    String(normalizedValue).trim() === ""
  ) {
    return `${label} is required`;
  }

  if (
    options.minLength &&
    String(normalizedValue).trim().length < options.minLength
  ) {
    return `${label} must be at least ${options.minLength} characters`;
  }

  if (
    options.maxLength &&
    String(normalizedValue).trim().length > options.maxLength
  ) {
    return `${label} must be at most ${options.maxLength} characters`;
  }

  return null;
};

const validateEmail = (email) => {
  const normalizedValue = normalizeValue(email);

  if (
    normalizedValue === undefined ||
    normalizedValue === null ||
    String(normalizedValue).trim() === ""
  ) {
    return "Email is required";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(normalizedValue).trim())) {
    return "Please enter a valid email address";
  }

  return null;
};

const validatePassword = (password) => {
  const normalizedValue = normalizeValue(password);

  if (
    normalizedValue === undefined ||
    normalizedValue === null ||
    String(normalizedValue).trim() === ""
  ) {
    return "Password is required";
  }

  if (String(normalizedValue).trim().length < 8) {
    return "Password must be at least 8 characters long";
  }

  return null;
};

const validateField = (fieldName, value, config = {}) => {
  const normalizedValue = normalizeValue(value);
  const { required = false, minLength, maxLength, label } = config;

  if (fieldName === "email") return validateEmail(normalizedValue);
  if (fieldName === "password") return validatePassword(normalizedValue);

  if (required) {
    const requiredError = validateRequired(fieldName, normalizedValue, {
      label,
      minLength,
      maxLength,
    });
    if (requiredError) return requiredError;
  }

  if (minLength && String(normalizedValue || "").trim().length < minLength) {
    return `${label || formatLabel(fieldName)} must be at least ${minLength} characters`;
  }

  if (maxLength && String(normalizedValue || "").trim().length > maxLength) {
    return `${label || formatLabel(fieldName)} must be at most ${maxLength} characters`;
  }

  return null;
};

const validateSignupInput = (data = {}) => {
  const cleanedData = { ...data };
  const errors = {};

  const name = normalizeValue(data.name);
  const email = normalizeValue(data.email);
  const password = normalizeValue(data.password);
  const role = normalizeValue(data.role);
  const companyName = normalizeValue(data.companyName);

  if (name) {
    cleanedData.name = name;
  }

  if (!email) {
    errors.email = "Email is required";
  } else {
    cleanedData.email = String(email).toLowerCase();
    const emailError = validateEmail(cleanedData.email);
    if (emailError) {
      errors.email = emailError;
    }
  }

  if (!password) {
    errors.password = "Password is required";
  } else {
    cleanedData.password = password;
    const passwordError = validatePassword(cleanedData.password);
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  cleanedData.role = role ? String(role).toLowerCase() : "member";
  if (role && !["member", "company"].includes(cleanedData.role)) {
    errors.role = "Role must be either member or company";
  }

  if (cleanedData.role === "company") {
    if (!companyName) {
      errors.companyName = "Company name is required";
    } else {
      cleanedData.companyName = companyName;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    cleaned: cleanedData,
    errors,
  };
};

const validateLoginInput = (data = {}) => {
  const cleanedData = {};
  const errors = {};

  const email = normalizeValue(data.email);
  const password = normalizeValue(data.password);

  if (!email) {
    errors.email = "Email is required";
  } else {
    cleanedData.email = String(email).toLowerCase();
    const emailError = validateEmail(cleanedData.email);
    if (emailError) {
      errors.email = emailError;
    }
  }

  if (!password) {
    errors.password = "Password is required";
  } else {
    cleanedData.password = password;
    if (String(password).trim().length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    cleaned: cleanedData,
    errors,
  };
};

module.exports = {
  normalizeValue,
  formatLabel,
  validateRequired,
  validateEmail,
  validatePassword,
  validateField,
  validateSignupInput,
  validateLoginInput,
};
