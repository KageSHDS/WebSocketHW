function getRandomColor() { //* функция генерирует случайный цвет в формате HEX(16-ый цветовой код)
    const letters = "0123456789ABCDEF"; // ! все возможные символы которые могут использоваться для цвета 
    let color = "#"; //* префикс для цвета
    for (let i = 0; i < 6; i++){ //* цикл выполняется 6 раз так как цвет состоит из 6 символов
        color += letters[Math.floor(Math.random() * 16)];
        //* Math.random генерируем случайное число от 0 до 16 
        //* умножая его на 16 получаем число в диапазоне от 0 до 15
        //* Math.floor округляет значение вниз до ближайшего целого числа
        //* что бы получить индекс от 0 до 15
        //* letters использует полученный индекс для выбора случайного символа из строки
        //* этот символ добавляется к переменной color 
    }
    return color;
}

const clientColor = getRandomColor(); //* создаю переменную которая будет содержать значение цвета

const socket = new WebSocket('ws:localhost:8080'); //* создаю новый экземпляр WebSocket
//* который устанавливает соединение с сервером WebSocket(обеспечивающий двустороннюю
//* связь между клиентом и сервером)
//! localhost имя хоста указывающее что сервер запущен на том же компьютере что и клиент 
//! если бы сервер находился на другом компьютере, то указывался бы IP- адрес или доменное имя компьютера

const clientID = Math.floor(Math.random() * 10000); //* генерируем рандомный id для пользователя 

socket.onopen = () => {//* socket.onopen событие срабатывает, 
    //*когда соединение с сервером успешно установленно 
    const WelcomeMessage = ` присоединился к чату.`

    socket.send(JSON.stringify({ id: clientID, message: WelcomeMessage, color: clientColor }));
    //* использую JSON.stringify для преобразования объекта в строку 
    //* что бы его можно было отправить через WebSocket 
    //! так как WebSocket передаёт данные в виде строки 
};

socket.addEventListener('message', function(event){
	//* добавляю обработчик события message для объекта WebSocket
	//* это событие срабатывает каждый раз когда сервер
	//* отправляет сообщение клиенту через WebSocket

	const { id, message, color } = JSON.parse(event.data);
	//! использую деструктуризацию для извлечения значений
	//* id, message, color из объекта event data
	//* event data содержит строку, отправленную сервером в формате JSON
	//* и преобразую её обратно в объект

	const chatDiv = document.getElementById('chat');
	const timeToSend = new Date().toLocaleTimeString(); //* получаем текущее время
	const messageClass = id === clientID ? 'client' : 'other';
	chatDiv.innerHTML += `<div class = "message ${messageClass}" 
        style = "color: ${color}; 
        font-size: 21px; 
        line-height: 35px">
        <strong>Пользователь-${id}:</strong>${message}
        <span class = "time">${timeToSend}</span>
    </div>`;

	//* добавляю новое сообщение
	chatDiv.scrollTop = chatDiv.scrollHeight;
	//* автоматически прокручиваю область чата вниз
});

document.getElementById('sendMassage').addEventListener('click', function(){
    const input_massages = document.getElementById('input_massages');
    const message = input_massages.value;  //* извлекаю значение из текстового поля 

    if (message){ //* проверяю переменная message пустая или нет   
        socket.send(JSON.stringify({ id: clientID, message: message, color: clientColor}));
        //* отправляю сообщение через WebSocket
        //* создавая объект и преобразовывая его в строку   
        input_massages.value = ""; //* обнуляем полу 
    }
});

document.getElementById('input_massages').addEventListener('keypress', (event) =>{
	//* добавляем событие keypress означающее что функция будет срабатывать
	//* при нажатии клавиши event содержит информацию о нажатой клавише   
	if (event.key === 'Enter') {
		document.getElementById('sendMassage').click()
		//* если нажата клавиша Enter вызываю событие click для sendMassage(отправка сообщения)
	}
})
