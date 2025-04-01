document.addEventListener('DOMContentLoaded', function() {
  // Wait for the text animation to complete (2.5s = delay + animation time)
  setTimeout(function() {
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.classList.add('move-up');
    
    // Show the login form after the logo moves
    setTimeout(function() {
      const loginContainer = document.querySelector('.login-container');
      loginContainer.classList.add('show');
    }, 1000);
  }, 2500);

  // Form submission handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Here you would typically send this data to a server
      console.log('Login attempt with:', { username, password });
      
      // For demo purposes, just show an alert
      alert(`Login attempt for ${username} recorded (this is a demo - no actual login occurs)`);
      
      // Reset form
      loginForm.reset();
    });
  }
});