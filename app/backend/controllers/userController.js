const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../db'); 

// Función para registrar un usuario
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellidos, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        console.log(email);
        const [user] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
        console.log(user);
        console.log(user.length);
        if (user && user.length > 0) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar el usuario en la base de datos
        await db.query('INSERT INTO Usuarios (nombre, apellidos, email, password) VALUES (?, ?, ?, ?)', 
            [nombre, apellidos, email, hashedPassword]);
        
        res.status(201).json({ msg: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar usuario', error });
    }
};

// Funcion para iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

module.exports = { registerUser, loginUser };