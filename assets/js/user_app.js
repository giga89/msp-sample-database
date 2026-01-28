
document.getElementById('createUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Simulate getting data
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        password: document.getElementById('password').value
    };

    console.log('Creating user:', formData);

    // Simulate API call delay
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
    btn.disabled = true;

    setTimeout(() => {
        // Show success toast
        const toast = document.getElementById('toast');
        toast.style.display = 'flex';
        toast.style.opacity = '0';

        // Simple animation
        requestAnimationFrame(() => {
            toast.style.transition = 'opacity 0.3s ease';
            toast.style.opacity = '1';
        });

        // Reset form
        e.target.reset();

        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 3000);

    }, 1000);
});
