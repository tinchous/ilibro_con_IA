async function generateQuantumDevice() {
  try {
    const response = await fetch('/api/quantum-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'A high-detail, realistic 3D model of a quantum entanglement device in a dark physics lab. The device has two main glowing nodes connected by a shimmering, ethereal beam of light. The nodes are complex, with visible circuitry and cooling pipes. The environment is dark, with subtle reflections on metallic surfaces. Cinematic lighting, 4k resolution.' 
      }),
    });
    
    const data = await response.json();
    return data.imageUrl || null;
  } catch (error) {
    console.error("Error generating quantum device image:", error);
    return null;
  }
}

export { generateQuantumDevice };
