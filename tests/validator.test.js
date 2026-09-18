const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateRequired,
  validateEmail,
  validatePassword,
  validateSignupInput,
  validateLoginInput,
} = require("../src/Utils/validator");

test("validateRequired rejects empty or short values", () => {
  assert.equal(
    validateRequired("name", "", { required: true }),
    "Name is required",
  );
  assert.equal(
    validateRequired("password", "123", { minLength: 8 }),
    "Password must be at least 8 characters",
  );
});

test("validateEmail rejects invalid email", () => {
  assert.equal(
    validateEmail("invalid-email"),
    "Please enter a valid email address",
  );
});

test("validatePassword rejects weak password", () => {
  assert.equal(
    validatePassword("abc"),
    "Password must be at least 8 characters long",
  );
});

test("validateSignupInput ensures required signup fields are valid", () => {
  const result = validateSignupInput({
    email: "jane@example.com",
    password: "secret123",
    role: "member",
  });

  assert.deepEqual(result, {
    isValid: true,
    cleaned: {
      email: "jane@example.com",
      password: "secret123",
      role: "member",
    },
    errors: {},
  });
});

test("validateSignupInput requires company name for company signup", () => {
  const result = validateSignupInput({
    email: "company@example.com",
    password: "secret123",
    role: "company",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.companyName, "Company name is required");
});

test("validateLoginInput checks email and password values", () => {
  const result = validateLoginInput({
    email: "user@example.com",
    password: "short",
  });
  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.password,
    "Password must be at least 8 characters",
  );
});
