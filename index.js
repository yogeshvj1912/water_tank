function calculateWater() {
    const input = document.getElementById("block-heights").value;
    const heights = input.split(",").map(Number);
    const n = heights.length;
    const result = calculateTrappedWater(heights);
    document.getElementById("result").innerText = `${result.totalWater} Units of Water Trapped`;
    generateSVG(heights, result.waterLevels);
}

function calculateTrappedWater(heights) {
    const n = heights.length;
    const leftMax = Array(n).fill(0);
    const rightMax = Array(n).fill(0);
    const waterLevels = Array(n).fill(0);

    // Fill leftMax and rightMax
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
    }
    
    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
    }
    
    // Calculate water levels and total water trapped
    let totalWater = 0;
    for (let i = 0; i < n; i++) {
        waterLevels[i] = Math.max(0, Math.min(leftMax[i], rightMax[i]) - heights[i]);
        totalWater += waterLevels[i];
    }
    
    return { totalWater, waterLevels };
}

function generateSVG(heights, waterLevels) {
    const svgContainer = document.getElementById("svg-container");
    svgContainer.innerHTML = ''; // Clear any existing SVG elements
    const svgNS = "http://www.w3.org/2000/svg";
    const blockWidth = 20;
    const maxHeight = Math.max(...heights);

    // Create SVG
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", blockWidth * heights.length);
    svg.setAttribute("height", maxHeight * 10 + 10);

    // Draw blocks and water levels
    heights.forEach((height, i) => {
        // Draw block
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", i * blockWidth);
        rect.setAttribute("y", (maxHeight - height) * 10);
        rect.setAttribute("width", blockWidth);
        rect.setAttribute("height", height * 10);
        rect.setAttribute("class", "block");
        svg.appendChild(rect);

        // Draw water if any
        if (waterLevels[i] > 0) {
            const waterRect = document.createElementNS(svgNS, "rect");
            waterRect.setAttribute("x", i * blockWidth);
            waterRect.setAttribute("y", (maxHeight - height - waterLevels[i]) * 10);
            waterRect.setAttribute("width", blockWidth);
            waterRect.setAttribute("height", waterLevels[i] * 10);
            waterRect.setAttribute("class", "water");
            svg.appendChild(waterRect);
        }
    });

    svgContainer.appendChild(svg);
}
