window.onload = function() {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    let currentColor = 'black';
    let selectedImage = null;

    // Load images
    const images = {
        image1: 'image1.png',
        image2: 'image2.png',
        image3: 'image3.png'
    };

    // Image selection
    document.querySelectorAll('.image-selection img').forEach(img => {
        img.addEventListener('click', (e) => {
            document.querySelectorAll('.image-selection img').forEach(img => img.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedImage = e.target.id;
            loadImage(images[selectedImage]);
        });
    });

    function loadImage(imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            addNumbers(); // Add the numbers to the canvas
        };
    }

    function addNumbers() {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('1', 100, 100);
        ctx.fillText('2', 200, 100);
        ctx.fillText('3', 300, 100);
        // Add more numbers and coordinates as needed
    }

    document.querySelectorAll('.color-box').forEach(box => {
        box.addEventListener('click', (e) => {
            currentColor = e.target.dataset.color;
        });
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        
        // Detect the clicked area and fill it with the selected color
        if (pixelData[3] === 255) { // Assuming the text color is fully opaque
            ctx.fillStyle = currentColor;
            ctx.fillText('1', 100, 100); // Redraw the number if needed
            ctx.fillText('2', 200, 100);
            ctx.fillText('3', 300, 100);
            // Add logic to detect the specific number clicked and fill accordingly
        }
    });
};
