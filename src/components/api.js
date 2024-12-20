const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
        authorization: 'a2f2f6a1-af28-4095-954c-48b532b948dd',
        'Content-Type': 'application/json'
    }
};

function check(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

// Получение карточек
export function getCards() {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    }).then(check);
}

// Обновление профиля
export function updateProfile(name, about) {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ name, about })
    }).then(check);
}

// Получение данных профиля
export function getProfile() {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(check);
}

// Добавление новой карточки
export function addCard(name, link) {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({ name, link })
    })
    .then(check)
    .catch(err => {
        console.error('Ошибка при добавлении карточки:', err);
    });
}

// Удаление карточки
export function deleteCard(cardId) {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(check)
    .catch(err => {
        console.error(`Ошибка при удалении карточки: ${err}`);
    });
}

export function toggleLike(cardId, isLiked) {
    const method = isLiked ? 'DELETE' : 'PUT'; 
    return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
        method,
        headers: config.headers
    })
    .then(check)
    .catch(err => {
        console.error(`Ошибка: ${err}`);
    });
}

// Обновление аватара
export function updateAvatar(avatarUrl) {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ avatar: avatarUrl })
    })
    .then(check)
    .catch(err => {
        console.error(`Ошибка при обновлении аватара: ${err}`);
    });
}