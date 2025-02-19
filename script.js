document.addEventListener('DOMContentLoaded', function () {
    const expectedKey = "Password1012120824";
    let isProcessing = false;
    let errorLogged = false;
    let scanner;

    const reverseMapping = {
        'm': 'a', 'q': 'b', 'r': 'c', 'f': 'd', 'p': 'e',
        'h': 'f', 'o': 'g', 'i': 'h', 's': 'i', 'l': 'j',
        'e': 'k', 'w': 'l', 'v': 'm', 'a': 'n', 'k': 'o',
        'n': 'p', 'g': 'q', 'z': 'r', 'c': 's', 'b': 't',
        'y': 'u', 'x': 'v', 'd': 'w', 'j': 'x', 't': 'y',
        'u': 'z', 'M': 'A', 'Q': 'B', 'R': 'C', 'F': 'D',
        'P': 'E', 'H': 'F', 'O': 'G', 'I': 'H', 'S': 'I',
        'L': 'J', 'E': 'K', 'W': 'L', 'V': 'M', 'A': 'N',
        'K': 'O', 'N': 'P', 'G': 'Q', 'Z': 'R', 'C': 'S',
        'B': 'T', 'Y': 'U', 'X': 'V', 'D': 'W', 'J': 'X',
        'T': 'Y', 'U': 'Z', '7': '0', '3': '1', '8': '2',
        '0': '3', '9': '4', '4': '5', '1': '6', '5': '7',
        '6': '8', '2': '9'
    };

    function decodeData(encodedData) {
        return encodedData.split('').map(char => reverseMapping[char] || char).join('');
    }

    function displayDecryptedMessage(message) {
        document.getElementById('output').textContent = message;
        document.getElementById('output').style.display = 'block';
        document.getElementById('reader').style.display = 'none';
        document.getElementById('scanAgain').style.display = 'inline-block';
    }

    function success(decodedText) {
        if (isProcessing) return;
        isProcessing = true;

        const decodedData = decodeData(decodedText);
        const parts = decodedData.split(',');
        const key = parts.pop();
        const message = parts.join(',');

        if (key === expectedKey) {
            displayDecryptedMessage(`Decrypted Message: ${message}`);
        } else {
            displayDecryptedMessage("Invalid QR code. Please scan a valid one.");
        }

        setTimeout(() => isProcessing = false, 1000);
    }

    function error(err) {
        if (!errorLogged) {
            console.error(err);
            errorLogged = true;
        }
    }

    function initializeScanner() {
        if (typeof Html5QrcodeScanner !== 'undefined') {
            scanner = new Html5QrcodeScanner('reader', {
                qrbox: { width: 250, height: 250 },
                fps: 10,
            });

            scanner.render(success, error);
        } else {
            console.error("Html5QrcodeScanner is not defined");
        }
    }

    document.getElementById('scanAgain').addEventListener('click', () => {
        document.getElementById('output').style.display = 'none';
        document.getElementById('reader').style.display = 'block';
        document.getElementById('scanAgain').style.display = 'none';

        if (scanner) {
            scanner.clear().then(() => {
                initializeScanner(); // Reinitialize after clearing
            }).catch(error => console.error("Error clearing scanner: ", error));
        } else {
            initializeScanner(); // Fallback if no scanner
        }
    });


    initializeScanner();
});