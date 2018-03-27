
function inputToImage(input, img) {
    return new Promise((resolve, reject) => { 
        let reader = new FileReader()
        if (!img)
            img = document.createElement("img");
        reader.onloadend = function() {
            img.src = reader.result;
            resolve(img);
        }
        reader.onerror = reader.onabort = (e) => reject(e);
        reader.readAsDataURL(input.files[0]);
    });
}

function imageToCanvas(img, canvas, xresize, yresize) {

    if(!canvas)
        canvas = document.createElement('canvas');
    
    return new Promise( function (resolve, reject) {
        let loadCanvas = function () {
            canvas.height = yresize || img.height;
            canvas.width = xresize || img.width;

            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            return resolve(canvas);
        }
        if(!img.complete)
            img.onload = loadCanvas();  // race condition?
        else
            loadCanvas();

    });
}

function inputToCanvas(input, canvas, width, height) {
    return inputToImage(input)
            .then((img) => imageToCanvas(img, canvas, width, height)
        );
}


function canvasToHTML(canvas, text) {
    let context = canvas.getContext("2d");
    let textIndex = 0;
    let HTMLOut = "";

    text = text.replace(/\s/g,'');

    for(let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let imgData=context.getImageData(x,y,1,1);

            HTMLOut += "<span style='color: rgb(" + imgData.data[0] +  "," +  imgData.data[1] + "," +  imgData.data[2] + ")'>" + text.charAt(textIndex) + "</span>";   // Possible improvement for continuous pixels.

            textIndex = (textIndex + 1) % text.length;
        }
        HTMLOut += "<br>";
    }
    return "<div style='background-color: black;'>" + HTMLOut + "</div>";
}

function canvasToText(canvas, text) {
    let context = canvas.getContext("2d");
    let textIndex = 0;
    let textOut = "";


    for(let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let imgData=context.getImageData(x,y,1,1);
            index = Math.round( (imgData.data[0] + imgData.data[1] + imgData.data[2]) / (255*3) * (text.length-1) ) ;
            textOut += text[index];
        }
        textOut += "\n";
    }

    return "<pre>" + textOut + "</pre>";
}

