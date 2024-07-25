window.onload = function() {
    const canvas = new fabric.Canvas('coloringCanvas');
    let currentColor = 'black';

    document.getElementById('uploadImage').addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                const image = new fabric.Image(imgObj);
                image.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    scaleX: canvas.width / imgObj.width,
                    scaleY: canvas.height / imgObj.height
                });
                canvas.clear();
                canvas.add(image);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    document.querySelectorAll('.color-box').forEach(box => {
        box.addEventListener('click', (e) => {
            currentColor = e.target.dataset.color;
        });
    });

    canvas.on('mouse:down', function(event) {
        const pointer = canvas.getPointer(event.e);
        const clickedObject = canvas.findTarget(event.e);

        if (clickedObject && clickedObject.type === 'image') {
            const ctx = canvas.getContext('2d');
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            const imgData = ctx.getImageData(x, y, 1, 1).data;

            if (imgData[3] > 0) { // If the clicked area is not transparent
                const color = fabric.Color.fromRgb(currentColor);
                canvas.contextTop.fillStyle = color.toRgba();
                canvas.contextTop.fillRect(x, y, 1, 1);
            }
        }
    });
};
