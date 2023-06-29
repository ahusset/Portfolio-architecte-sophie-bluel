// Cette fonction crée les éléments HTML pour afficher les photos dans la galerie
function createFigureElements(data) {
    const galleryContainer = document.querySelector('.gallery');
    galleryContainer.innerHTML = '';

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

// Cette fonction filtre les données en fonction de l'identifiant de catégorie
function filterDataByCategoryId(data, categoryId) {
    if (categoryId === 0) {
        return data;
    } else {
        return data.filter(element => element.category.id === categoryId);
    }
}

// Cette fonction crée une balise HTML avec une classe et un texte (optionnels)
function createBalise(balise, className, text) {
    const newBalise = document.createElement(balise);

    if (className !== undefined) {
        newBalise.classList.add(className);
    }

    if (text !== undefined) {
        newBalise.textContent = text;
    }

    return newBalise;
}

// Cette fonction ajoute un texte "modifier" et une icône d'édition à un élément
async function addModifierText(div) {
    if (!div) {
        return;
    }

    const penToSquare = await createBalise("i");
    penToSquare.classList.add("fa-regular", "fa-pen-to-square", "pen_to_square_black");
    div.appendChild(penToSquare);

    const modifierTxt = await createBalise("p", undefined, "modifier");
    div.appendChild(modifierTxt);
}

// Cette fonction insère un nouvel élément après un élément existant
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

// Cette fonction récupère les éléments de la galerie en effectuant une requête HTTP
function fetchElements() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            // Obtenir les catégories uniques à partir des données
            const uniqueCategories = data.reduce((acc, element) => {
                const categoryId = element.category.id;
                const existingCategory = acc.find(category => category.id === categoryId);

                if (!existingCategory) {
                    acc.push(element.category);
                }

                return acc;
            }, []);

            // Créer le bouton "Tous" pour afficher toutes les catégories
            const allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.classList.add('active');
            allButton.addEventListener('click', () => {
                createFigureElements(data);

                const activeButton = document.querySelector('.category-buttons button.active');
                if (activeButton) {
                    activeButton.classList.remove('active');
                }
                allButton.classList.add('active');

                const categoryButtons = document.querySelectorAll('.category-buttons button:not(:first-child)');
                categoryButtons.forEach(button => button.classList.remove('active'));
            });
            document.querySelector('.category-buttons').appendChild(allButton);

            // Créer les boutons pour chaque catégorie unique
            uniqueCategories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
                button.addEventListener('click', () => {
                    const filteredData = filterDataByCategoryId(data, category.id);
                    createFigureElements(filteredData);

                    const activeButton = document.querySelector('.category-buttons button.active');
                    if (activeButton) {
                        activeButton.classList.remove('active');
                    }
                    button.classList.add('active');

                    allButton.classList.remove('active');
                });
                document.querySelector('.category-buttons').appendChild(button);
            });

            // Afficher les éléments de la galerie
            createFigureElements(data);
        })
        .catch(error => {
            console.error('An error occurred while fetching elements:', error);
        });
}

// Cette fonction active le mode d'édition
async function editMode() {
    const body = document.querySelector("body");
    const divBanner = await createBalise("div", "div_banner");

    const penToSquareWhite = await createBalise("i");
    penToSquareWhite.classList.add("fa-regular", "fa-pen-to-square", "pen_to_square_white");

    const modeEditionText = await createBalise("p", "mode_edition_text", "Mode édition");

    const modeEditionButton = await createBalise("button", "mode_edition_button");
    const buttonText = await createBalise("p", "button_text", "publier le changements");

    const divModeEdition = await createBalise("div", "div_mode_edition");

    body.insertAdjacentElement("beforebegin", divBanner);
    divBanner.appendChild(divModeEdition);
    divModeEdition.appendChild(penToSquareWhite);
    divModeEdition.appendChild(modeEditionText);
    divBanner.appendChild(modeEditionButton);
    modeEditionButton.appendChild(buttonText);

    const imagePrincipale = document.querySelector("#introduction > figure");
    const divImagePrincipale = await createBalise("div", "div_image_principale");

    imagePrincipale.appendChild(divImagePrincipale);
    await addModifierText(divImagePrincipale);

    const buttonOpenModal = await createBalise("button", "button_create_modal");
    const titleMesProjects = document.querySelector(".title_mes_projects");
    const divTitleMesProjects = await createBalise("div", "div_title_mes_projects");

    titleMesProjects.appendChild(divTitleMesProjects);
    divTitleMesProjects.appendChild(buttonOpenModal);
    await addModifierText(buttonOpenModal);
}

// Cette fonction crée le modal pour afficher la galerie de photos
async function createModal() {
    const modal = document.querySelector(".modal");

    const divModal = await createBalise("div", "div_modal");
    const divPhoto = await createBalise("div", "div_photo");
    const buttonTopModal = await createBalise("button", "button_top_modal");
    const titreModal = await createBalise("h3", "titre_modal", "Galerie photo");
    const iconButtonTop = await createBalise("i");
    iconButtonTop.classList.add("fa-solid", "fa-xmark");
    const buttonAddPhoto = await createBalise("button", "button_add_photo", "Ajouter une photo");
    const deleteAllGallery = await createBalise("a", "delete_all_galery", "Supprimer la galerie");
    const contenuModal = await createBalise("div", "contenu_modal");
    const divFooterModal = await createBalise("div", "div_footer_modal");
    const divButtonTopModal = await createBalise("div", "div_button_top_modal");
    const divTitleModal = await createBalise("div", "div_title_modal");

    divButtonTopModal.appendChild(buttonTopModal);
    buttonTopModal.appendChild(iconButtonTop);

    divTitleModal.appendChild(titreModal);

    divFooterModal.appendChild(buttonAddPhoto);
    divFooterModal.appendChild(deleteAllGallery);

    divModal.appendChild(divButtonTopModal);
    divModal.appendChild(divTitleModal);

    contenuModal.appendChild(divModal);
    contenuModal.appendChild(divPhoto);
    contenuModal.appendChild(divFooterModal);

    modal.appendChild(contenuModal);

    printWorksModal();
}

// Cette fonction affiche les travaux (photos) dans le modal de la galerie
async function printWorksModal() {
    const divPhoto = document.querySelector(".div_photo");

    const response = await fetch("http://localhost:5678/api/works");
    const myFetch = await response.json();

    divPhoto.innerHTML = '';

    for (const work of myFetch) {
        const textEditer = await createBalise("p", "text_editer", "éditer");
        const trashCanIcone = await createBalise("i");
        trashCanIcone.classList.add("fa-solid", "fa-trash-can", "fa-xs");
        const buttonTrash = await createBalise("button", "button_trash");
        const worksModalImage = await createBalise("img");
        worksModalImage.src = work.imageUrl;
        const modalPhoto = await createBalise("div", "modal_photo");
        const divTrashCan = await createBalise("div", "div_trash_can");
        const divIconeMove = createBalise("div", "div_icone_move");
        const iconeMove = createBalise("i", "icone_move");
        iconeMove.classList.add("fa-solid", "fa-up-down-left-right");

        buttonTrash.setAttribute("id", work.id);

        modalPhoto.appendChild(worksModalImage);
        modalPhoto.appendChild(textEditer);
        modalPhoto.appendChild(divTrashCan);
        divTrashCan.appendChild(buttonTrash);
        buttonTrash.appendChild(trashCanIcone);
        divTrashCan.before(divIconeMove);
        divIconeMove.appendChild(iconeMove);

        divIconeMove.style.visibility = "hidden";

        modalPhoto.addEventListener("mouseenter", () => {
            divIconeMove.style.visibility = "visible";
        });

        modalPhoto.addEventListener("mouseleave", () => {
            divIconeMove.style.visibility = "hidden";
        });

        buttonTrash.onclick = function () {
            buttonDeleteOneWork(buttonTrash, modalPhoto);
        };

        divPhoto.appendChild(modalPhoto);
    }
}

// Cette fonction ajoute le modal pour ajouter une photo à la galerie
async function addPhotoGallery() {
    const divModalAddPhoto = document.querySelector(".modal_add_photo");

    const buttonArrowLeft = await createBalise("button", "button_arrow_left");
    const arrowLeftIcon = await createBalise("i");
    arrowLeftIcon.classList.add("fa-solid", "fa-arrow-left");

    const titleModalAddPhoto = await createBalise("h3", "title_modal", "Ajout photo");

    const buttonTopModal = await createBalise("button", "button_top");
    const iconButtonTop = await createBalise("i");
    iconButtonTop.classList.add("fa-solid", "fa-xmark");

    const divAddPhoto = await createBalise("div", "div_add_photo");
    const iconPicture = await createBalise("i");
    iconPicture.classList.add("fa-regular", "fa-image");

    const buttonAddPhoto = await createBalise("button");
    buttonAddPhoto.classList.add("button_add_photo", "button_add_photo_modal");
    const textMaxMo = await createBalise("p", "text_max_mo", "jpg.png : 4mo max");

    const divForm = await createBalise("div", "div_form");
    const form = await createBalise("form", "form");

    const formLabelTitre = await createBalise("label", "form_label_titre", "Titre");
    const formInputTitre = await createBalise("input", "form_input_titre");

    const formLabelCategorie = await createBalise("label", "form_label_categorie", "Catégorie");
    const formSelectCategorie = await createBalise("select", "form_select_categorie");

    const formButtonValider = await createBalise("button", "form_button_valider", "Valider");

    const divTopModalAddPhoto = await createBalise("div", "div_top_add_photo");
    const divBottomModalAddPhoto = await createBalise("div", "div_bottom_add_photo");

    const contenuModal = await createBalise("div", "contenu_modal");
    const divTitle = await createBalise("div", "div_title");

    const inputImageFile = await createBalise("input", "input_image_file");
    inputImageFile.setAttribute("type", "file");
    inputImageFile.setAttribute("accept", ".jpg, .jpeg, .png");
    inputImageFile.hidden = true;

    const labelButtonAddPhoto = await createBalise("label", "label_button_add_photo", "+ Ajouter photo");

    const divFormLabelTitre = await createBalise("div", "div_form_label_titre");
    const divFormSelectCategorie = await createBalise("div", "div_form_select_categorie");

    const outputImage = await createBalise("output", "output_image");

    divModalAddPhoto.innerHTML = '';

    divModalAddPhoto.appendChild(contenuModal);
    contenuModal.appendChild(divTopModalAddPhoto);
    divTopModalAddPhoto.appendChild(buttonArrowLeft);
    buttonArrowLeft.appendChild(arrowLeftIcon);

    contenuModal.appendChild(divTitle);
    divTitle.appendChild(titleModalAddPhoto);

    divTopModalAddPhoto.appendChild(buttonTopModal);
    buttonTopModal.appendChild(iconButtonTop);

    contenuModal.appendChild(divAddPhoto);
    divAddPhoto.appendChild(outputImage);
    divAddPhoto.appendChild(iconPicture);
    divAddPhoto.appendChild(buttonAddPhoto);
    buttonAddPhoto.appendChild(labelButtonAddPhoto);
    labelButtonAddPhoto.appendChild(inputImageFile);
    divAddPhoto.appendChild(textMaxMo);

    contenuModal.appendChild(divForm);
    divForm.appendChild(form);
    form.appendChild(divFormLabelTitre);
    divFormLabelTitre.appendChild(formLabelTitre);
    divFormLabelTitre.appendChild(formInputTitre);
    form.appendChild(divFormSelectCategorie);
    divFormSelectCategorie.appendChild(formLabelCategorie);
    divFormSelectCategorie.appendChild(formSelectCategorie);
    divForm.appendChild(divBottomModalAddPhoto);
    divBottomModalAddPhoto.appendChild(formButtonValider);

    printCategories(formSelectCategorie);
}

// Cette fonction affiche les catégories dans le formulaire de sélection
async function printCategories(formSelectCategorie) {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    for (const category of categories) {
        const optionSelect = await createBalise("option", "option_select", category.name);
        optionSelect.setAttribute("id", category.id);

        formSelectCategorie.appendChild(optionSelect);
    }

    const optionSelectDisabled = await createBalise("option", "option_defaut", "");
    optionSelectDisabled.setAttribute("value", "disabled");
    optionSelectDisabled.setAttribute("id", "0");

    formSelectCategorie.prepend(optionSelectDisabled);
}

// Cette fonction ouvre le modal de la galerie
async function openModal() {
    const modalGalery = document.getElementsByClassName("modal")[0];
    const buttonOpenModal = document.getElementsByClassName("button_create_modal")[0];

    buttonOpenModal.onclick = function () {
        modalGalery.style.display = "flex";
    };
}

// Cette fonction ferme les modals de la galerie et de l'ajout de photo
function closeModal() {
    const modalGallery = document.querySelector(".modal");
    const modalAddPhoto = document.querySelector(".modal_add_photo");
    const buttonCloseGallery = document.getElementsByClassName("button_top_modal")[0];
    const buttonCloseModal = document.getElementsByClassName("button_top")[0];
    const arrowLeft = document.querySelector(".button_arrow_left");

    const closeModals = () => {
        modalGallery.style.display = "none";
        modalAddPhoto.style.display = "none";
        resetModalAddPhoto();
    };

    window.onclick = function (event) {
        if (event.target == modalGallery || event.target == modalAddPhoto) {
            closeModals();
        }
    };

    buttonCloseGallery.onclick = closeModals;
    buttonCloseModal.onclick = closeModals;

    arrowLeft.onclick = function () {
        modalAddPhoto.style.display = "none";
        modalGallery.style.display = "flex";
        resetModalAddPhoto();
    };
}

// Cette fonction réinitialise le formulaire d'ajout de photo
function resetModalAddPhoto() {
    const modalAddPhoto = document.querySelector(".modal_add_photo");
    const image = document.querySelector(".input_image_file");
    const title = document.querySelector(".form_input_titre");
    const categorie = document.querySelector(".form_select_categorie");
    const iconeImage = document.querySelector(".fa-image");
    const buttonAddPhotoModal = document.querySelector(".button_add_photo_modal");
    const textMaxMo = document.querySelector(".text_max_mo");
    const divAddPhoto = document.querySelector(".div_add_photo");

    const imagePrint = document.querySelector(".image");
    if (imagePrint) {
        imagePrint.parentElement.remove();
    }

    modalAddPhoto.style.display = "none";
    title.value = "";
    categorie.value = "";
    image.value = "";
    iconeImage.style.display = "flex";
    buttonAddPhotoModal.style.display = "flex";
    textMaxMo.style.display = "flex";
    divAddPhoto.style.padding = "30px";

    location.reload();
}

// Cette fonction lit l'image sélectionnée par l'utilisateur
function readImage() {
    const input = document.querySelector("input");
    const output = document.querySelector("output");
    const iconeImage = document.querySelector(".fa-image");
    const buttonAddPhotoModal = document.querySelector(".button_add_photo_modal");
    const textMaxMo = document.querySelector(".text_max_mo");
    const divAddPhoto = document.querySelector(".div_add_photo");

    input.addEventListener("change", () => {
        // Vérification que l'image n'est pas supérieure à 4 Mo
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const maxFileSize = 4 * 1024 * 1024; // 4 Mo en octets
            if (file.size > maxFileSize) {
                alert("Le fichier sélectionné est trop volumineux. Veuillez choisir un fichier de moins de 4 Mo.");
                input.value = "";
                return;
            }
        }

        const file = input.files[0];
        const divImage = createBalise("div", "div_image");
        const image = createBalise("img", "image");

        image.src = URL.createObjectURL(file);
        image.width = 129;
        image.height = 193;
        iconeImage.style.display = "none";
        buttonAddPhotoModal.style.display = "none";
        textMaxMo.style.display = "none";
        divAddPhoto.style.padding = "0";

        output.appendChild(divImage);
        divImage.appendChild(image);
    });
}

// Cette fonction envoie les données de l'image sélectionnée au serveur
function postImage() {
    const input = document.querySelector("input");
    const select = document.querySelector("select");
    const inputTitre = document.querySelector(".form_input_titre");

    input.addEventListener("change", () => {
        callTest();
    });
    inputTitre.addEventListener("change", () => {
        callTest();
    });
    select.addEventListener("change", () => {
        callTest();
    });
}

// Cette fonction vérifie si tous les champs sont remplis pour activer le bouton de validation
function callTest() {
    const image = document.querySelector(".image");
    const title = document.querySelector(".form_input_titre");
    const categorie = document.querySelector(".form_select_categorie");
    const button = document.querySelector(".form_button_valider");

    if (image != null && title.value != "" && categorie.value != "disabled") {
        button.style.background = "#1D6154";
    } else {
        button.style.background = "#A7A7A7";
    }
}

// Cette fonction active les différents éléments de la galerie et de l'ajout de photo
function activate() {
    const modalAddPhoto = document.querySelector(".modal_add_photo");
    const buttonModalAddPhoto = document.querySelector(".button_add_photo");
    const modalGalery = document.querySelector(".modal");
    const formButtonValider = document.querySelector(".form_button_valider");
    const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4 Mo en octets

    buttonModalAddPhoto.addEventListener("click", () => {
        modalAddPhoto.style.display = "flex";
        modalGalery.style.display = "none";
    });

    formButtonValider.addEventListener("click", () => {
        const image = document.querySelector(".input_image_file");
        const title = document.querySelector(".form_input_titre");
        const categorie = document.querySelector(".form_select_categorie");

        console.log("image.size =", image.files[0].size);
        // Vérification que le fichier est inférieur à 4 Mo
        if (image.files[0].size > MAX_IMAGE_SIZE) {
            console.log("La taille de l'image dépasse la limite de 4 Mo");
            return;
        }

        const idNumber = categorie.selectedIndex;
        const categorieId = categorie.options[idNumber].id;

        const sendWork = new FormData();
        sendWork.append("image", image.files[0]);
        sendWork.append("title", title.value);
        sendWork.append("category", categorieId);

        // Envoi d'une œuvre (photo pour la galerie)
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
            body: sendWork,
        })
            .then(function (response) {
                // Réinitialiser le formulaire d'ajout de photo
                if (response.ok) {
                    console.log("Envoyé");
                    resetModalAddPhoto();
                    printWorksModal();
                } else {
                    console.log("Non envoyé");
                }
            });
    });

    console.log("modalGalery.style.display =", modalGalery.style.display);
    if (modalGalery.style.display === "none") {
        console.log("display != none");
        const modalPhoto = document.querySelector(".modal_photo");

        modalPhoto.addEventListener("mouseover", function (event) {
            console.log("hover");
        });
    }
    button_logout_press();
}

// Cette fonction gère le bouton de déconnexion
function button_logout_press() {
    const button_logout = document.getElementById("id_login");

    button_logout.onclick = function () {
        window.localStorage.removeItem("token");
        location.replace("index.html");
    };
}

// Cette fonction supprime une œuvre de la galerie lors du clic sur le bouton de suppression correspondant
function buttonDeleteOneWork(buttonDelete, modalPhoto) {
    modalPhoto.remove();

    const id = buttonDelete.getAttribute("id");

    console.log("number = %d", id);
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
    }).then((response) => {
        if (response.ok) {
            modalPhoto.remove();
        }
    });
}

// Fonction principale
async function main() {
    fetchElements();

    document.addEventListener("DOMContentLoaded", async function () {
        if (window.localStorage.getItem("token")) {
            // Si le token est présent
            var loginElement = document.querySelector('a[href="login.html"]');
            if (loginElement) {
                loginElement.textContent = "Déconnexion";
            }
            // Appeler la fonction editMode
            await editMode();
            await createModal();
            await addPhotoGallery();
            await openModal();
            await closeModal();
            readImage();
            postImage();
            activate();
        }
    });
}

main();
