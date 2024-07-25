window.onload = function() {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');

    // Draw a simple example image (numbered sections)
    ctx.font = '20px Arial';
    ctx.fillText('1', 100, 100);
    ctx.fillText('2', 200, 100);
    ctx.fillText('3', 300, 100);
    // Add more numbers and coordinates as needed

    let currentColor = 'black';

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
