$(document).ready(function () {
    var cropper;
    var cropShape = 'round'; // Početni oblik cropa (kružni)

    $("#browse_image").change(function (e) {
        var files = e.target.files;
        var done = function (url) {
            $("#display_image_data").attr("src", url);
        };

        if (files && files.length > 0) {
            var file = files[0];
            if (URL) {
                done(URL.createObjectURL(file));
            } else if (FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    done(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }

        var image = document.getElementById("display_image_data");
        var button = document.getElementById("crop_button");
        var result = document.getElementById("cropped_image_result");
        var croppable = false;
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
            ready: function () {
                croppable = true;
            }
        });

        $("#download_button").attr("href", result.getAttribute("src"));

        // Inicijaliziram oblik crop-a na "Round"
        $("#round_crop_button").addClass("active");

        // Event listeneri za gumb "Round" i "Square"
        $("#round_crop_button").click(function () {
            cropShape = 'round';
            updateCropShapeButtons();
        });

        $("#square_crop_button").click(function () {
            cropShape = 'square';
            updateCropShapeButtons();
        });

        // Event listener za klik na gumb "Rotate Right"
        $("#rotate_right_button").click(function () {
            if (cropper) {
                cropper.rotate(90); // Rotiraj sličicu za 90 stupnjeva udesno
            }
        });

        // Event listener za klik na gumb "Rotate Left"
        $("#rotate_left_button").click(function () {
            if (cropper) {
                cropper.rotate(-90); // Rotiraj sličicu za 90 stupnjeva udesno
            }
        });

        // Event listener za klik na gumb "Flip Horizontal"
        $("#flip_horizontal_button").click(function () {
            if (cropper) {
                cropper.scaleX(-cropper.getData().scaleX || -1); // Okreni sliku vodoravno
            }
        });

        // Event listener za klik na gumb "Flip Vertical"
        $("#flip_vertical_button").click(function () {
            if (cropper) {
                cropper.scaleY(-cropper.getData().scaleY || -1); // Okreni sliku uspravno
            }
        });

        // Event listener za klik na gumb "Zoom In"
        $("#zoom_in_button").click(function () {
            if (cropper) {
                cropper.zoom(0.1); // Zumiraj sliku za 0.1
            }
        });

        // Event listener za klik na gumb "Zoom Out"
        $("#zoom_out_button").click(function () {
            if (cropper) {
                cropper.zoom(-0.1); // Zumiraj sliku za -0.1
            }
        });

        // Event listener za klik na gumb "Up"
        $("#move_up_button").click(function () {
            if (cropper) {
                cropper.move(0, 10); // Pomakni sliku prema gore za 10 piksela
            }
        });

        // Event listener za klik na gumb "Down"
        $("#move_down_button").click(function () {
            if (cropper) {
                cropper.move(0, -10); // Pomakni sliku prema dolje za 10 piksela
            }
        });

        // Event listener za klik na gumb "Left"
        $("#move_left_button").click(function () {
            if (cropper) {
                cropper.move(10, 0); // Pomakni sliku ulijevo za 10 piksela
            }
        });

        // Event listener za klik na gumb "Right"
        $("#move_right_button").click(function () {
            if (cropper) {
                cropper.move(-10, 0); // Pomakni sliku udesno za 10 piksela
            }
        });

        // Event listener za cropiranje slike
        $("#crop_button").click(function () {
            var result = document.getElementById("cropped_image_result");

            if (!cropper) {
                return;
            }

            // Crop
            var croppedCanvas = cropper.getCroppedCanvas();
            result.innerHTML = "";
            result.appendChild(croppedCanvas);

            // Resetiranje filtera na početne vrijednosti
            var defaultFilters = {
                blur: 0,
                brightness: 100,
                contrast: 100,
                grayscale: 0,
                invert: 0,
                opacity: 100
            };

            var filterControls = document.querySelectorAll('input[type=range]');
            filterControls.forEach(function (item, index) {
                var filterName = item.getAttribute('data-filter');
                var defaultValue = defaultFilters[filterName];
                item.value = defaultValue;
            });

            // Resetiranje tekstualnog polja
            $("#text_input").val('');
        });

        // Funkcija za ažuriranje stilova gumba ovisno o odabranom obliku cropa
        function updateCropShapeButtons() {
            if (cropShape === 'round') {
                $("#round_crop_button").addClass("active");
                $("#square_crop_button").removeClass("active");
            } else {
                $("#round_crop_button").removeClass("active");
                $("#square_crop_button").addClass("active");
            }
        }

        button.onclick = function () {
            var croppedCanvas;
            var result = document.getElementById('cropped_image_result');

            if (!croppable) {
                return;
            }

            // Crop
            croppedCanvas = cropper.getCroppedCanvas();

            var scaledCanvas = scaleCanvas(croppedCanvas, 150);

            if (cropShape === 'round') {
                // Round (kružni crop)
                var roundedCanvas = getCanvas(scaledCanvas);
                result.innerHTML = '';
                result.appendChild(roundedCanvas);
            } else {
                // Square (kvadratni crop)
                result.innerHTML = '';
                result.appendChild(scaledCanvas);
            }
        };

    });

    // Najprije dodaj tekst, pa tek onda primjeni filter
    const applyFilter = () => {
        var result = document.getElementById("cropped_image_result");

        if (!cropper) {
            return;
        }

        var croppedCanvas = cropper.getCroppedCanvas();

        // Create temporary canvas for applying filter and adding text
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = croppedCanvas.width;
        tempCanvas.height = croppedCanvas.height;
        var tempContext = tempCanvas.getContext("2d");

        // Apply filter to cropped canvas
        var filterControls = document.querySelectorAll('input[type=range]');
        var computedFilters = '';

        filterControls.forEach(function (item, index) {
            computedFilters += item.getAttribute('data-filter') + '(' + item.value + item.getAttribute('data-scale') + ') ';
        });

        tempContext.filter = computedFilters;
        tempContext.drawImage(croppedCanvas, 0, 0);

        // Add text to the temporary canvas
        var text = $("#text_input").val();
        var textColor = $("#text_color").val();
        var fontFamily = $("#font_family").val();
        var fontSize = $("#font_number").val();

        tempContext.font = fontSize + "px " + fontFamily;
        tempContext.fillStyle = textColor;
        tempContext.textAlign = "center";
        tempContext.fillText(text, tempCanvas.width / 2, tempCanvas.height - 20);

        // Scaling
        var scaledCanvas = scaleCanvas(tempCanvas, 150);

        // Determine crop shape
        var croppedImage;
        if (cropShape === 'round') {
            croppedImage = getCanvas(scaledCanvas); // Round crop
        } else {
            croppedImage = scaledCanvas; // Square crop
        }

        result.innerHTML = "";
        result.appendChild(croppedImage);
    }

    // Najprije primjeni filter pa onda dodaj tekst
    $("#add_text_button").click(function () {
        var text = $("#text_input").val();
        var textColor = $("#text_color").val();
        var fontFamily = $("#font_family").val();
        var fontSize = $("#font_number").val();

        var result = document.getElementById("cropped_image_result");

        if (!cropper) {
            return;
        }

        var croppedCanvas = cropper.getCroppedCanvas();

        // Create temporary canvas for applying filter and adding text
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = croppedCanvas.width;
        tempCanvas.height = croppedCanvas.height;
        var tempContext = tempCanvas.getContext("2d");

        // Apply filter to cropped canvas
        var filterControls = document.querySelectorAll('input[type=range]');
        var computedFilters = '';

        filterControls.forEach(function (item, index) {
            computedFilters += item.getAttribute('data-filter') + '(' + item.value + item.getAttribute('data-scale') + ') ';
        });

        tempContext.filter = computedFilters;
        tempContext.drawImage(croppedCanvas, 0, 0);

        // Add text to the temporary canvas
        tempContext.font = fontSize + "px " + fontFamily;
        tempContext.fillStyle = textColor;
        tempContext.textAlign = "center";
        tempContext.fillText(text, tempCanvas.width / 2, tempCanvas.height - 20);

        // Scaling
        var scaledCanvas = scaleCanvas(tempCanvas, 150);

        // Determine crop shape
        var croppedImage;
        if (cropShape === 'round') {
            croppedImage = getCanvas(scaledCanvas); // Round crop
        } else {
            croppedImage = scaledCanvas; // Square crop
        }

        result.innerHTML = "";
        result.appendChild(croppedImage);
    });

    function getCanvas(sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        if (cropShape === 'round') {
            // Kružni crop
            canvas.width = width;
            canvas.height = height;
            context.imageSmoothingEnabled = true;
            context.drawImage(sourceCanvas, 0, 0, width, height);
            context.globalCompositeOperation = 'destination-in';
            context.beginPath();
            context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
            context.fill();
        } else {
            // Kvadratni crop
            var maxSize = Math.max(width, height);
            canvas.width = maxSize;
            canvas.height = maxSize;
            context.imageSmoothingEnabled = true;
            context.drawImage(sourceCanvas, (maxSize - width) / 2, (maxSize - height) / 2, width, height);
        }

        return canvas;
    }

    // Funkcija za skaliranje platna na određenu maksimalnu veličinu
    function scaleCanvas(canvas, maxSize) {
        var width = canvas.width;
        var height = canvas.height;

        if (width > maxSize || height > maxSize) {
            if (width > height) {
                height *= maxSize / width;
                width = maxSize;
            } else {
                width *= maxSize / height;
                height = maxSize;
            }
        }

        var scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = width;
        scaledCanvas.height = height;

        var context = scaledCanvas.getContext('2d');
        context.drawImage(canvas, 0, 0, width, height);

        return scaledCanvas;
    }

    var filterInputs = document.querySelectorAll('input[type=range]');
    filterInputs.forEach(item => {
        item.addEventListener('input', () => {
            applyFilter();
        });
    });

    $("#cropped_image_result").on('click', (e) => {
        let canvas = cropper.getCroppedCanvas();
        let ctx = canvas.getContext("2d");
        let coord = { x: 0, y: 0 };

        document.addEventListener("mousedown", start);
        document.addEventListener("mouseup", stop);
        window.addEventListener("resize", resize);


        resize();

        function resize() {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        }

        function reposition(event) {
            coord.x = event.clientX - canvas.offsetLeft;
            coord.y = event.clientY - canvas.offsetTop;
        }

        function start(event) {
            document.addEventListener("mousemove", draw);
            reposition(event);
        }

        function stop() {
            document.removeEventListener("mousemove", draw);
        }

        function draw(event) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#ACD3ED";
            ctx.moveTo(coord.x, coord.y);
            reposition(event);
            ctx.lineTo(coord.x, coord.y);
            ctx.stroke();
        }

        $("#cropped_image_result").append(getCanvas(cnv));

    });

    /*$("#cropped_image_result").on('click', (e) => {
        let cnv = cropper.getCroppedCanvas();
        let ctx = cnv.getContext('2d');
        const rect = $("canvas").offset();
        ctx.beginPath();
        ctx.fillStyle = "purple";
        ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 15, 0, 2 * Math.PI);
        ctx.fill();
        $("#cropped_image_result").html("");
        $("#cropped_image_result").append(getCanvas(cnv));
    });*/

});

const download = () => {
    var link = document.createElement('a');
    link.download = 'sticker.png';
    link.href = $('canvas').get(0).toDataURL();
    link.click();
}

const upload = () => {
    const currentPath = window.location.pathname;
    const apiUrl = currentPath + "/../backend/api/uploadSticker.php";
    const img = $('canvas').get(0).toDataURL().split(',')[1];
    const tags = $('#hashtags').get(0).value.split(/[,\s]+/);
    console.log(tags);
    $.ajax({
        url: apiUrl,
        type: "POST",
        data: { img, tags },
        success: function (response) {
            console.log("Data stored in session successfully: spremljen sticker");
            console.log(response);
        },
        error: function () {
            console.log("Error storing data in session");
        }
    });
}