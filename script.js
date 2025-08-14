// Track completion status
let completedSteps = new Set();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved progress from localStorage
    loadProgress();
    
    // Update progress bar
    updateProgressBar();
    
    // Add smooth scroll behavior
    addSmoothScroll();
});

// Toggle step details visibility
function toggleDetails(stepNumber) {
    const card = document.querySelector(`[data-step="${stepNumber}"]`);
    const details = card.querySelector('.step-details');
    const button = card.querySelector('.btn-secondary');
    
    if (details.classList.contains('show')) {
        details.classList.remove('show');
        button.textContent = 'View Details';
    } else {
        details.classList.add('show');
        button.textContent = 'Hide Details';
    }
}

// Mark step as complete
function markComplete(stepNumber) {
    const card = document.querySelector(`[data-step="${stepNumber}"]`);
    const status = document.getElementById(`status-${stepNumber}`);
    const button = card.querySelector('.btn-success');
    
    if (!completedSteps.has(stepNumber)) {
        // Mark as complete
        completedSteps.add(stepNumber);
        card.classList.add('completed');
        status.textContent = 'Completed';
        status.classList.add('completed');
        button.textContent = 'Completed';
        button.disabled = true;
        
        // Show success animation
        showSuccessAnimation(card);
    }
    
    // Save progress and update progress bar
    saveProgress();
    updateProgressBar();
    
    // Check if all steps are complete
    if (completedSteps.size === 5) {
        showCompletionMessage();
    }
}

// Update progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const completedText = document.getElementById('completedSteps');
    const percentage = (completedSteps.size / 5) * 100;
    
    progressBar.style.width = percentage + '%';
    completedText.textContent = completedSteps.size;
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('workflowProgress', JSON.stringify([...completedSteps]));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('workflowProgress');
    if (saved) {
        const savedSteps = JSON.parse(saved);
        savedSteps.forEach(stepNumber => {
            completedSteps.add(stepNumber);
            
            // Update UI for saved steps
            const card = document.querySelector(`[data-step="${stepNumber}"]`);
            const status = document.getElementById(`status-${stepNumber}`);
            const button = card.querySelector('.btn-success');
            
            if (card && status && button) {
                card.classList.add('completed');
                status.textContent = 'Completed';
                status.classList.add('completed');
                button.textContent = 'Completed';
                button.disabled = true;
            }
        });
    }
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress?')) {
        completedSteps.clear();
        localStorage.removeItem('workflowProgress');
        
        // Reset all UI elements
        for (let i = 1; i <= 5; i++) {
            const card = document.querySelector(`[data-step="${i}"]`);
            const status = document.getElementById(`status-${i}`);
            const button = card.querySelector('.btn-success');
            
            if (card && status && button) {
                card.classList.remove('completed');
                status.textContent = 'Pending';
                status.classList.remove('completed');
                button.textContent = 'Mark Complete';
                button.disabled = false;
            }
        }
        
        updateProgressBar();
    }
}

// Show success animation
function showSuccessAnimation(card) {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(16, 185, 129, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        animation: fadeInOut 1s ease;
        pointer-events: none;
    `;
    overlay.innerHTML = '✓';
    
    // Position card relatively if not already
    card.style.position = 'relative';
    card.appendChild(overlay);
    
    // Remove overlay after animation
    setTimeout(() => {
        overlay.remove();
    }, 1000);
}

// Show completion message
function showCompletionMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        text-align: center;
        z-index: 1000;
        animation: scaleIn 0.3s ease;
    `;
    
    message.innerHTML = `
        <h2 style="color: #10b981; margin-bottom: 1rem;">🎉 Workflow Complete!</h2>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">Congratulations! You've completed all steps in the augmented workflow.</p>
        <button onclick="this.parentElement.remove()" class="btn btn-primary">Close</button>
        <button onclick="resetProgress(); this.parentElement.remove()" class="btn btn-secondary" style="margin-left: 0.5rem;">Reset Progress</button>
    `;
    
    document.body.appendChild(message);
}

// Add smooth scroll behavior
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'r' to reset progress
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetProgress();
    }
    
    // Press numbers 1-5 to jump to steps
    if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.altKey) {
        const stepCard = document.querySelector(`[data-step="${e.key}"]`);
        if (stepCard) {
            stepCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            // Highlight the card briefly
            stepCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                stepCard.style.transform = '';
            }, 300);
        }
    }
});

// Add copy to clipboard functionality for code snippets
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            animation: slideUp 0.3s ease;
            z-index: 1000;
        `;
        toast.textContent = 'Copied to clipboard!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(1rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);