window.onload = function() {
    const canvas = new fabric.Canvas('coloringCanvas');
    let currentColor = 'rgba(0, 0, 0, 1)'; // Default color is black
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
            fabric.Image.fromURL(event.target.result, function(img) {
                if (imageObject) {
                    canvas.remove(imageObject);
                }
                imageObject = img.set({
                    left: 0,
                    top: 0,
                    selectable: false
                }).scaleToWidth(canvas.width).scaleToHeight(canvas.height);

                canvas.clear();
                canvas.add(imageObject);
                canvas.renderAll();
            });
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    document.querySelectorAll('.color-box').forEach(box => {
        box.addEventListener('click', (e) => {
            currentColor = e.target.style.backgroundColor;
        });
    });

    function floodFill(x, y, fillColor) {
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        const stack = [[x, y]];
        const targetColor = getColorAtPixel(x, y, ctx, pixels);

        function getColorAtPixel(x, y, ctx, pixels) {
            const index = (y * canvas.width + x) * 4;
            return [
                pixels[index],
                pixels[index + 1],
                pixels[index + 2],
                pixels[index + 3]
            ];
        }

        function colorMatch(pixel, targetColor) {
            return pixel[0] === targetColor[0] &&
                   pixel[1] === targetColor[1] &&
                   pixel[2] === targetColor[2] &&
                   pixel[3] === targetColor[3];
        }

        while (stack.length) {
            const [x, y] = stack.pop();
            const index = (y * canvas.width + x) * 4;

            if (colorMatch([pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]], targetColor)) {
                pixels[index] = fillColor[0];
                pixels[index + 1] = fillColor[1];
                pixels[index + 2] = fillColor[2];
                pixels[index + 3] = fillColor[3];

                stack.push([x + 1, y]);
                stack.push([x - 1, y]);
                stack.push([x, y + 1]);
                stack.push([x, y - 1]);
            }
        }

        ctx.putImageData(imgData, 0, 0);
        canvas.renderAll();
    }

    function paintBucket(x, y) {
        const ctx = canvas.getContext('2d');
        const color = fabric.Color.fromRgb(currentColor).toRgba();
        const fillColor = [
            parseInt(color[0]),
            parseInt(color[1]),
            parseInt(color[2]),
            parseInt(color[3] * 255)
        ];

        floodFill(Math.floor(x), Math.floor(y), fillColor);
    }

    canvas.on('mouse:down', function(event) {
        const pointer = canvas.getPointer(event.e);
        paintBucket(pointer.x, pointer.y);
    });
};
