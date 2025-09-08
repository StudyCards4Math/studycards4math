document.addEventListener("DOMContentLoaded", function() {
    const tagDiv = document.getElementById('tag');
    const cardDiv = document.getElementById('card');
    const pagingDiv = document.getElementById('paging');
    const tagCloudButton = document.getElementById('tagCloudButton');

    let imagesData = [];
    let currentImages = [];
    let currentIndex = 0;

    // Initially, only display the tag div
    cardDiv.style.display = 'none';
    pagingDiv.style.display = 'none';

    // Function to read CSV file
    fetch('/data/card_tag.csv')
        .then(response => response.text())
        .then(data => {
            processCSV(data);
        });

    function processCSV(data) {
        const rows = data.split('\n');
        let tags = new Set();

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(';');
            if (columns.length > 1) {
                const tagList = columns[1].split(',');
                tagList.forEach(tag => tags.add(tag.trim()));

                imagesData.push({
                    image: `/img/studycard/${columns[0].trim()}`,
                    tags: tagList.map(tag => tag.trim())
                });
            }
        }

        displayTags(Array.from(tags).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
    }

    function displayTags(tags) {
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container');

        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('btn', 'btn-primary', 'm-1', 'tag-element');
            tagElement.textContent = tag;
            tagElement.style.cursor = 'pointer';
            tagElement.addEventListener('click', () => onTagClick(tag));
            tagContainer.appendChild(tagElement);
        });

        tagDiv.appendChild(tagContainer);
    }

    function onTagClick(tag) {
        currentImages = imagesData.filter(item => item.tags.includes(tag)).map(item => item.image);
        currentIndex = 0;
        displayImage();
        displayPaging();
        tagDiv.style.display = 'none';
        tagCloudButton.style.display = 'block';
    }

    tagCloudButton.addEventListener('click', () => {
        tagDiv.style.display = 'block';
        cardDiv.style.display = 'none';
        pagingDiv.style.display = 'none';
        tagCloudButton.style.display = 'none';
    });

    function displayImage() {
        cardDiv.innerHTML = '';
        if (currentImages.length > 0) {
            const imgElement = document.createElement('img');
            imgElement.src = currentImages[currentIndex];
            imgElement.classList.add('img-fluid', 'd-block', 'mx-auto');
            imgElement.style.maxHeight = 'calc(100vh - 200px)'; // Adjust height to fit within the viewport
            imgElement.style.objectFit = 'contain'; // Maintain aspect ratio
            cardDiv.appendChild(imgElement);
            cardDiv.style.display = 'block';
        } else {
            cardDiv.style.display = 'none';
        }
    }

    function displayPaging() {
        pagingDiv.innerHTML = '';
        if (currentImages.length > 1) {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'w-100');

            const prevButton = document.createElement('button');
            prevButton.textContent = '< Előző';
            prevButton.classList.add('btn', 'btn-secondary', 'm-1');
            prevButton.addEventListener('click', showPreviousImage);

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Következő >';
            nextButton.classList.add('btn', 'btn-secondary', 'm-1');
            nextButton.addEventListener('click', showNextImage);

            const infoText = document.createElement('span');
            infoText.classList.add('mx-2');
            infoText.textContent = `${currentIndex + 1} / ${currentImages.length}`;

            buttonContainer.appendChild(prevButton);
            buttonContainer.appendChild(infoText);
            buttonContainer.appendChild(nextButton);

            pagingDiv.appendChild(buttonContainer);
            pagingDiv.style.display = 'block';
        } else {
            pagingDiv.style.display = 'none';
        }
    }

    function showPreviousImage() {
        if (currentIndex > 0) {
            currentIndex--;
            displayImage();
            displayPaging();
        }
    }

    function showNextImage() {
        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            displayImage();
            displayPaging();
        }
    }
});
