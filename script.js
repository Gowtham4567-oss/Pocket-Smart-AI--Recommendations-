document.addEventListener('DOMContentLoaded', () => {
    const homeForm = document.getElementById('homeForm');

    if (homeForm) {
        homeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                budget: document.getElementById('budget').value,
                roomType: document.getElementById('roomType').value,
                interiorStyle: document.getElementById('interiorStyle').value,
                lights: document.getElementById('lights').value,
                fans: document.getElementById('fans').value,
                furniture: document.getElementById('furniture').value,
                appliances: document.getElementById('appliances').value,
                decor: document.getElementById('decor').value,
                notes: document.getElementById('notes').value
            };

            fetch('/api/recommend/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    displayRecommendations(result.data);
                }
            })
            .catch(err => console.error('Error fetching recommendations:', err));
        });
    }
});

function displayRecommendations(data) {
    const resultsWrapper = document.getElementById('resultsWrapper');
    const resultsContainer = document.getElementById('recommendationResults');

    resultsContainer.innerHTML = '';

    data.items.forEach(item => {
        const itemCard = `
            <div class="recommendation-item">
                <h4>${item.title}</h4>
                <p>• ${item.desc}</p>
            </div>
        `;
        resultsContainer.innerHTML += itemCard;
    });

    resultsWrapper.classList.remove('hidden');
    resultsWrapper.scrollIntoView({ behavior: 'smooth' });
}
