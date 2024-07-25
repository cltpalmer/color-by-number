window.onload = function() {
    const canvas = new fabric.Canvas('coloringCanvas');
    let currentColor = 'black';
    let imageObject = null;

    // Center the canvas container
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.margin = 'auto';
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '50%';
    canvasContainer.style.left = '50%';
    canvasContainer.style.transform = 'translate(-50%, -50%)';

    document.getElementById('uploadImage').addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                if (imageObject) {
                    canvas.remove(imageObject);
                }
                imageObject = new fabric.Image(imgObj);
                imageObject.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    scaleX: canvas.width / imgObj.width,
                    scaleY: canvas.height / imgObj.height,
                    selectable: false
                });
                canvas.clear();
                canvas.add(imageObject);
                canvas.renderAll();
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    document.querySelectorAll('.color-box').forEach(box => {
        box.addEventListener('click', (e) => {
            currentColor = e.target.dataset.color;
        });
    });

    function paintBucket(x, y) {
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(x, y, 1, 1).data;
        const targetColor = `rgba(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, ${imgData[3]})`;

        if (imgData[3] > 0) { // Check if the pixel is not transparent
            const color = fabric.Color.fromRgb(currentColor);
            ctx.fillStyle = color.toRgba();
            floodFill(x, y, targetColor);
        }
    }

    function floodFill(x, y, targetColor) {
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        const stack = [[x, y]];
        const width = imgData.width;
        const height = imgData.height;
        const target = targetColor;
        const replacement = ctx.fillStyle;

        function index(x, y) {
            return (y * width + x) * 4;
        }

        function colorMatch(index) {
            return pixels[index] === target[0] &&
                   pixels[index + 1] === target[1] &&
                   pixels[index + 2] === target[2] &&
                   pixels[index + 3] === target[3];
        }

        while (stack.length) {
            const [x, y] = stack.pop();
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            const i = index(x, y);

            if (colorMatch(i)) {
                let j = x - 1;
                while (j >= 0 && colorMatch(index(j, y))) {
                    j--;
                }
                let spanLeft = j + 1;
                j = x + 1;
                while (j < width && colorMatch(index(j, y))) {
                    j++;
                }
                let spanRight = j;

                for (let k = spanLeft; k < spanRight; k++) {
                    const i = index(k, y);
                    pixels[i] = replacement[0];
                    pixels[i + 1] = replacement[1];
                    pixels[i + 2] = replacement[2];
                    pixels[i + 3] = replacement[3];
                }

                stack.push([spanLeft, y - 1]);
                stack.push([spanRight - 1, y - 1]);
                stack.push([spanLeft, y + 1]);
                stack.push([spanRight - 1, y + 1]);
            }
        }

        ctx.putImageData(imgData, 0, 0);
        canvas.renderAll();
    }

    canvas.on('mouse:down', function(event) {
        const pointer = canvas.getPointer(event.e);
        paintBucket(pointer.x, pointer.y);
    });
};
