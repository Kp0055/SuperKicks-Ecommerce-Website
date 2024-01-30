const { use } = require("../../routes/admin");
require("dotenv").config();

const inputs = document.querySelectorAll(".otp-field > input");
const button = document.querySelector(".btn");

window.addEventListener("load", () => inputs[0].focus());
button.setAttribute("disabled", "disabled");

inputs[0].addEventListener("paste", function (event) {
event.preventDefault();

const pastedValue = (event.clipboardData || window.clipboardData).getData(
"text"
);
const otpLength = inputs.length;

for (let i = 0; i < otpLength; i++) {
if (i < pastedValue.length) {
inputs[i].value = pastedValue[i];
inputs[i].removeAttribute("disabled");
inputs[i].focus;
} else {
inputs[i].value = ""; // Clear any remaining inputs
inputs[i].focus;
}
}
});

inputs.forEach((input, index1) => {
input.addEventListener("keyup", (e) => {
const currentInput = input;
const nextInput = input.nextElementSibling;
const prevInput = input.previousElementSibling;

if (currentInput.value.length > 1) {
currentInput.value = "";
return;
}

if (
nextInput &&
nextInput.hasAttribute("disabled") &&
currentInput.value !== ""
) {
nextInput.removeAttribute("disabled");
nextInput.focus();
}

if (e.key === "Backspace") {
inputs.forEach((input, index2) => {
if (index1 <= index2 && prevInput) {
  input.setAttribute("disabled", true);
  input.value = "";
  prevInput.focus();
}
});
}

button.classList.remove("active");
button.setAttribute("disabled", "disabled");

const inputsNo = inputs.length;
if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
button.classList.add("active");
button.removeAttribute("disabled");

return;
}
});
});

////////////////////////////////////////////////////////////////////////////

function verifyOtp() {
// Get the entered OTP from input fields
const otp1 = document.getElementById('otp1').value;
const otp2 = document.getElementById('otp2').value;
const otp3 = document.getElementById('otp3').value;
const otp4 = document.getElementById('otp4').value;
const otp5 = document.getElementById('otp5').value;
const otp6 = document.getElementById('otp6').value;

// Combine the OTP digits
const enteredOtp = `${otp1}${otp2}${otp3}${otp4}${otp5}${otp6}`;

// Make an API request to your backend
fetch('/otpverification', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify({
      otp: enteredOtp,
  })
})
  .then(response => response.json())
  .then((data) => {
      // Handle the response from the backend
      console.log(data);

      // You can redirect, show a message, etc., based on the response
      if (data.success) {

          Swal.fire({
              title: "Good job!",
              text: "You clicked the button!",
              icon: "success",
              showCancelButton: true,
          });

          // Redirect to a success page after a delay of 2 seconds (2000 milliseconds)
          setTimeout(() => {
              window.location.href = '/login';
          }, 2000);
      } else {
          // Show an error message, redirect to a failure page, etc.
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });

}


// fetch datas

/// block list 

async function blockuser(userId) {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to do this !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then(async (result) => {

      if (result.isConfirmed) {

        const response = await fetch(`/admin/listuser/${userId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          Swal.fire({
            title: "Changed!",
            text: "Your Data has been Changed .",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ok!"
          }).then(()=>{
            window.location.reload();
          })
        } else {
          const result = await response.json();
          throw new Error(`HTTP-Error! status: ${response.status}`);
        }
      }
     
    })
   } catch (error) {
    console.error(error);
    
  }
}


// list and unlist 

async function listuser(id){
   try{
    
    const sweetalert = await Swal.fire({
      title: "Good job!",
      text: "Are You Sure",
      icon: "success",
      showCancelButton: true,
    });
    
    if (sweetalert.isConfirmed) {
      const response = await fetch(`/admin/list_unlist/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const result = await response.json();
        throw new Error(`HTTP-Error! status: ${response.status}`);
      }
    }

   }catch(error){
    console.error(error);
    res.status(500).send('internal server error')
   }
}


async function listdata(dataId){
  try{
   
   const alert = await Swal.fire({
     title: "Good job!",
     text: "You clicked the button!",
     icon: "success",
     showCancelButton: true,
   });
   
   if (alert.isConfirmed) {
     const response = await fetch(`/admin/category_list_unlist/${dataId}`, {
       method: 'POST',
     });

     if (response.ok) {
       window.location.href = "/admin/categories_list"
     } else {
       const result = await response.json();
       throw new Error(`HTTP-Error! status: ${response.status}`);
     }
   }

  }catch(error){
   console.error(error);
   res.status(500).send('internal server error')
  }
}

//delete 

async function deleteuser(deleteId) {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this  !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then(async (result) => {

      if (result.isConfirmed) {

        const response = await fetch(`/admin/delete/${deleteId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: " It has been deleted ",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ok!"
          }).then(()=>{
            window.location.reload();
          })
        } else {
          const result = await response.json();
          throw new Error(`HTTP-Error! status: ${response.status}`);
        }
      }
     
    })
   } catch (error) {
    console.error(error);
    
  }
}


///product edit image delete 

async function deleteimage(productId,indexid) {
 
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this  !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete!"
    }).then(async (result) => {

      if (result.isConfirmed) {
    
        const response = await fetch(`/admin/deleteImage/${productId}?index=${indexid}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          Swal.fire({
            title: "Changed!",
            text: "Your Data has been Changed .",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ok!"
          }).then(()=>{
            window.location.reload();
          })
        } else {
          const result = await response.json();
          throw new Error(`HTTP-Error! status: ${response.status}`);
        }
      }
     
    })
   } catch (error) {
    console.error(error);
    
  }
}

async function blockuser(userId) {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to do this !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then(async (result) => {

      if (result.isConfirmed) {

        const response = await fetch(`/admin/listuser/${userId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          Swal.fire({
            title: "Changed!",
            text: "Your Data has been Changed .",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ok!"
          }).then(()=>{
            window.location.reload();
          })
        } else {
          const result = await response.json();
          throw new Error(`HTTP-Error! status: ${response.status}`);
        }
      }
     
    })
   } catch (error) {
    console.error(error);
    
  }
}

async function getProductData(prodId) {

 
  try {
    const response = await fetch(`/product/${prodId}`, {
      method: 'POST', 
    });

    if (response.ok) {
      const productData = await response.json();
      console.log('Product Data:', productData);


    } else {
      const errorResponse = await response.json().catch(() => null);
      console.error('Error response:', errorResponse || 'Unable to parse error response');
      throw new Error(`HTTP-Error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Caught an exception:', error);
  }
};

//delete product 

async function deleteproduct(deleteid) {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      const response = await fetch(`/Delete_product/${deleteid}`, {
        method: 'POST',
      });

      if (response.ok) {
        const productData = await response.json();
        Swal.fire({
          title: 'Deleted!',
          text: 'Your item has been deleted.',
          icon: 'success',
        }).then(() => {
        
      window.location.reload();
        });
        console.log('Product Data:', productData);
      } else {
        const errorResponse = await response.json().catch(() => null);
        console.error('Error response:', errorResponse || 'Unable to parse error response');
        throw new Error(`HTTP-Error! status: ${response.status}`);
      }
    } else {
      Swal.fire('Cancelled', 'Your item is safe :)', 'info');
    }
  } catch (error) {
    console.error('Caught an exception:', error);
  }
}


// update quantity 


function updateQuantity(productId) {
  const quantityInput = document.querySelector("#quantityInput"+productId);
  const newQuantity = quantityInput.value;
// Make sure that the user entered a valid number for quantityconso
console.log(newQuantity)
  // Perform a fetch to update the quantity in the database
  fetch("/update-cart-quantity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity: newQuantity })
  })
  .then(response => response.json())
  .then(data  => {
    window.location.reload();
    // Handle response from the backend, if needed
    console.log("Quantity updated successfully");
  })
  .catch(error => {
    console.error("Error updating cart quantity:", error);
  });
}

//checkout fetch 

async function confirmDelete(addressDelete) {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this  !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then(async (result) => {

      if (result.isConfirmed) {

        const response = await fetch(`/delete_address/${addressDelete}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: " It has been deleted ",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ok!"
          }).then(()=>{
            window.location.reload();
          })
        } else {
          const result = await response.json();
          throw new Error(`HTTP-Error! status: ${response.status}`);
        }
      }
     
    })
   } catch (error) {
    console.error(error);
    
  }
}

// order cancel 

async function cancelOrder(Order, Product) {
  try {
      // Create a variable to store the user's input
      let reason = '';

      // Show an input field in the SweetAlert dialog for the user to enter the reason
      const { value: inputReason } = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to cancel this?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          input: 'text', 
          inputPlaceholder: 'Enter reason', 
          showLoaderOnConfirm: true,
          preConfirm: (input) => {
              reason = input; 
          },
          allowOutsideClick: () => !Swal.isLoading()
      });

      if (inputReason && inputReason.trim() !== '') {
          const response = await fetch(`/cancelOrder/${Order}/${Product}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reason: reason }), 
          });

          if (response.ok) {
            alert('its working')
              Swal.fire({
                  title: "Canceled!",
                  text: "It has been Canceled",
                  icon: "success",
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "OK!",
              }).then(() => {
                  window.location.reload();
              });
          } else {
              const result = await response.json();
              throw new Error(`HTTP-Error! status: ${response.status}`);
          }
      } else {
          // User clicked cancel or did not enter a reason
          console.log('Cancelled or no reason provided');
      }
  } catch (error) {
      console.error(error);
  }
}

//admin cancel


  function updateStatus(OrderId, ProductId) {
    // Display SweetAlert confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to update the status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with status update
        var selectedStatus = document.getElementById('status').value;

        // Prepare the data to be sent in the request body
     
     
        

        // Make a POST request to your server endpoint
        fetch(`/admin/update_status/${OrderId}/${ProductId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({status:selectedStatus}),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            // Handle success, if needed
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle errors, if needed
          });
      }
    });
  }

  function checkbox(selectedProduct_Id){

    alert(selectedProduct_Id)

    fetch(`/cartSelect/${selectedProduct_Id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Handle success, if needed
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle errors, if needed
      });
    }


    function status(orderId, currentStatus) {
      
      alert(currentStatus)
      var newStatus = document.querySelector('[name="orderStatus"]').value;

      alert(newStatus)
  
      fetch('/admin/status', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              orderId: orderId,
              currentStatus: currentStatus,
              newStatus: newStatus,
          }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          window.location.reload()
          console.log(data);
      })
      .catch(error => {
          // Handle error, if needed
          console.error('There was a problem with the fetch operation:', error);
      });
  }

  // payment 





  












