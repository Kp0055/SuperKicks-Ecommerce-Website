

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
      // Show SweetAlert to notify the user   
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: 'The product has been successfully added to your cart.'
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
  }

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

  // Perform a fetch to update the quantity in the database
  fetch("/update-cart-quantity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity: newQuantity })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
        window.location.reload();
        console.log("Quantity updated successfully");
    } else if (data.message) {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.innerHTML = data.message;
    } else {
       
        window.location.reload(); 
    }
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
          
          var selectedStatus = document.getElementById('status').value;

          
          fetch(`/admin/update_status/${OrderId}/${ProductId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: selectedStatus }),
          })
              .then(response => response.json())
              .then(data => {
                  console.log('Success:', data);
                
                  Swal.fire({
                      icon: 'success',
                      title: 'Status Updated Successfully',
                      showConfirmButton: false,
                      timer: 1500
                  });
                 
                  window.location.href = '/admin/OrderList';
              })
              .catch((error) => {
                  console.error('Error:', error);
                  // If there's an error during status update, show a failure message
                  Swal.fire({
                      icon: 'error',
                      title: 'Status Update Failed',
                      text: 'An error occurred while updating the status. Please try again later.',
                  });
                  // Handle errors, if needed
              });
      }
  });
}


  function checkbox(selectedProduct_Id, isChecked) {
    fetch(`/cartSelect/${selectedProduct_Id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isChecked: isChecked })
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


// addWallet  Money


function addWalletMoney(profileId) {
  var amount = document.getElementById('amount').value; // Get the amount entered by the user

  var dataToSend = {
      amount: amount
  };

  fetch(`/add_Wallet/${profileId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Specify the content type of the request body
          // Add any additional headers as needed
      },
      body: JSON.stringify(dataToSend) // Convert the data to JSON format
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data); // Log the response data for debugging purposes
      // Display SweetAlert success message
      Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Amount has been added to the wallet',
      });
  })
  .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
      // Display SweetAlert error message
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a problem adding amount to the wallet',
      });
  });
}



function withDrawal(profileId) {
  var amount = document.getElementById('amount').value; // Get the amount entered by the user

  var dataToSend = {
      amount: amount
  };

  fetch(`/withdrawel/${profileId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Specify the content type of the request body
          // Add any additional headers as needed
      },
      body: JSON.stringify(dataToSend) // Convert the data to JSON format
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data); // Log the response data for debugging purposes
      // Display SweetAlert success message
      Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'THE AMOUNT HAS BEEN SENT TO YOUR BANK ACCOUNT ',
      });
  })
  .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
      // Display SweetAlert error message
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a problem adding amount to the wallet',
      });
  });
}








  












