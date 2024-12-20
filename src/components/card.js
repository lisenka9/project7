export function createCard({ name, link, likes = [], _id, owner }, cardTemplate, popupImage, popupCaption, openModal, userId, deleteCard, toggleLike) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeCount = cardElement.querySelector('.card__like-count');
    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;
    likeCount.textContent = likes.length; 
    if (owner._id !== userId) {
        deleteButton.style.display = 'none';
    }
    if (likes.some(like => like._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    }
    likeButton.addEventListener('click', () => {
        const isLiked = likeButton.classList.contains('card__like-button_is-active');
        toggleLike(_id, isLiked) 
            .then(updatedCard => {
                likeCount.textContent = updatedCard.likes.length; 
                likeButton.classList.toggle('card__like-button_is-active', !isLiked); 
            })
            .catch(err => {
                console.error(`Ошибка при обновлении лайка: ${err}`);
            });
    });
    deleteButton.addEventListener('click', () => {
        deleteCard(_id)
            .then(() => {
                cardElement.remove(); 
            })
            .catch(err => {
                console.error(`Не удалось удалить карточку: ${err}`);
            });
    });
    cardImage.addEventListener('click', () => {
        popupImage.src = link;
        popupImage.alt = name;
        popupCaption.textContent = name;
        openModal(popupImage.closest('.popup'));
    });
    return cardElement;
}