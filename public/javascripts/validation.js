//validation for sign up

function signupvalidateForm() {

  var firstName = document.getElementById('register-fname').value;
  var lastName = document.getElementById('register-lname').value;
  var email = document.getElementById('register-email').value;
  var phoneNumber = document.getElementById('register-pname').value;
  var password = document.getElementById('register-password').value;
  var confirmPassword = document.getElementById('confirm-password').value;

  // Regular expressions for validation
  var nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  var emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  var phoneRegex = /^\d{10}$/; // for 10 digit phone number
  var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number

  // Validation 

  

  if (!nameRegex.test(firstName)) {
      document.getElementById('firstNameError').innerText = "Invalid first name";
      return false;
  }
  if (!nameRegex.test(lastName)) {
      document.getElementById('lastNameError').innerText = "Invalid last name";
      return false;
  }
  if (!emailRegex.test(email)) {
      document.getElementById('emailError').innerText = "Invalid email";
      return false;
  }
  if (!phoneRegex.test(phoneNumber)) {
      document.getElementById('phoneError').innerText = "Invalid phone number";
      return false;
  }
  if (!passwordRegex.test(password)) {
      document.getElementById('passwordError').innerText = "Invalid password. Minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
      return false;
  }
  if (password !== confirmPassword) {
      document.getElementById('confirm-passwordError').innerText = "Passwords do not match";
      return false;
  }

  // If all validations pass
  return true;
}



/// validation for login

function loginvalidation() {
  document.getElementById("EmailError").textContent = "";
  document.getElementById("PasswordError").textContent = "";

  const Email = document.getElementById("login-email").value.trim();
  const Password = document.getElementById("login-password").value.trim();

  const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EmailRegex.test(Email)) {
    document.getElementById("EmailError").textContent = "invalid Email";
    return false;
  }
  if (Password.length < 10) {
    document.getElementById("PasswordError").textContent = "invalid password";
    return false;
  }
  return true;
}

///validation for  add catogery

function categoryvalidation() {
  document.getElementById("nameError").textContent = "";
  document.getElementById("DescriptionError").textContent = "";
  document.getElementById("fileError").textContent = "";

  const name = document.getElementById("name").value.trim();
  const Description = document.getElementById("Description").value.trim();
  const fileInput = document.getElementById("customFile");

  const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;
  if (!nameRegex.test(name)) {
    document.getElementById("nameError").textContent = "Invalid name format";
    return false;
  }

  const descriptionRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;
  if (!descriptionRegex.test(Description)) {
    document.getElementById("DescriptionError").textContent =
      "Invalid description format";
    return false;
  }

  // Validate Image Upload
  if (fileInput.files.length === 0) {
    document.getElementById("fileError").textContent = "Image is required";
    return false;
  }

  // Check if the selected file has a valid image extension
  const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];
  const fileName = fileInput.files[0].name;
  const fileExtension = fileName.split(".").pop().toLowerCase();

  if (!allowedImageExtensions.includes(fileExtension)) {
    document.getElementById("fileError").textContent =
      "Invalid image file. Please upload a file with a valid image extension (jpg, jpeg, png, gif).";
    return false;
  }

  return true;
}

///product validation
// 
function productvalidation() {
  // e.preventDefault()


  // Reset error messages
 
  document.getElementById("nameError").textContent = "";

  document.getElementById("DescriptionError").textContent = "";

  document.getElementById("StockError").textContent = "";

  document.getElementById("PriceError").textContent = "";

  document.getElementById("colorError").textContent = "";

  document.getElementById("DiscountError").textContent = "";

  document.getElementById("fileError").textContent = "";

  document.getElementById("cropfileError").textContent = "";

  // Get form input values

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("Description").value.trim();
  const stock = document.getElementById("Stock").value.trim();
  const price = document.getElementById("Price").value.trim();
  const color = document.getElementById("color").value.trim();
  const discount = document.getElementById("Discount").value.trim();
  const fileInput = document.getElementById("image");
  const cropInput = document.getElementById("cropimage");

  // Validate name
  const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;

  if (!nameRegex.test(name)) {
    document.getElementById("nameError").textContent = "Invalid name format";
    return false;
  }

  // Validate description
  const descriptionRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;

  if (!descriptionRegex.test(description)) {
    document.getElementById("DescriptionError").textContent =
      "Invalid description format";
    return false;
  }

  
  if (!/^\d+$/.test(stock) || stock <= 0 || stock == -1) {
    document.getElementById("StockError").textContent =
      "Please enter a valid stock quantity";
    return false;
  }

  // Validate price

  if (parseInt(price) <= 0) {
    document.getElementById("PriceError").textContent =
      "Please enter a valid category price";
    return false;
  }

  const colorRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
  
  if (!colorRegex.test(color)) {
    document.getElementById("colorError").textContent = "Invalid name format";
    return false;
  }

  // Validate discount
 
  if (
    !/^\d+$/.test(discount) ||
    discount < 0 ||
    discount > 100 ||
    discount == -1
  ) {
    document.getElementById("DiscountError").textContent =
      "Please enter a valid category discount percentage";
    return false;
  }

  // Check if no files are selected for crop image

  if (!cropInput.files.length) {
    document.getElementById("cropfileError").textContent = "Crop Image is required";
    return false;
  }

  // Check if no files are selected for main image

  if (!fileInput.files.length) {
    document.getElementById("fileError").textContent = "Main Image is required";
    return false;
  }

  // Check if the selected files have valid image extensions
  const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

  // Validate main image
  for (let i = 0; i < fileInput.files.length; i++) {
    const fileName = fileInput.files[i].name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
   
    if (!allowedImageExtensions.includes(fileExtension)) {
      document.getElementById("fileError").textContent =
        "Invalid image file. Please upload files with valid image extensions (jpg, jpeg, png, gif).";
      return false;
    }
  }

  // Validate crop image
  for (let i = 0; i < cropInput.files.length; i++) {
    const fileName = cropInput.files[i].name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    
    if (!allowedImageExtensions.includes(fileExtension)) {
      document.getElementById("cropfileError").textContent =
        "Invalid image file. Please upload files with valid image extensions (jpg, jpeg, png, gif).";
      return false;
    }
  }

  // All checks passed, no errors
  return true;
}

//edit product


function editproductvalidation() {
  // e.preventDefault()


  // Reset error messages

  document.getElementById("nameError").textContent = "";

  document.getElementById("DescriptionError").textContent = "";

  document.getElementById("StockError").textContent = "";

  document.getElementById("PriceError").textContent = "";

  document.getElementById("colorError").textContent = "";

  document.getElementById("DiscountError").textContent = "";

  document.getElementById("fileError").textContent = "";



  // Get form input values

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("Description").value.trim();
  const stock = document.getElementById("Stock").value.trim();
  const price = document.getElementById("Price").value.trim();
  const color = document.getElementById("color").value.trim();
  const discount = document.getElementById("Discount").value.trim();
  const fileInput = document.getElementById("image");


  // Validate name
  const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;

  if (!nameRegex.test(name)) {
    document.getElementById("nameError").textContent = "Invalid name format";
    return false;
  }

  // Validate description
  const descriptionRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;

  if (!descriptionRegex.test(description)) {
    document.getElementById("DescriptionError").textContent =
      "Invalid description format";
    return false;
  }

  // Validate stock
 
  if (!/^\d+$/.test(stock) || stock <= 0 || stock == -1) {
    document.getElementById("StockError").textContent =
      "Please enter a valid stock quantity";
    return false;
  }

  
  if (parseInt(price) <= 0) {
    document.getElementById("PriceError").textContent =
      "Please enter a valid category price";
    return false;
  }

  const colorRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;

  if (!colorRegex.test(color)) {
    document.getElementById("colorError").textContent = "Invalid name format";
    return false;
  }

  // Validate discount

  if (
    !/^\d+$/.test(discount) ||
    discount < 0 ||
    discount > 100 ||
    discount == -1
  ) {
    document.getElementById("DiscountError").textContent =
      "Please enter a valid category discount percentage";
    return false;
  }


  // Check if no files are selected for main image

  if (fileInput.files.length) { // Only perform validation if files are selected
    // Check if the selected files have valid image extensions
    const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];
  
    // Validate main image
    for (let i = 0; i < fileInput.files.length; i++) {
      const fileName = fileInput.files[i].name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      if (!allowedImageExtensions.includes(fileExtension)) {
        document.getElementById("fileError").textContent =
          "Invalid image file. Please upload files with valid image extensions (jpg, jpeg, png, gif).";
        return false;
      }
    }
  }
 
  // All checks passed, no errors
  return true;
}

///password validation

function forgetpasswordvalidation() {
  document.getElementById("passwordError").textContent = "";
  document.getElementById("ConfirmpasswordError").textContent = "";

  const password = document.getElementById("login-email").value.trim();
  const confirmPassword = document
    .getElementById("login-password")
    .value.trim();

  if (password.length < 10) {
    document.getElementById("passwordError").textContent = "invalid password";
    return false;
  }

  if (confirmPassword.length < 10) {
    document.getElementById("ConfirmpasswordError").textContent =
      "invalid password";
    return false;
  }
  return true;
}

///edit address validation

function validateForm() {
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\d{10}$/;
  const pincodeRegex = /^\d{6}$/;
  const cityRegex = /^[a-zA-Z\s]+$/;
  const stateRegex = /^[a-zA-Z\s]+$/;
  const localityRegex = /^[a-zA-Z\s]+$/;
  const addressRegex = /^[a-zA-Z0-9\s,.'-]*$/;
  const landmarkRegex = /^[a-zA-Z\s]+$/;
  const alternativeRegex = /^\d{10}$/;

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const pinInput = document.getElementById("pin");
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const localityInput = document.getElementById("locality");
  const addressInput = document.getElementById("address");
  const landmarkInput = document.getElementById("landmark");
  const alternativeInput = document.getElementById("alternative");

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const pinError = document.getElementById("pinError");
  const cityError = document.getElementById("cityError");
  const stateError = document.getElementById("stateError");
  const localityError = document.getElementById("localityError");
  const addressError = document.getElementById("addressError");
  const landmarkError = document.getElementById("landmarkError");
  const alternativeError = document.getElementById("alternativeError");

  // Reset error messages
  nameError.textContent = "";
  phoneError.textContent = "";
  pinError.textContent = "";
  cityError.textContent = "";
  stateError.textContent = "";
  localityError.textContent = "";
  addressError.textContent = "";
  landmarkError.textContent = "";
  alternativeError.textContent = "";

  // Trim and validate Name
  const trimmedName = nameInput.value.trim();
  if (!nameRegex.test(trimmedName)) {
    nameError.textContent = "Invalid name. Please enter a valid name.";
    return false;
  }

  // Trim and validate Phone
  const trimmedPhone = phoneInput.value.trim();
  if (!phoneRegex.test(trimmedPhone)) {
    phoneError.textContent =
      "Invalid phone number. Please enter a 10-digit phone number.";
    return false;
  }

  // Trim and validate Pincode
  const trimmedPin = pinInput.value.trim();
  if (!pincodeRegex.test(trimmedPin)) {
    pinError.textContent = "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }
  const trimmedCity = cityInput.value.trim();
  if (!cityRegex.test(trimmedCity)) {
    cityError.textContent = "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }
  const trimmedState = stateInput.value.trim();
  if (!stateRegex.test(trimmedState)) {
    stateError.textContent = "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }
  const trimmedLocality = localityInput.value.trim();
  if (!localityRegex.test(trimmedLocality)) {
    localityError.textContent =
      "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }

  // Trim and validate Address
  const trimmedAddress = addressInput.value.trim();
  if (!addressRegex.test(trimmedAddress)) {
    addressError.textContent = "Invalid address. Please enter a valid address.";
    return false;
  }
  const trimmedLandmark = landmarkInput.value.trim();
  if (!landmarkRegex.test(trimmedLandmark)) {
    landmarkError.textContent =
      "Invalid address. Please enter a valid address.";
    return false;
  }
  const trimmedAlternative = alternativeInput.value.trim();
  if (!alternativeRegex.test(trimmedAlternative)) {
    alternativeError.textContent =
      "Invalid address. Please enter a valid address.";
    return false;
  }

  // You can add more validations for other fields if needed.

  return true; // Submit the form if all validations pass
}

/// add address validation
function addressvalidateForm() {
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\d{10}$/;
  const pincodeRegex = /^\d{6}$/;
  const cityRegex = /^[a-zA-Z\s]+$/;
  const stateRegex = /^[a-zA-Z\s]+$/;
  const localityRegex = /^[a-zA-Z\s]+$/;
  const addressRegex = /^[a-zA-Z0-9\s,.'-]*$/;
  const landmarkRegex = /^[a-zA-Z\s]+$/;
  const alternativeRegex = /^\d{10}$/;

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const pinInput = document.getElementById("pin");
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const localityInput = document.getElementById("locality");
  const addressInput = document.getElementById("address");
  const landmarkInput = document.getElementById("landmark");
  const alternativeInput = document.getElementById("alternative");

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const pinError = document.getElementById("pinError");
  const cityError = document.getElementById("cityError");
  const stateError = document.getElementById("stateError");
  const localityError = document.getElementById("localityError");
  const addressError = document.getElementById("addressError");
  const landmarkError = document.getElementById("landmarkError");
  const alternativeError = document.getElementById("alternativeError");

  // Reset error messages
  nameError.textContent = "";
  phoneError.textContent = "";
  pinError.textContent = "";
  cityError.textContent = "";
  stateError.textContent = "";
  localityError.textContent = "";
  addressError.textContent = "";
  landmarkError.textContent = "";
  alternativeError.textContent = "";

  // Trim and validate Name
  const trimmedName = nameInput.value.trim();
  if (!nameRegex.test(trimmedName)) {
    nameError.textContent = "Invalid name. Please enter a valid name.";
    return false;
  }

  // Trim and validate Phone
  const trimmedPhone = phoneInput.value.trim();
  if (!phoneRegex.test(trimmedPhone)) {
    phoneError.textContent =
      "Invalid phone number. Please enter a 10-digit phone number.";
    return false;
  }

  // Trim and validate Pincode
  const trimmedPin = pinInput.value.trim();
  if (!pincodeRegex.test(trimmedPin)) {
    pinError.textContent = "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }
  const trimmedCity = cityInput.value.trim();
  if (!cityRegex.test(trimmedCity)) {
    cityError.textContent = "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }
  const trimmedState = stateInput.value.trim();
  if (!stateRegex.test(trimmedState)) {
    stateError.textContent = "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }
  const trimmedLocality = localityInput.value.trim();
  if (!localityRegex.test(trimmedLocality)) {
    localityError.textContent =
      "Invalid pincode. Please enter a 6-digit pincode.";
    return false;
  }

  // Trim and validate Address
  const trimmedAddress = addressInput.value.trim();
  if (!addressRegex.test(trimmedAddress)) {
    addressError.textContent = "Invalid address. Please enter a valid address.";
    return false;
  }
  const trimmedLandmark = landmarkInput.value.trim();
  if (!landmarkRegex.test(trimmedLandmark)) {
    landmarkError.textContent =
      "Invalid address. Please enter a valid address.";
    return false;
  }
  const trimmedAlternative = alternativeInput.value.trim();
  if (!alternativeRegex.test(trimmedAlternative)) {
    alternativeError.textContent =
      "Invalid address. Please enter a valid address.";
    return false;
  }

  return true; // Submit the form if all validations pass
}

///madal validation 

// Function to validate Name
function validateName(name) {
  let regex = /^[a-zA-Z\s]+$/;
  return regex.test(name);
}

// Function to validate Phone Number
function validatePhoneNumber(phone) {
  let regex = /^\d{10}$/;
  return regex.test(phone);
}

// Function to validate Pin Code
function validatePinCode(pin) {
  let regex = /^\d{6}$/;
  return regex.test(pin);
}

// Function to validate City
function validateCity(city) {
  let regex = /^[a-zA-Z\s]+$/;
  return regex.test(city);
}

// Function to validate State
function validateState(state) {
  let regex = /^[a-zA-Z\s]+$/;
  return regex.test(state);
}

// Function to validate Locality
function validateLocality(locality) {
  let regex = /^[a-zA-Z\s]+$/;
  return regex.test(locality);
}

// Function to validate Address
function validateAddress(address) {
  let regex = /^[a-zA-Z0-9\s,.'-]*$/;
  return regex.test(address);
}

// Function to validate Landmark
function validateLandmark(landmark) {
  let regex = /^[a-zA-Z\s]+$/;
  return regex.test(landmark);
}

// Function to validate Alternative Phone Number
function validateAlternative(alternative) {
  let regex = /^\d{10}$/;
  return regex.test(alternative);
}

function modalAddressvalidateForm() {
  let name = document.forms["editForm"]["name"].value.trim();
  let phone = document.forms["editForm"]["phone"].value.trim();
  let pin = document.forms["editForm"]["pin"].value.trim();
  let city = document.forms["editForm"]["city"].value.trim();
  let state = document.forms["editForm"]["state"].value.trim();
  let locality = document.forms["editForm"]["locality"].value.trim();
  let address = document.forms["editForm"]["address"].value.trim();
  let landmark = document.forms["editForm"]["landmark"].value.trim();
  let alternative = document.forms["editForm"]["alternative"].value.trim();

  // Basic validation
  if (name === '' || phone === '' || pin === '' || city === '' || state === '' || locality === '' || address === '' || landmark === '' || alternative === '') {
      alert('Please fill in all fields');
      return false; // Prevent form submission
  }
  
  // Validate Name
  if (!validateName(name)) {
      alert('Please enter a valid name');
      return false;
  }

  // Validate Phone Number
  if (!validatePhoneNumber(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
  }

  // Validate Pin Code
  if (!validatePinCode(pin)) {
      alert('Please enter a valid 6-digit pin code');
      return false;
  }

  // Validate City
  if (!validateCity(city)) {
      alert('Please enter a valid city');
      return false;
  }

  // Validate State
  if (!validateState(state)) {
      alert('Please enter a valid state');
      return false;
  }

  // Validate Locality
  if (!validateLocality(locality)) {
      alert('Please enter a valid locality');
      return false;
  }

  // Validate Address
  if (!validateAddress(address)) {
      alert('Please enter a valid address');
      return false;
  }

  // Validate Landmark
  if (!validateLandmark(landmark)) {
      alert('Please enter a valid landmark');
      return false;
  }

  // Validate Alternative Phone
  if (!validateAlternative(alternative)) {
      alert('Please enter a valid alternative phone');
      return false;
  }

  return true; // Allow form submission
}






