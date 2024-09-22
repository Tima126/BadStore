const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();

// Настройка body-parser для обработки JSON
app.use(bodyParser.json());

// Настройка подключения к MongoDB
const uri = 'mongodb://localhost:27017'; // Замените на ваш URI подключения к MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Роут для регистрации
app.post('/auth/register', async (req, res) => {
    const { username, lastname, patronymic, email, password } = req.body;

    try {
        await client.connect();
        const database = client.db('your_database_name'); // Замените на имя вашей базы данных
        const collection = database.collection('users');

        const user = {
            username,
            lastname,
            patronymic,
            email,
            password
        };

        await collection.insertOne(user);

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    } finally {
        await client.close();
    }
});

// Роут для входа
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.connect();
        const database = client.db('your_database_name'); // Замените на имя вашей базы данных
        const collection = database.collection('users');

        const user = await collection.findOne({ username, password });

        if (user) {
            res.status(200).json({ message: 'Успешный вход' });
        } else {
            res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    } finally {
        await client.close();
    }
});

// Указываем Express обслуживать статические файлы из директории 'public'
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Сервер запущен по адресу http://localhost:3000');
});