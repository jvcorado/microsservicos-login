const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
require ('dotenv').config()

app.use(bodyParser.json());
app.use(cors({ origin:"*"}));
app.use(express.json());

const {DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE} = process.env

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD
})



app.get('/cadastrar', (req,res) =>{
    res.send(bd);
})

app.post('/cadastrar', async (req, res) => {

    const { user, password } = req.body;

    if (!user || !password) {
        res.status(400).json({ error: "Usuário e senha inválidos" });
        return;
    }

    // Verifica se o usuário já existe no banco de dados
    connection.query('SELECT * FROM usuarios WHERE user = ?', [user], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: "Erro ao cadastrar o usuário" });
        } else {
            if (results.length > 0) {
                res.status(409).json({ error: "Usuário já existente" });
            } else {
                // Insere o novo usuário no banco de dados
                connection.query('INSERT INTO usuarios (user, password) VALUES (?, ?)', [user, password], (error, results) => {
                    if (error) {
                        console.error('Erro ao inserir no banco de dados:', error);
                        res.status(500).json({ error: "Erro ao cadastrar o usuário" });
                    } else {
                        res.status(200).json({ message: "Usuário cadastrado com sucesso" });
                    }
                });
            }
        }
    });
});

app.post('/login', (req, res) => {

    const { user, password } = req.body;

    if (!user || !password) {
        res.status(400).json({ error: "Usuário e senha inválidos" });
        return;
    }

    // Verifica as credenciais no banco de dados
    connection.query('SELECT * FROM usuarios WHERE user = ? AND password = ?', [user, password], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: "Erro ao realizar o login" });
        } else {
            if (results.length > 0) {
                res.status(200).json({ message: "Login realizado com sucesso" });
            } else {
                res.status(401).json({ error: "Usuário ou senha incorretos" });
            }
        }
    });
});

app.listen(5000, ()=>{
    console.log('Servidor rodando na porta 5000')
})