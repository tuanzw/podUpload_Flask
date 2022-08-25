function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    $('#dnid').val(decodedText);
    console.log('Code matched = ${decodedText}', decodedResult);
}

function onScanFailure(error) {
    console.warn('Code scan error = ${error}');
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } },/* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);