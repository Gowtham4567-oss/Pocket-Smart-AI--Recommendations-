document.getElementById('recommendation-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const budget = document.getElementById('budget').value;
    const imageInput = document.getElementById('image').files[0];

    const loading = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const resultsDiv = document.getElementById('results');

    loading.style.display = 'block';
    resultsContainer.style.display = 'none';
    resultsDiv.innerHTML = '';

    const formData = new FormData();
    formData.append('category', category);
    formData.append('budget', budget);
    if (imageInput) {
        formData.append('image', imageInput);
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/recommend', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Server response error');
        }

        const data = await response.json();

        if (data.status === 'success') {
            const recommendations = JSON.parse(data.recommendations);

            recommendations.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'recommendation-card';
                itemCard.innerHTML = `
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>
                    <p>${item.description}</p>
                `;
                resultsDiv.appendChild(itemCard);
            });

            resultsContainer.style.display = 'block';
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Backend error! Make sure FastAPI server is running (`python main.py`).');
    } finally {
        loading.style.display = 'none';
    }
});
