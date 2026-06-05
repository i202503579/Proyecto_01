-- ==========================================================
-- PROYECTO: Sistema de Gestión - Cafetería
-- Autor: Rolando Liendo
-- Curso: Desarrollo de Entornos Web
-- Descripción:
-- Este script crea las tablas necesarias para gestionar:
-- usuarios, productos, pedidos y detalles de pedidos.
-- ==========================================================

CREATE DATABASE ProyectoEXP2
GO

USE ProyectoEXP2;
GO

-- ==========================================================
-- TABLA: Usuario
-- Objetivo: Almacenar usuarios del sistema
-- (cliente, empleado o administrador)
-- ==========================================================
CREATE TABLE Usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'cliente'
        CHECK (tipo IN ('cliente','empleado','admin'))
);

INSERT INTO Usuario (nombre, email, password, tipo)
VALUES ('Admin', 'admin@cafe.com', '123', 'admin');

ALTER TABLE Usuario
ADD activo BIT NOT NULL DEFAULT 1;


select * from Usuario
GO

-- ============================================
-- Tabla: Consulta
-- Objetivo: Almacenar los mensajes enviados
-- por los clientes a la cafetería.
-- ============================================

CREATE TABLE Consulta (
    id_consulta INT IDENTITY(1,1) PRIMARY KEY,
    descripcion VARCHAR(500) NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),
    id_usuario INT NOT NULL,
    CONSTRAINT FK_Consulta_Usuario
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


select * from Consulta
GO


-- ==========================================================
-- TABLA: Producto
-- Objetivo: Almacenar productos que vende la cafetería
-- ==========================================================

CREATE TABLE Producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    categoria VARCHAR (100) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    activo BIT DEFAULT 1
);
GO

INSERT INTO producto (nombre, precio, categoria,stock, activo) VALUES
-- CAFÉS
('Café Americano', 8.00, 'Cafés',20, 1),
('Capuccino', 11.00, 'Cafés',20,1),
('Café irlandes', 16.00, 'Cafés',20,1),
('Café bombon', 13.00, 'Cafés',20,1),
('Chocolate caliente', 8.00, 'Cafés',20,1),
('Café doppio', 7.00, 'Cafés',20,1),
('Latte', 11.00, 'Cafés',20,1),
('Mocaccino', 12.00, 'Cafés',20,1),

-- POSTRES
('Cheescake de pistachos', 13.00, 'Postres',30,1),
('Empanada de carne y pollo', 7.00, 'Postres',30, 1),
('Keke de zanahoria con pecanas', 8.00, 'Postres',30, 1),

-- REFRESCOS
('Jugo de temporada', 10.00, 'Refrescos',15, 1),

-- ALITAS
('Alitas crispy', 20.00, 'Alitas',25, 1),
('Alitas bbq', 20.00, 'Alitas',25, 1),
('Alitas buffalo', 20.00, 'Alitas',25, 1),

-- CAFÉ HELADO
('Ice latte', 9.00, 'Café helado',22, 1),

-- TOSTADAS
('Tostadas francesas', 14.00, 'Tostadas',20, 1),

-- FRAPES
('Frappe blueberry banana', 12.00, 'Frapes',18, 1),
('Frappe frutos rojos', 12.00, 'Frapes',25, 1),

-- SANDWICHES
('Martillo dulce', 14.00, 'Sandwiches',35, 1),
('Sandguche pollero', 12.00, 'Sandwiches',20, 1);

SELECT * FROM producto WHERE activo = 1;

-- ==========================================================
-- TABLA: Pedido
-- Objetivo: Registrar pedidos realizados por usuarios
-- ==========================================================

CREATE TABLE Pedido (
    id_pedido INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME DEFAULT GETDATE(),
    total DECIMAL(10,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente','entregado','cancelado')),
    id_usuario INT NOT NULL,
    CONSTRAINT FK_Pedido_Usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);
GO

SELECT * FROM Pedido

-- ==========================================================
-- TABLA: DetallePedido
-- Objetivo: Registrar productos dentro de un pedido
-- ==========================================================

CREATE TABLE DetallePedido (
    id_detalle INT IDENTITY(1,1) PRIMARY KEY,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    CONSTRAINT FK_Detalle_Pedido FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    CONSTRAINT FK_Detalle_Producto FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);
GO

