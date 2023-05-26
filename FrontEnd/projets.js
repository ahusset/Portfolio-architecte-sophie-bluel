function createFigureElements(data) {
    const galleryContainer = document.querySelector('.gallery');
    galleryContainer.innerHTML = ''; // Effacer le contenu précédent

    data.forEach(element => {
        const imageElement = document.createElement('img');
        imageElement.src = element.imageUrl;
        imageElement.alt = element.title;

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.textContent = element.title;

        const figureElement = document.createElement('figure');
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);

        galleryContainer.appendChild(figureElement);
    });
}

function filterDataByCategoryId(data, categoryId) {
    if (categoryId === 0) {
        return data; // Renvoyer toutes les données si la catégorie est égale à 0
    } else {
        return data.filter(element => element.category.id === categoryId);
    }
}

// Appel à fetch pour récupérer les éléments
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        const uniqueCategories = data.reduce((acc, element) => {
            const categoryId = element.category.id;
            const existingCategory = acc.find(category => category.id === categoryId);

            if (!existingCategory) {
                acc.push(element.category);
            }

            return acc;
        }, []);
        // Récupérer les catégories uniques à partir des éléments de works
        console.log(uniqueCategories);
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            createFigureElements(data); // Afficher toutes les catégories
        });
        document.querySelector('.category-buttons').appendChild(allButton);

        uniqueCategories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.addEventListener('click', () => {
                const filteredData = filterDataByCategoryId(data, category.id);
                createFigureElements(filteredData); // Afficher les éléments filtrés par catégorie
            });
            document.querySelector('.category-buttons').appendChild(button);
        });
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des éléments :', error);
    });
