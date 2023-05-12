const form = document.getElementById('expense-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('usermail').value;
  const password = document.getElementById('password').value;
  const data = {username: username, email: email, password: password};
  fetch('/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // Handle response data
  })
  .catch(error => {
    // Handle errors
  });
});