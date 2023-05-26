fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        // Sélection du conteneur <div> avec la classe "gallery"
        const galleryContainer = document.querySelector('.gallery');

        // Boucle sur tous les éléments du tableau de résultats
        data.forEach(element => {
            // Création de l'élément <img> avec attribut 'alt'
            const imageElement = document.createElement('img');
            imageElement.src = element.imageUrl;
            imageElement.alt = element.title;

            // Création de l'élément <figcaption>
            const figcaptionElement = document.createElement('figcaption');
            figcaptionElement.textContent = element.title;

            // Création de l'élément <figure> pour contenir l'image et la légende
            const figureElement = document.createElement('figure');
            figureElement.appendChild(imageElement);
            figureElement.appendChild(figcaptionElement);

            // Ajouter l'élément <figure> au conteneur <div> avec la classe "gallery"
            galleryContainer.appendChild(figureElement);
        });
    })
    .catch(error => {
        console.error('Une erreur s\'est produite :', error);
    });
