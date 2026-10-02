/**
 * PocketSmart AI - Dynamic Script Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  showTab('home');

  // Load dynamically logged in user
  const activeUser = localStorage.getItem("pocketSmartActiveUser");
  if (activeUser) {
    updateUserUI(activeUser);
  } else {
    showAuthButtons();
  }

  // Attach Direct Event Listeners for Buttons to guarantee execution
  const btnHome = document.getElementById('btnGenerateHome');
  if (btnHome) {
    btnHome.addEventListener('click', handleHomeDecorSubmit);
  }

  const btnParty = document.getElementById('btnGenerateParty');
  if (btnParty) {
    btnParty.addEventListener('click', handlePartySubmit);
  }

  const btnJewelry = document.getElementById('btnGenerateJewelry');
  if (btnJewelry) {
    btnJewelry.addEventListener('click', handleJewelrySubmit);
  }
});

// Tab Switcher
function showTab(tabId) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.remove('hidden');
    activeTab.classList.add('active');
  }

  if (tabId === 'planners') {
    backToPlannerCards();
  }
}

// Select Planner Card
function selectPlanner(plannerType) {
  document.getElementById('plannerCardsView').classList.add('hidden');
  
  const formsContainer = document.getElementById('plannerForms');
  const forms = document.querySelectorAll('.planner-form');
  
  formsContainer.classList.remove('hidden');
  forms.forEach(f => f.classList.add('hidden'));

  if (plannerType === 'homeDecor') {
    document.getElementById('homeDecorForm').classList.remove('hidden');
  } else if (plannerType === 'party') {
    document.getElementById('partyForm').classList.remove('hidden');
  } else if (plannerType === 'jewelry') {
    document.getElementById('jewelryForm').classList.remove('hidden');
  }

  document.getElementById('recommendationOutput').classList.add('hidden');
}

// Back Button Handler
function backToPlannerCards() {
  document.getElementById('plannerCardsView').classList.remove('hidden');
  document.getElementById('plannerForms').classList.add('hidden');
}

// Authentication Logic (Stores registered name and displays dynamically)
function handleRegister(e) {
  e.preventDefault();
  const nameInput = document.getElementById('regName').value.trim();
  const emailInput = document.getElementById('regEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('regPassword').value;

  if (!nameInput || !emailInput || !passwordInput) {
    alert("Please fill in all details.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("pocketSmartUsers") || "[]");
  users.push({ name: nameInput, email: emailInput, password: passwordInput });
  localStorage.setItem("pocketSmartUsers", JSON.stringify(users));

  localStorage.setItem("pocketSmartActiveUser", nameInput);
  updateUserUI(nameInput);

  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPassword').value = '';
  closeModal('registerModal');
}

function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value;

  let users = JSON.parse(localStorage.getItem("pocketSmartUsers") || "[]");
  const matchedUser = users.find(u => u.email === emailInput && u.password === passwordInput);

  if (matchedUser) {
    localStorage.setItem("pocketSmartActiveUser", matchedUser.name);
    updateUserUI(matchedUser.name);
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    closeModal('loginModal');
  } else {
    alert("Invalid login details or user does not exist!");
  }
}

function updateUserUI(userName) {
  document.getElementById('authContainer').classList.add('hidden');
  const profileContainer = document.getElementById('userProfileContainer');
  profileContainer.classList.remove('hidden');
  document.getElementById('userNameDisplay').innerText = userName;
}

function showAuthButtons() {
  document.getElementById('authContainer').classList.remove('hidden');
  document.getElementById('userProfileContainer').classList.add('hidden');
  document.getElementById('userNameDisplay').innerText = '';
}

function handleLogout() {
  localStorage.removeItem("pocketSmartActiveUser");
  showAuthButtons();
}

// Modal Helpers
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// Recommendation Calculation Algorithms
function handleHomeDecorSubmit() {
  const budget = parseFloat(document.getElementById('homeBudget').value) || 10000;
  const lights = document.getElementById('numLights').value || 5;
  const fans = document.getElementById('numFans').value || 3;
  const furniture = document.getElementById('numFurniture').value || 2;

  const lightAmt = (budget * 0.25).toFixed(2);
  const fanAmt = (budget * 0.35).toFixed(2);
  const furnAmt = (budget * 0.40).toFixed(2);

  const cards = [
    { title: `Lighting Setup (${lights} Lights) — Allocation: ₹${lightAmt}`, desc: "Smart LED Bulbs & Warm White Strips (Amazon/Flipkart)" },
    { title: `Fans & Airflow (${fans} Fans) — Allocation: ₹${fanAmt}`, desc: "Energy Efficient BLDC Ceiling Fans" },
    { title: `Furniture Essentials (${furniture} Items) — Allocation: ₹${furnAmt}`, desc: "Minimalist Wooden Furniture Setup (IKEA / Amazon)" }
  ];

  renderOutput("Recommendations for Home Interior", cards);
}

function handlePartySubmit() {
  const budget = parseFloat(document.getElementById('partyBudget').value) || 45000;
  const guests = document.getElementById('guestCount').value || 35;

  const foodAmt = (budget * 0.50).toFixed(2);
  const decorAmt = (budget * 0.30).toFixed(2);
  const cakeAmt = (budget * 0.20).toFixed(2);

  const cards = [
    { title: `Catering Setup (${guests} Guests) — Allocation: ₹${foodAmt}`, desc: "Buffet Dinner & Beverage Menu Package" },
    { title: `Venue Decor & Lighting — Allocation: ₹${decorAmt}`, desc: "Theme Balloon Arch & Backdrop Stage Setup" },
    { title: `Custom Cake & Goodie Bags — Allocation: ₹${cakeAmt}`, desc: "Customized Designer Cake & Return Gifts" }
  ];

  renderOutput("Recommendations for Party Package", cards);
}

function handleJewelrySubmit() {
  const budget = parseFloat(document.getElementById('jewelryBudget').value) || 35000;

  const cards = [
    { title: `Gold Finish Necklace Set — Allocation: ₹${(budget * 0.6).toFixed(2)}`, desc: "CaratLane / Tanishq Light Antique Design" },
    { title: `Matching Earrings & Bangles — Allocation: ₹${(budget * 0.4).toFixed(2)}`, desc: "Pearl & Gemstone Accent Crafting" }
  ];

  renderOutput("Recommendations for Jewelry Stylist", cards);
}

function renderOutput(titleText, items) {
  const outputBox = document.getElementById('recommendationOutput');
  const titleSpan = document.getElementById('recommendationTitle');
  const container = document.getElementById('outputContent');

  titleSpan.innerText = titleText;
  
  let html = '';
  items.forEach(item => {
    html += `
      <div class="recommend-card">
        <h4 class="card-title">${item.title}</h4>
        <ul class="card-list">
          <li>${item.desc}</li>
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;
  outputBox.classList.remove('hidden');

  // Smooth scroll down to output
  outputBox.scrollIntoView({ behavior: 'smooth' });
}
