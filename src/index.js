import './pages/index.css';
import { Validation } from './components/validate.js';
import { createCard } from './components/card.js';
import { openModal, closeModal, closePopupOnOverlayClick } from './components/modal.js';
import { getCards, updateProfile, getProfile, addCard, deleteCard, toggleLike, updateAvatar } from './components/api.js';

const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_invalid',
    errorClass: 'popup__error_visible'
};

function toggleSubmitButtonState(button, isLoading, loadingText = 'Сохранение...') {
    if (isLoading) {
        button.textContent = loadingText;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.defaultText || 'Сохранить';
        button.disabled = false;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    Validation(validationSettings);
});


const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
    popup.classList.add('popup_is-animated');
});

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar-edit');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileCloseButton = profilePopup.querySelector('.popup__close');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const imagePopupCloseButton = imagePopup.querySelector('.popup__close');
const avatarButton = document.querySelector('.profile__edit-image-button');
const avatarImageButton = document.querySelector('.profile__avatar-edit-icon');
const avatarCloseButton = avatarPopup.querySelector('.popup__close');
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');
const profileForm = profilePopup.querySelector('.popup__form');
const cardForm = cardPopup.querySelector('.popup__form');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarPopup.querySelector('.popup__input_type_url');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Добавление карточек с сервера
function renderCardsFromServer() {
    let userId;
    getProfile()
        .then(profile => {
            userId = profile._id; 
            return getCards();  
        })
        .then(cards => {
            cards.forEach(cardData => {
                const card = createCard(
                    {
                        name: cardData.name,
                        link: cardData.link,
                        likes: cardData.likes,
                        _id: cardData._id,
                        owner: cardData.owner 
                    },
                    cardTemplate,
                    popupImage,
                    popupCaption,
                    openModal,
                    userId, 
                    deleteCard, 
                    toggleLike
                );
                placesList.append(card);
            });
        })
        .catch(err => {
            console.error(`Ошибка при загрузке карточек: ${err}`);
        });
}

profileEditButton.addEventListener('click', () => {
    nameInput.value = document.querySelector('.profile__title').textContent;
    jobInput.value = document.querySelector('.profile__description').textContent;
    openModal(profilePopup);
});

avatarButton.addEventListener('click', () => {
    avatarForm.reset();
    openModal(avatarPopup);
});

avatarImageButton.addEventListener('click', () => {
    avatarForm.reset();
    openModal(avatarPopup);
});

// Обработчик отправки формы аватара профиля
avatarForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const submitButton = avatarForm.querySelector('.popup__button');
    toggleSubmitButtonState(submitButton, true);
    const link = avatarLinkInput.value;
    updateAvatar(link)
        .then(() => {
            document.querySelector('.profile__image').style.backgroundImage = `url(${link})`;
            closeModal(avatarPopup);  
        })
        .catch(err => {
            console.error('Ошибка при обновлении аватара:', err);
        })
        .finally(() => {
            toggleSubmitButtonState(submitButton, false);
        });
});

// Обработчик отправки формы редактирования профиля
profileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();  
    const submitButton = profileForm.querySelector('.popup__button');
    toggleSubmitButtonState(submitButton, true);
    const name = nameInput.value;
    const about = jobInput.value;
    updateProfile(name, about)
      .then(() => {
        getProfile()
          .then(data => {
            document.querySelector('.profile__title').textContent = data.name;
            document.querySelector('.profile__description').textContent = data.about;
            closeModal(profilePopup);  
          })
          .catch(err => {
            console.error('Ошибка при получении данных профиля:', err);
          });
      })
      .catch(err => {
        console.error('Ошибка при обновлении данных профиля на сервере:', err);
      })
      .finally(() => {
        toggleSubmitButtonState(submitButton, false);
    });
});

// Обработчик отправки формы карточек
cardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();  
    let userId = getProfile()
        .then(profile => {
            userId = profile._id; 
        })
    const submitButton = cardForm.querySelector('.popup__button');
    toggleSubmitButtonState(submitButton, true);
    const name = cardNameInput.value;  
    const link = cardLinkInput.value; 
    addCard(name, link)
        .then(cardData => {
            const newCard = createCard(
                {
                    name: cardData.name,
                    link: cardData.link,
                    likes: cardData.likes,
                    _id: cardData._id,
                    owner: cardData.owner 
                },
                cardTemplate,
                popupImage,
                popupCaption,
                openModal,
                userId, 
                deleteCard, 
                toggleLike
            );
            placesList.prepend(newCard);  
            closeModal(cardPopup);  
            cardForm.reset();  
        })
        .catch(err => {
            console.error('Ошибка при добавлении карточки:', err);
        })
        .finally(() => {
            toggleSubmitButtonState(submitButton, false);
        });
});

addCardButton.addEventListener('click', () => {
    cardForm.reset();
    openModal(cardPopup);
});

profileCloseButton.addEventListener('click', () => closeModal(profilePopup));
cardCloseButton.addEventListener('click', () => closeModal(cardPopup));
imagePopupCloseButton.addEventListener('click', () => closeModal(imagePopup));
avatarCloseButton.addEventListener('click', () => closeModal(avatarPopup));

popups.forEach((popup) => {
    popup.addEventListener('mousedown', closePopupOnOverlayClick);
});

document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile__image');
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    profileTitle.style.visibility = 'hidden';
    profileDescription.style.visibility = 'hidden';
    profileImage.style.validationSettings = 'hidden';
    getProfile()
        .then(data => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            profileImage.style.backgroundImage = `url(${data.avatar})`;
            profileTitle.style.visibility = 'visible';
            profileDescription.style.visibility = 'visible';
            profileImage.style.visibility = 'visible';
        })
        .catch(err => {
            console.error('Ошибка при загрузке данных профиля:', err);
        });
    Validation(validationSettings);
    renderCardsFromServer();
}); 