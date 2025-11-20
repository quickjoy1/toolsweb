const contactForm = document.getElementById('contactForm');
const resultSection = document.getElementById('resultSection');
const resultMessage = document.getElementById('resultMessage');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      contactForm.style.display = 'none';
      resultSection.style.display = 'block';
      resultMessage.textContent = result.message;
    } else {
      alert(result.error || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
});
