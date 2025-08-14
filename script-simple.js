// Gemini API configuration
// The API key will be injected at build time by Vercel
// For local development, use config.js
const GEMINI_API_KEY = window.GEMINI_API_KEY || (typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : '');
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

// File upload handling
let uploadedFiles = [];

function handleFileSelect(event) {
    console.log('handleFileSelect called');
    const files = event.target.files;
    console.log('Files received:', files.length, 'files');
    
    // Clear previous files and add new ones
    uploadedFiles = [];
    const fileList = document.getElementById('fileList-1');
    
    if (!fileList) {
        console.error('fileList element not found');
        return;
    }
    
    fileList.innerHTML = '';
    
    // Check if any files were selected
    if (!files || files.length === 0) {
        console.log('No files selected');
        return;
    }
    
    // Add a header
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem; color: #374151;';
    headerDiv.textContent = `Uploaded Files (${files.length}):`;
    fileList.appendChild(headerDiv);
    
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    
    for (let file of files) {
        console.log(`Processing file: ${file.name}, Size: ${file.size} bytes`);
        
        // Check file size
        if (file.size > maxSize) {
            console.warn(`File ${file.name} is too large`);
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'background: #fee2e2; color: #991b1b; padding: 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem;';
            errorDiv.innerHTML = `⚠️ <strong>${file.name}</strong> is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max size is 10MB.`;
            fileList.appendChild(errorDiv);
            continue;
        }
        
        // File is valid, add it
        uploadedFiles.push(file);
        const fileDiv = document.createElement('div');
        fileDiv.style.cssText = 'background: #f3f4f6; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb;';
        
        // Add file icon based on type
        let fileIcon = '📄';
        if (file.name.endsWith('.pdf')) fileIcon = '📄';
        else if (file.name.endsWith('.txt')) fileIcon = '📝';
        else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileIcon = '📋';
        
        // Format file size
        let sizeText = (file.size / 1024).toFixed(2) + ' KB';
        if (file.size > 1024 * 1024) {
            sizeText = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        }
        
        fileDiv.innerHTML = `
            <span style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.25rem;">${fileIcon}</span>
                <span>
                    <strong>${file.name}</strong>
                    <br>
                    <span style="font-size: 0.875rem; color: #6b7280;">${sizeText}</span>
                </span>
            </span>
            <button onclick="removeFile('${file.name}')" style="color: #ef4444; background: white; border: 1px solid #ef4444; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">Remove</button>
        `;
        fileList.appendChild(fileDiv);
        console.log(`✓ File ${file.name} added successfully`);
    }
    
    // Show success message if files were added
    if (uploadedFiles.length > 0) {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'background: #d1fae5; color: #065f46; padding: 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600;';
        successMsg.textContent = `✓ ${uploadedFiles.length} file(s) ready for processing`;
        fileList.appendChild(successMsg);
        
        // Show config and process sections
        document.getElementById('configSection-1').style.display = 'block';
        document.getElementById('processSection-1').style.display = 'block';
    }
}

function removeFile(fileName) {
    console.log(`Removing file: ${fileName}`);
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    
    // Re-render file list
    const fileList = document.getElementById('fileList-1');
    fileList.innerHTML = '';
    
    if (uploadedFiles.length > 0) {
        // Add header
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem; color: #374151;';
        headerDiv.textContent = `Uploaded Files (${uploadedFiles.length}):`;
        fileList.appendChild(headerDiv);
        
        // Add each file
        uploadedFiles.forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.style.cssText = 'background: #f3f4f6; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb;';
            
            let fileIcon = '📄';
            if (file.name.endsWith('.pdf')) fileIcon = '📄';
            else if (file.name.endsWith('.txt')) fileIcon = '📝';
            else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileIcon = '📋';
            
            let sizeText = (file.size / 1024).toFixed(2) + ' KB';
            if (file.size > 1024 * 1024) {
                sizeText = (file.size / 1024 / 1024).toFixed(2) + ' MB';
            }
            
            fileDiv.innerHTML = `
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">${fileIcon}</span>
                    <span>
                        <strong>${file.name}</strong>
                        <br>
                        <span style="font-size: 0.875rem; color: #6b7280;">${sizeText}</span>
                    </span>
                </span>
                <button onclick="removeFile('${file.name}')" style="color: #ef4444; background: white; border: 1px solid #ef4444; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">Remove</button>
            `;
            fileList.appendChild(fileDiv);
        });
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'background: #d1fae5; color: #065f46; padding: 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600;';
        successMsg.textContent = `✓ ${uploadedFiles.length} file(s) ready for processing`;
        fileList.appendChild(successMsg);
    } else {
        // Hide config and process sections if no files
        document.getElementById('configSection-1').style.display = 'none';
        document.getElementById('processSection-1').style.display = 'none';
        
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = 'color: #6b7280; font-size: 0.875rem; font-style: italic;';
        emptyMsg.textContent = 'No files uploaded yet';
        fileList.appendChild(emptyMsg);
    }
}

async function processWithGemini() {
    if (uploadedFiles.length === 0) {
        alert('Please upload at least one document');
        return;
    }
    
    const processBtn = document.getElementById('processBtn-1');
    const outputArea = document.getElementById('outputArea-1');
    const outputContent = document.getElementById('outputContent-1');
    const clientName = document.getElementById('clientName-1').value || 'Unknown Client';
    const departments = document.getElementById('departments-1').value || 'All departments';
    
    processBtn.disabled = true;
    processBtn.innerHTML = 'Processing...';
    
    try {
        // Read all files
        const fileContents = await Promise.all(uploadedFiles.map(file => readFileContent(file)));
        
        // Create the prompt
        const documentsText = fileContents.map(f => `
--- Document: ${f.name} ---
${f.content}
--- End of ${f.name} ---
        `).join('\n\n');
        
        const prompt = `You are a workflow-mapping assistant. Process these documents and create structured markdown workflows.

Client/Organization: ${clientName}
Departments to cover: ${departments}
Scope: Current State

Color Legend:
- Purple = Internal
- Gray = Agency  
- Green = Proposed
- Yellow = Gap
- Red = Risk

Documents to process:
${documentsText}

Please create a comprehensive workflow mapping following this format:
- One section per department: # [DEPARTMENT NAME] | Current State
- Workflows labeled 1A, 1B, etc. with titles
- Numbered steps with color categories [Color - Category]
- Include details as bullets: People Involved, Process, Tools, Inputs, Outputs, Challenges, Dependencies
- Mark unknowns as "Unknown"
- Use plain markdown only

Output the complete workflow mapping now.`;
        
        // Call Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to process documents');
        }
        
        const data = await response.json();
        const output = data.candidates[0].content.parts[0].text;
        
        // Display output
        outputContent.textContent = output;
        outputArea.style.display = 'block';
        
    } catch (error) {
        alert('Error processing documents: ' + error.message);
        console.error('Processing error:', error);
    } finally {
        processBtn.innerHTML = 'Process Documents with AI';
        processBtn.disabled = false;
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
            name: file.name,
            content: e.target.result
        });
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

function downloadWorkflow() {
    const content = document.getElementById('outputContent-1').textContent;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow-mapping.md';
    a.click();
    URL.revokeObjectURL(url);
}

function copyOutput() {
    const content = document.getElementById('outputContent-1').textContent;
    navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard!');
    });
}

// Initialize drag and drop
window.addEventListener('load', function() {
    const uploadArea = document.getElementById('uploadArea-1');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = '#eff6ff';
            uploadArea.style.borderColor = '#6366f1';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '';
            
            const files = e.dataTransfer.files;
            handleFileSelect({ target: { files: files } });
        });
    }
});