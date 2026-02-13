const express = require('express');
const cors = require('cors');
const { sql, connectDB } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Ruta para guardar consulta
app.post('/api/consulta', async (req, res) => {
    const { email, mensaje } = req.body;

    try {
        const pool = await sql.connect();

        // 🔎 1. Verificar si el usuario existe
        const usuario = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`
                SELECT id_usuario 
                FROM Usuario 
                WHERE email = @email
            `);

        if (usuario.recordset.length === 0) {
            return res.status(400).json({
                message: "El usuario no está registrado. Debe registrarse primero."
            });
        }

        const id_usuario = usuario.recordset[0].id_usuario;

        // 📝 2. Insertar consulta
        await pool.request()
            .input('mensaje', sql.VarChar, mensaje)
            .input('id_usuario', sql.Int, id_usuario)
            .query(`
                INSERT INTO Consulta (descripcion, fecha, id_usuario)
                VALUES (@mensaje, GETDATE(), @id_usuario)
            `);

        res.json({ message: "Consulta guardada correctamente" });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
// Ruta para registrar usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const pool = await sql.connect();

        // Verificar si ya existe el email
        const usuarioExistente = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`
                SELECT * FROM Usuario WHERE email = @email
            `);

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Insertar usuario
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query(`
                INSERT INTO Usuario (nombre, email, password)
                VALUES (@nombre, @email, @password)
            `);

        res.json({ message: "Usuario registrado correctamente" });

    } catch (err) {
    console.error("ERROR REGISTRO:", err);
    res.status(500).json({ message: err.message });
}  
});
 // Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await sql.connect();

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query(`
                SELECT id_usuario, nombre, tipo
                FROM Usuario
                WHERE email = @email AND password = @password
            `);

        if (result.recordset.length === 0) {
            return res.status(400).json({
                message: "Credenciales incorrectas"
            });
        }

        res.json(result.recordset[0]);

    } catch (err) {
        console.error("ERROR LOGIN:", err);
        res.status(500).json({ message: err.message });
    }
});

    // Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const pool = await sql.connect();

        const result = await pool.request().query(`
            SELECT id_usuario, nombre, email, tipo, activo
            FROM Usuario
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("ERROR USUARIOS:", err);
        res.status(500).json({ message: err.message });
    }
});

    app.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.body;

    try {
        const pool = await sql.connect();

        await pool.request()
            .input('id', sql.Int, id)
            .input('tipo', sql.VarChar, tipo)
            .query(`
                UPDATE Usuario
                SET tipo = @tipo
                WHERE id_usuario = @id
            `);

        res.json({ message: "Usuario actualizado" });

    } catch (err) {
        console.error("ERROR UPDATE:", err);
        res.status(500).json({ message: err.message });
    }
});

   // Activar / Desactivar usuario
app.put('/api/usuarios/:id/toggle', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect();

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Usuario
                SET activo = CASE 
                                WHEN activo = 1 THEN 0
                                ELSE 1
                             END
                WHERE id_usuario = @id
            `);

        res.json({ message: "Estado del usuario actualizado" });

    } catch (err) {
        console.error("ERROR TOGGLE:", err);
        res.status(500).json({ message: err.message });
    }
});
// ========================================
// REPORTE DE VENTAS DEL DÍA (ADMIN)
// ========================================
// 📊 Reporte de ventas del día
app.get('/api/reporte-ventas', async (req, res) => {
    try {
        const pool = await sql.connect();

        // Total generado hoy
        const totalResult = await pool.request().query(`
            SELECT 
                ISNULL(SUM(total),0) AS total_hoy,
                COUNT(*) AS pedidos_hoy
            FROM Pedido
            WHERE CAST(fecha AS DATE) = CAST(GETDATE() AS DATE)
              AND estado = 'entregado'
        `);

        // Lista de pedidos del día
        const pedidosResult = await pool.request().query(`
            SELECT 
                p.id_pedido,
                u.nombre AS cliente,
                p.total,
                p.estado,
                p.fecha
            FROM Pedido p
            INNER JOIN Usuario u ON p.id_usuario = u.id_usuario
            WHERE CAST(p.fecha AS DATE) = CAST(GETDATE() AS DATE)
            ORDER BY p.fecha DESC
        `);

        res.json({
            resumen: totalResult.recordset[0],
            pedidos: pedidosResult.recordset
        });

    } catch (err) {
        console.error("ERROR REPORTE:", err);
        res.status(500).json({ message: err.message });
    }
});

// 📩 Ver todas las consultas
app.get('/api/consultas', async (req, res) => {
    try {
        const pool = await sql.connect();

        const result = await pool.request().query(`
            SELECT 
                c.id_consulta,
                u.nombre,
                u.email,
                c.descripcion,
                c.fecha
            FROM Consulta c
            INNER JOIN Usuario u 
                ON c.id_usuario = u.id_usuario
            ORDER BY c.fecha DESC
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("ERROR CONSULTAS:", err);
        res.status(500).json({ message: err.message });
    }
});
// 👤 Crear usuario (admin)
app.post('/api/usuarios', async (req, res) => {
    const { nombre, email, password, tipo } = req.body;

    try {
        const pool = await sql.connect();

        // Verificar si ya existe
        const existe = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`SELECT * FROM Usuario WHERE email = @email`);

        if (existe.recordset.length > 0) {
            return res.status(400).json({
                message: "El usuario ya existe"
            });
        }

        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('tipo', sql.VarChar, tipo)
            .query(`
                INSERT INTO Usuario (nombre, email, password, tipo)
                VALUES (@nombre, @email, @password, @tipo)
            `);

        res.json({ message: "Usuario creado correctamente" });

    } catch (err) {
        console.error("ERROR CREAR USUARIO:", err);
        res.status(500).json({ message: err.message });
    }
});
// 📦 Obtener pedidos con usuario
app.get('/api/pedidos', async (req, res) => {
    try {
        const pool = await sql.connect();

        const result = await pool.request().query(`
            SELECT 
                P.id_pedido,
                P.fecha,
                P.total,
                P.estado,
                U.nombre AS cliente
            FROM Pedido P
            JOIN Usuario U ON P.id_usuario = U.id_usuario
            ORDER BY P.fecha DESC
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("ERROR PEDIDOS:", err);
        res.status(500).json({ message: err.message });
    }
});
// 🛍 Obtener productos activos
app.get('/api/productos', async (req, res) => {
    try {
        const pool = await sql.connect();

        const result = await pool.request().query(`
            SELECT * FROM Producto
            WHERE activo = 1 AND stock > 0
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("ERROR PRODUCTOS:", err);
        res.status(500).json({ message: err.message });
    }
});
//Crear pedidos
app.post('/api/pedidos', async (req, res) => {
    const { id_usuario, productos } = req.body;

    let transaction;

    try {
        const pool = await sql.connect();
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        // 1️⃣ Insertar Pedido
        const pedidoResult = await new sql.Request(transaction)
            .input('id_usuario', sql.Int, id_usuario)
            .query(`
                INSERT INTO Pedido (id_usuario, fecha, total, estado)
                OUTPUT INSERTED.id_pedido
                VALUES (@id_usuario, GETDATE(), 0, 'pendiente')
            `);

        const id_pedido = pedidoResult.recordset[0].id_pedido;
        let total = 0;

        // 2️⃣ Insertar Detalle de Pedido
        for (let i = 0; i < productos.length; i++) {
            const item = productos[i];

            // Crear request NUEVA para cada query
            const reqProducto = new sql.Request(transaction);
            reqProducto.input('id_producto', sql.Int, item.id_producto);

            const productoResult = await reqProducto.query(`
                SELECT precio FROM Producto WHERE id_producto = @id_producto
            `);

            const precio = productoResult.recordset[0].precio;
            const subtotal = precio * item.cantidad;
            total += subtotal;

            // Insertar detalle
            const reqDetalle = new sql.Request(transaction);
            reqDetalle.input('id_pedido', sql.Int, id_pedido)
                      .input('id_producto', sql.Int, item.id_producto)
                      .input('cantidad', sql.Int, item.cantidad)
                      .input('precio_unitario', sql.Decimal(10,2), precio);

            await reqDetalle.query(`
                INSERT INTO DetallePedido (id_pedido, id_producto, cantidad, precio_unitario)
                VALUES (@id_pedido, @id_producto, @cantidad, @precio_unitario)
            `);
        }

        // 3️⃣ Actualizar total
        const reqTotal = new sql.Request(transaction);
        reqTotal.input('id_pedido', sql.Int, id_pedido)
                .input('total', sql.Decimal(10,2), total);

        await reqTotal.query(`
            UPDATE Pedido SET total = @total WHERE id_pedido = @id_pedido
        `);

        await transaction.commit();
        res.json({ message: "Pedido creado correctamente" });

    } catch (err) {
        if (transaction) {
            try { await transaction.rollback(); } catch(e) { console.error("Rollback fallido:", e); }
        }
        console.error("ERROR CREAR PEDIDO:", err);
        res.status(500).json({ message: err.message });
    }
});
// Cambiar estado de un pedido
app.put('/api/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('estado', sql.VarChar, estado)
      .query(`
        UPDATE Pedido
        SET estado = @estado
        WHERE id_pedido = @id
      `);

    res.json({ message: "Estado del pedido actualizado" });
  } catch (err) {
    console.error("ERROR ACTUALIZAR PEDIDO:", err);
    res.status(500).json({ message: err.message });
  }
});


app.listen(4000, () => {
    console.log("Servidor backend corriendo en puerto 4000 🚀");
});
