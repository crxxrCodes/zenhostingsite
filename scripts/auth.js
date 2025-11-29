// Authentication functions
function isLoggedIn() {
    return localStorage.getItem('zenHostingLoggedIn') === 'true';
}

function handleDashboardClick() {
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'register.html';
    }
}

// Initialize auth functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add dashboard button listeners
    const dashboardBtns = document.querySelectorAll('#dashboard-btn, .dashboard-btn');
    dashboardBtns.forEach(btn => {
        btn.addEventListener('click', handleDashboardClick);
    });
    
    // Handle registration form
    const regForm = document.getElementById('registration-form');
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Set user as logged in and redirect
            localStorage.setItem('zenHostingLoggedIn', 'true');
            alert('Account created successfully!');
            window.location.href = 'dashboard.html';
        });
    }
});
