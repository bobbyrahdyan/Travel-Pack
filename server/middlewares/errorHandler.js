const errorHandler = (err, req, res, next) => {
  console.log(err, "err handling");

  let code = 500;
  let msg = "Internal Server Error";
  // console.log(err, "<=== error");
  if (err.name == "SequelizeValidationError") {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name == "SequelizeUniqueConstraintError") {
    code = 400;
    msg = "This Email Already Registered";
  } else if (err.name == "Minimum password length must be 5 letter") {
    code = 400;
    msg = err.name;
  } else if (err.name == "Destination already in your favourites") {
    code = 400;
    msg = err.name;
  } else if (err.name == "Destination does not exist") {
    code = 400;
    msg = err.name;
  } else if (
    err.name == "User status already premium" ||
    err.name == "User status already not premium"
  ) {
    code = 400;
    msg = err.name;
  } else if (err.name == "UnknownId") {
    code = 404;
    msg = "Data Not Found";
  } else if (err.name == "User not found") {
    code = 404;
    msg = "User Not Found";
  } else if (
    err.name == "Email is required" ||
    err.name == "Password is required"
  ) {
    code = 400;
    msg = "Email and Password is Required";
  } else if (err.name == "Invalid email or password") {
    code = 401;
    msg = "Invalid Email/Password";
  } else if (
    err.name == "InvalidToken" ||
    err.name == "JsonWebTokenError" ||
    err.name == "NoTokenFound" ||
    err.name == "InvalidUser"
  ) {
    code = 401;
    msg = "Invalid Token/Authentication Failed";
  } else if (err.name == "Unauthorized") {
    code = 403;
    msg = "You are not authorized";
  } else if (err.name == "notMatchHotel") {
    code = 404;
    msg =
      "Sorry, you don't get any matched hotel. Maybe try to increase your hotel budget?";
  } else if (err.name == "notMatchDestination") {
    code = 404;
    msg =
      "Sorry, you don't get any matched destination. Maybe try to increase your destination budget or lower your number of destination?";
  } else if (err.name == "numberOfDestinationMinus") {
    code = 400;
    msg =
      "Number of destination must be equal or higher than selected destinations";
  } else if (err.name === "City does not exist") {
    code = 404;
    msg = "Sorry, not found city";
  } else if (err.name === "notMatchReview") {
    code = 404;
    msg = "Sorry, not found review for this destination";
  } else if (
    err.name === "Destination Not Found" ||
    err.name === "Hotel Not Found"
  ) {
    [code, msg] = [404, err.name];
  } else if (err.name === "travelDataStepEmpty") {
    code = 400;
    msg = "Travel step data cannot be empty";
  } else if (err.name == "notMatchProvince") {
    code = 404;
    msg = "Sorry, you don't get any matched province.";
  } else if (err.message == "No recipients defined") {
    code = 500;
    msg = "Error Sending Mail";
  } else if (err.name == "Topic Not Found") {
    code = 404;
    msg = "Sorry, you don't get any matched topic.";
  } else if (err.name == "Title/ Topic required") {
    code = 400;
    msg = "Title or Topic is required";
  }

  res.status(code).json({ msg });
};

module.exports = errorHandler;
