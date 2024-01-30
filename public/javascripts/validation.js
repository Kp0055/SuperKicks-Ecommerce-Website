//validation for sign up

function validateForm() {

    //clear message 
    console.log(' validation is working ');

    document.getElementById('firstNameError').textContent = '';
    document.getElementById('lastNameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    //get the value  

    const FirstName = document.getElementById('register-fname').value.trim();
    const LastName = document.getElementById('register-lname').value.trim();
    const Email = document.getElementById('register-email').value.trim();
    const PhoneNumber = document.getElementById('register-pname').value.trim();
    const Password = document.getElementById('register-password').value.trim();

   

    const NameRegex = /^[a-zA-Z]+$/;
    if (!NameRegex.test(FirstName)) {
        document.getElementById('firstNameError').textContent = 'invalid first name';
        return false;
    }

    if (!NameRegex.test(LastName)) {
        document.getElementById('lastNameError').textContent = 'invalid last name';
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        document.getElementById('emailError').textContent = 'invalid email';
        return false;
    }

    if (Password.length < 10) {
        document.getElementById('passwordError').textContent = 'Password must be at least 10 characters';
        return false;
    }

    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(PhoneNumber)) {
        document.getElementById('phoneError').textContent = 'invalid phone number';
        return false;
    }
    return true;
}


/// validation for login 

function loginvalidation(){



    document.getElementById('EmailError').textContent ='';
    document.getElementById('PasswordError').textContent ='';

    const Email = document.getElementById('login-email').value.trim();
    const Password = document.getElementById('login-password').value.trim();

    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!EmailRegex.test(Email)){
        document.getElementById('EmailError').textContent ='invalid Email';
        return false;
    }
    if (Password.length < 10){
        document.getElementById('PasswordError').textContent ='invalid password'
        return false;
    }
    return true;
}

///validation for  add catogery

function categoryvalidation() {


    document.getElementById('nameError').textContent = '';
    document.getElementById('DescriptionError').textContent = '';
    document.getElementById('fileError').textContent = '';

    const name = document.getElementById('name').value.trim();
    const Description = document.getElementById('Description').value.trim();
    const fileInput = document.getElementById('customFile');

    const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;
    if (!nameRegex.test(name)) {
        document.getElementById('nameError').textContent = 'Invalid name format';
        return false;
    }

    const descriptionRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*/;
    if (!descriptionRegex.test(Description)) {
        document.getElementById('DescriptionError').textContent = 'Invalid description format';
        return false;
    }

    // Validate Image Upload
    if (fileInput.files.length === 0) {
        document.getElementById('fileError').textContent = 'Image is required';
        return false;
    }

    // Check if the selected file has a valid image extension
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileName = fileInput.files[0].name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (!allowedImageExtensions.includes(fileExtension)) {
        document.getElementById('fileError').textContent = 'Invalid image file. Please upload a file with a valid image extension (jpg, jpeg, png, gif).';
        return false;
    }

    return true;
}


///product validation 

function productvalidation() {

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
  if (!/^\d+$/.test(stock) || stock <= 0) {
    document.getElementById("StockError").textContent =
      "Please enter a valid stock quantity";
    return false;
  }

  // Validate price 
  if (!/^\d+(\.\d{1,2})?$/.test(price) || price <= 0) {
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
  if (!/^\d+$/.test(discount) || discount < 0 || discount > 100) {
    document.getElementById("DiscountError").textContent =
      "Please enter a valid category discount percentage";
    return false;
  }
 // Check if no files are selected
if (!fileInput.files.length) {
  document.getElementById("fileError").textContent = "Image is required";
  return false;
}

// Check if the selected files have valid image extensions
const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

for (let i = 0; i < fileInput.files.length; i++) {
  const fileName = fileInput.files[i].name;
  const fileExtension = fileName.split(".").pop().toLowerCase();

  if (!allowedImageExtensions.includes(fileExtension)) {
    document.getElementById("fileError").textContent =
      "Invalid image file. Please upload files with valid image extensions (jpg, jpeg, png, gif).";
    return false;
  }
}

// All checks passed, no errors
return true;

}
///password validation 


function forgetpasswordvalidation(){


  document.getElementById('passwordError').textContent ='';
  document.getElementById('ConfirmpasswordError').textContent ='';

  const password = document.getElementById('login-email').value.trim();
  const confirmPassword = document.getElementById('login-password').value.trim();

  if (password.length < 10){
    document.getElementById('passwordError').textContent ='invalid password'
    return false;
}
  
  if (confirmPassword.length < 10){
      document.getElementById('ConfirmpasswordError').textContent ='invalid password'
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

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const pinInput = document.getElementById('pin');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const localityInput = document.getElementById('locality');
  const addressInput = document.getElementById('address');
  const landmarkInput = document.getElementById('landmark');
  const alternativeInput = document.getElementById('alternative');

  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const pinError = document.getElementById('pinError');
  const cityError = document.getElementById('cityError');
  const stateError = document.getElementById('stateError');
  const localityError = document.getElementById('localityError');
  const addressError = document.getElementById('addressError');
  const landmarkError = document.getElementById('landmarkError');
  const alternativeError = document.getElementById('alternativeError');

  // Reset error messages
  nameError.textContent = '';
  phoneError.textContent = '';
  pinError.textContent = '';
  cityError.textContent = '';
  stateError.textContent = '';
  localityError.textContent = '';
  addressError.textContent = '';
  landmarkError.textContent = '';
  alternativeError.textContent = '';

  // Trim and validate Name
  const trimmedName = nameInput.value.trim();
  if (!nameRegex.test(trimmedName)) {
    nameError.textContent = 'Invalid name. Please enter a valid name.';
    return false;
  }

  // Trim and validate Phone
  const trimmedPhone = phoneInput.value.trim();
  if (!phoneRegex.test(trimmedPhone)) {
    phoneError.textContent = 'Invalid phone number. Please enter a 10-digit phone number.';
    return false;
  }

  // Trim and validate Pincode
  const trimmedPin = pinInput.value.trim();
  if (!pincodeRegex.test(trimmedPin)) {
    pinError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }
  const trimmedCity = cityInput.value.trim();
  if (!cityRegex.test(trimmedCity)) {
    cityError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }
  const trimmedState = stateInput.value.trim();
  if (!stateRegex.test(trimmedState)) {
    stateError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }
  const trimmedLocality = localityInput.value.trim();
  if (!localityRegex.test(trimmedLocality)) {
    localityError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }

  // Trim and validate Address
  const trimmedAddress = addressInput.value.trim();
  if (!addressRegex.test(trimmedAddress)) {
    addressError.textContent = 'Invalid address. Please enter a valid address.';
    return false;
  }
  const trimmedLandmark = landmarkInput.value.trim();
  if (!landmarkRegex.test(trimmedLandmark)) {
    landmarkError.textContent = 'Invalid address. Please enter a valid address.';
    return false;
  }
  const trimmedAlternative = alternativeInput.value.trim();
  if (!alternativeRegex.test(trimmedAlternative)) {
    alternativeError.textContent = 'Invalid address. Please enter a valid address.';
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

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const pinInput = document.getElementById('pin');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const localityInput = document.getElementById('locality');
  const addressInput = document.getElementById('address');
  const landmarkInput = document.getElementById('landmark');
  const alternativeInput = document.getElementById('alternative');

  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const pinError = document.getElementById('pinError');
  const cityError = document.getElementById('cityError');
  const stateError = document.getElementById('stateError');
  const localityError = document.getElementById('localityError');
  const addressError = document.getElementById('addressError');
  const landmarkError = document.getElementById('landmarkError');
  const alternativeError = document.getElementById('alternativeError');

  // Reset error messages
  nameError.textContent = '';
  phoneError.textContent = '';
  pinError.textContent = '';
  cityError.textContent = '';
  stateError.textContent = '';
  localityError.textContent = '';
  addressError.textContent = '';
  landmarkError.textContent = '';
  alternativeError.textContent = '';

  // Trim and validate Name
  const trimmedName = nameInput.value.trim();
  if (!nameRegex.test(trimmedName)) {
    nameError.textContent = 'Invalid name. Please enter a valid name.';
    return false;
  }

  // Trim and validate Phone
  const trimmedPhone = phoneInput.value.trim();
  if (!phoneRegex.test(trimmedPhone)) {
    phoneError.textContent = 'Invalid phone number. Please enter a 10-digit phone number.';
    return false;
  }

  // Trim and validate Pincode
  const trimmedPin = pinInput.value.trim();
  if (!pincodeRegex.test(trimmedPin)) {
    pinError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }
  const trimmedCity = cityInput.value.trim();
  if (!cityRegex.test(trimmedCity)) {
    cityError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }
  const trimmedState = stateInput.value.trim();
  if (!stateRegex.test(trimmedState)) {
    stateError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }
  const trimmedLocality = localityInput.value.trim();
  if (!localityRegex.test(trimmedLocality)) {
    localityError.textContent = 'Invalid pincode. Please enter a 6-digit pincode.';
    return false;
  }

  // Trim and validate Address
  const trimmedAddress = addressInput.value.trim();
  if (!addressRegex.test(trimmedAddress)) {
    addressError.textContent = 'Invalid address. Please enter a valid address.';
    return false;
  }
  const trimmedLandmark = landmarkInput.value.trim();
  if (!landmarkRegex.test(trimmedLandmark)) {
    landmarkError.textContent = 'Invalid address. Please enter a valid address.';
    return false;
  }
  const trimmedAlternative = alternativeInput.value.trim();
  if (!alternativeRegex.test(trimmedAlternative)) {
    alternativeError.textContent = 'Invalid address. Please enter a valid address.';
    return false;
  }

  // You can add more validations for other fields if needed.

  return true; // Submit the form if all validations pass
}





    
