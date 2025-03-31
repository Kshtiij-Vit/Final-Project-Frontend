document.addEventListener('DOMContentLoaded', function() {
  // Wait for the text animation to complete (2.5s = delay + animation time)
  setTimeout(function() {
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.classList.add('move-up');
    
    // Show the rest of the content after the logo moves
    setTimeout(function() {
      document.querySelector('.content').style.display = 'block';
    }, 1000);
  }, 2500);
});