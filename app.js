// JavaScript logic for Replace The Rich Dude

const famousPersonSelect = document.getElementById('famous-person');
const famousImage = document.getElementById('famous-image');
const itemSelect = document.getElementById('item');
const quantityInput = document.getElementById('quantity');
const addItemButton = document.getElementById('add-item');
const finishButton = document.getElementById('finish-button');
const remainingNetWorthDisplay = document.getElementById('remaining-net-worth');
const replacementList = document.getElementById('replacement-list');
const finishMessages = document.getElementById('finish-messages');

let initialNetWorth = parseInt(famousPersonSelect.value);
let remainingNetWorth = initialNetWorth;
const replacements = [];

// Update Image and Net Worth on Person Selection
famousPersonSelect.addEventListener('change', () => {
    initialNetWorth = parseInt(famousPersonSelect.value);
    remainingNetWorth = initialNetWorth;
    const imageUrl = famousPersonSelect.options[famousPersonSelect.selectedIndex].getAttribute('data-image');
    famousImage.src = imageUrl;
    famousImage.style.clipPath = 'inset(0% 0% 0% 0%)';
    updateNetWorthDisplay();
    replacementList.innerHTML = ''; // Clear replacements on person change
    replacements.length = 0; // Clear the replacements array
    finishMessages.innerHTML = ''; // **Clear finish messages explicitly**
});

// Update Net Worth Display
function updateNetWorthDisplay() {
    remainingNetWorthDisplay.textContent = `£${remainingNetWorth.toLocaleString()}`;
    const cropPercentage = 100 - (remainingNetWorth / initialNetWorth) * 100;
    famousImage.style.clipPath = `inset(${cropPercentage}% 0% 0% 0%)`;
}

// Add Replacement Item

addItemButton.addEventListener('click', () => {
    const itemCost = parseInt(itemSelect.value);
    const quantity = parseInt(quantityInput.value);
    const itemName = itemSelect.options[itemSelect.selectedIndex].text;

    if (!isNaN(itemCost) && !isNaN(quantity) && quantity > 0) {
        const totalCost = itemCost * quantity;

        if (totalCost <= remainingNetWorth) {
            remainingNetWorth -= totalCost;

            // Check if item already exists in the replacements
            let existingItem = replacements.find(replacement => replacement.item === itemName);
            if (existingItem) {
                // Update quantity and total cost
                existingItem.quantity += quantity;
                existingItem.totalCost += totalCost;

                // Update the displayed quantity
                const itemElement = document.querySelector(`.replacement-item[data-item="${itemName}"] .quantity`);
                itemElement.textContent = `Quantity: ${existingItem.quantity}`;
            } else {
                // Add new replacement item
                const replacementItem = document.createElement('div');
                replacementItem.className = 'replacement-item';
                replacementItem.setAttribute('data-item', itemName);
                replacementItem.innerHTML = `
                    <span>${itemName}</span>
                    <span class="quantity">Quantity: ${quantity}</span>
                    <button class="remove-item">Remove</button>
                `;

                replacementList.appendChild(replacementItem);
                replacements.push({ item: itemName, quantity, totalCost });

                // Add Remove Functionality
                replacementItem.querySelector('.remove-item').addEventListener('click', () => {
                    remainingNetWorth += totalCost;
                    replacements.splice(replacements.indexOf(existingItem), 1);
                    replacementItem.remove();
                    updateNetWorthDisplay();
                });
            }

            updateNetWorthDisplay();
        } else {
            alert('Sorry, more grifting needed before we can do that.');
        }
    }
});

// Finish Button Functionality
finishButton.addEventListener('click', () => {
    finishMessages.innerHTML = ''; // Clear previous messages

    if (replacements.length === 0) {
        finishMessages.textContent = 'No replacements have been made yet.';
        return;
    }

    replacements.forEach(({ item, quantity }) => {
        let message = '';
        switch (item) {
            case 'Teachers (6,500 needed in the UK)':
                message = `${quantity.toLocaleString()} extra teachers. Well done, you've given ${Math.round(quantity * 26).toLocaleString()} people a proper chance at life.`;
                break;
            case 'Nurses (40,000 needed in the UK)':
                message = `${quantity.toLocaleString()} extra nurses. Well done, you've unfucked the NHS by ${Math.round(quantity * 0.0025 * 100) / 100}%`;
                break;
            case 'Social Workers (13,000 needed in the UK)':
                message = `${quantity.toLocaleString()} extra social workers. Well done, you've protected ${Math.round(quantity * 18).toLocaleString()} vulnerable people from abuse.`;
                break;
            case 'Free meals (9,464,000 needed a day in the UK)':
                message = `${quantity.toLocaleString()} free meals. Well done, you've allowed ${quantity.toLocaleString()} people to ${quantity > 1 ? 's' : ''} not go hungry.`;
                break;
            case 'GPs (5,000 needed in the UK)':
                message = `${quantity.toLocaleString()} extra GPs. Well done, you've reduced the time to see a doctor by ${Math.round(quantity * 0.002).toLocaleString()} day(s).`;
                break;
            case 'Affordable homes (500,000 needed in the UK)':
                message = `${quantity.toLocaleString()} more affordable homes. Well done, you've stopped ${Math.round(quantity * 2).toLocaleString()} people worrying about homelessness.`;
                break;
            case 'Free beer for all':
                message = `${quantity.toLocaleString()}. Free beer for all. You fucking legend`;
                break;
        }
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        finishMessages.appendChild(messageElement);
    });
});

// Initialize Default State
famousPersonSelect.dispatchEvent(new Event('change'));
