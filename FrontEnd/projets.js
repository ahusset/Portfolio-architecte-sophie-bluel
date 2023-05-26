fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Affiche les données de l'API
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
