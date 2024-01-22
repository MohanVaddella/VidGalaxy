import { authenticate } from "./helper";

/** validate register page  */

export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  confirmPasswordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

// validate username
function usernameVerify(errors = {}, values) {
  if (!values.username) {
    errors.username = "Username Required...!";
  } else if (values.username.includes(" ")) {
    errors.username = "Invalid Username...!";
  }

  return errors;
}

// Validate password
async function passwordVerify(errors = {}, values) {
  if (!values.password) {
    errors.password = "Password is required...!";
  } else if (values.password.includes(" ")) {
    errors.password = "Wrong Password...!";
  } else if (values.password.length < 8) {
    errors.password = "Password must be more than 8 characters";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*%])[A-Za-z\d!@#$&*%]{8,14}$/.test(
      values.password
    )
  ) {
    errors.password = "Password must have special characters...!";
  }
  return errors;
}

// validate confirmPassword
function confirmPasswordVerify(errors = {}, values) {
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required...!";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match...!";
  }
  return errors;
}

// validate email
function emailVerify(errors = {}, values) {
  if (!values.email) {
    errors.email = "Email Required...!";
  } else if (values.email.includes(" ")) {
    errors.email = "Wrong Email...!";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address...!";
  }

  return errors;
}

/** validate login page */

export async function loginValidation(values) {
  const errors = {};
  usernameValidate(errors, values);
  passwordValidate(errors, values);

  return errors;
}
// validate login page username
async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    // check user exist or not
    const { status } = await authenticate(values.username);

    if (status !== 201) {
      errors.exist = "User does not exist...!";
    }
  }

  return errors;
}

// validate password
async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  if (values.password) {
    // check password correct or not
    const { status } = await authenticate(values.password);

    if (status !== 201) {
      errors.exist = "Wrong Password...!";
    }
  }

  return errors;
}

/** validate change password page */

// validate reset password
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirmPassword) {
    errors.exist = "Password not match...!";
  }

  return errors;
}

/** validate profile page */

// validate profile
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}


export async function uploadValidation(values) {
  const errors = {};

  titleVerify(errors, values);
  videoFileVerify(errors, values);

  return errors;
}

// Validate title
function titleVerify(errors = {}, values) {
  if (!values.title) {
    errors.title = "Title is required...!";
  } else if (values.title.length > 100) {
    errors.title = "Title must be less than 100 characters...!";
  }

  return errors;
}

// Validate video file upload
function videoFileVerify(errors = {}, values) {
  if (!values.videoFile) {
    errors.videoFile = "Video file is required...!";
  } else {
    // You can add additional checks for the video file if needed
    const allowedFormats = ['mp4'];
    const fileExtension = values.videoFile.name.split('.').pop().toLowerCase();

    if (!allowedFormats.includes(fileExtension)) {
      errors.videoFile = "Invalid video file format. Only MP4 files are allowed...!";
    }
  }

  return errors;
}

