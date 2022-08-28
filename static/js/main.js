const container = document.querySelector(".container"),
form = document.querySelector("form"),
infoText = document.querySelector("p"),
dnNo = form.querySelector("#dnNo");

const imgArea = form.querySelector(".img-wrapper");
const uploadBtn = document.getElementById("upload");
const clearBtn = document.getElementById("clear");
const selctBtn = document.getElementById("select");
const msgArea = document.getElementById("msg");



const html5QrCode = new Html5Qrcode(/* element id */ "reader");
// File based scanning
const fileinput = document.getElementById("formFile");
fileinput.addEventListener("change", e => {
  if (e.target.files.length == 0) {
    // No file selected, ignore 
    return;
  }

  const imageFile = e.target.files[0];
  // Scan QR Code
  html5QrCode.scanFile(imageFile, true)
  .then(decodedText => {
    // success, use decodedText
    document.querySelector("img").src = URL.createObjectURL(imageFile);
    document.querySelector("img").style.display = "block";
    changeMsg("Successfully scanned", "alert-primary", "alert-danger");
    dnNo.value = decodedText
    console.log(decodedText);
  })
  .catch(err => {
    //try other way to scan
    let formData = new FormData();
    formData.append('file', imageFile);
    fetchRequest(imageFile, formData);
  });
});


function fetchRequest(file, formData){
    infoText.innerText = "Scanning...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        if(!result) {
            document.querySelector("img").style.display = "none";
            changeMsg("Couldn't scan QR Code", "alert-danger", "alert-primary");
            return;
        }
        dnNo.value = result;
        document.querySelector("img").src = URL.createObjectURL(file);
        document.querySelector("img").style.display = "block";
        changeMsg("Successfully scanned", "alert-primary", "alert-danger");
    }).catch(() => {
        document.querySelector("img").style.display = "none";
        changeMsg("Couldn't scan QR Code", "alert-danger", "alert-primary");
    });
};

function changeMsg(msgText, addType, removeType){
    infoText.innerText = msgText;
    msgArea.classList.remove(removeType);
    msgArea.classList.add(addType);
};


selctBtn.addEventListener("click", () => {
    fileinput.click();
    dnNo.value = ""
});

uploadBtn.addEventListener("click", () => {
    console.log("clicked");
});

clearBtn.addEventListener("click", () => {
    dnNo.value = "";
    document.querySelector("img").style.display = "none";
    changeMsg("Select Delivery Note image to start!", "alert-primary", "alert-danger");
});