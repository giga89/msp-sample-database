import { headers, initialData } from './data.js';

// State
let samples = [];

// DOM Elements
const gridContainer = document.getElementById('gridContainer');
const searchInput = document.getElementById('searchInput');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('entryModal');
const cancelBtn = document.getElementById('cancelBtn');
const entryForm = document.getElementById('entryForm');
const formFieldsDiv = document.getElementById('formFields');

// Initialization
function init() {
    // Check localStorage for existing data, else use initialData
    const storedData = localStorage.getItem('msp_samples');
    if (storedData) {
        samples = JSON.parse(storedData);
    } else {
        samples = [...initialData];
        saveData();
    }

    renderGrid(samples);
    generateForm();

    // Event Listeners
    searchInput.addEventListener('input', (e) => filterData(e.target.value));
    addBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    entryForm.addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Save to LocalStorage
function saveData() {
    localStorage.setItem('msp_samples', JSON.stringify(samples));
}

// Render the Data Grid
function renderGrid(data) {
    gridContainer.innerHTML = '';

    if (data.length === 0) {
        gridContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center; grid-column: 1/-1; padding: 40px;">No records found.</div>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card glass';

        // Use the first few important fields for preview
        const previewFields = headers.filter(h =>
            ['market_sector', 'material', 'code_color', 'dims'].includes(h.key)
        );

        let fieldsHtml = previewFields.map(header => `
            <div class="field-row">
                <span class="label">${header.label}</span>
                <span class="value" title="${item[header.key] || '-'}">${item[header.key] || '-'}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="card-header">
                <span class="id-badge">#${item.sample_id}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${item.content || 'N/A'}</span>
            </div>
            <div class="card-body">
                ${fieldsHtml}
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// Filter Data
function filterData(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = samples.filter(item => {
        return Object.values(item).some(val =>
            String(val).toLowerCase().includes(lowerQuery)
        );
    });
    renderGrid(filtered);
}

// Modal Logic
function openModal() {
    entryForm.reset();
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

// Generate Form Fields dynamically based on headers
function generateForm() {
    formFieldsDiv.innerHTML = '';

    headers.forEach(header => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.innerText = header.label;

        let input;
        if (header.type === 'select') {
            input = document.createElement('select');
            input.className = 'form-input';
            header.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.innerText = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = 'text'; // Default to text for simplicity
            input.className = 'form-input';
        }

        input.name = header.key;
        input.required = header.key === 'sample_id'; // Enforce ID

        div.appendChild(label);
        div.appendChild(input);
        formFieldsDiv.appendChild(div);
    });
}

// Handle New Record Submission
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(entryForm);
    const newRecord = {};

    formData.forEach((value, key) => {
        newRecord[key] = value;
    });

    // Simple duplicate check
    if (samples.some(s => s.sample_id === newRecord.sample_id)) {
        alert('Error: Sample ID already exists!');
        return;
    }

    samples.unshift(newRecord); // Add to top
    saveData();
    renderGrid(samples);
    closeModal();

    // Animate the new card (optional simple flash)
    // In a real React app, this would be handled by framer-motion or similar
}

// Run
init();
