# Code Editor Sandbox

Este proyecto es un entorno de pruebas (`sandbox`) diseñado para ejecutar rápidamente scripts en diferentes lenguajes de programación. Utiliza **Docker** para proporcionar un ambiente consistente y aislado.

---

## Cómo empezar

Para poner en marcha este proyecto, solo necesitas tener **Docker** instalado.

1.  **Obtener las imágenes de los lenguajes:**
    Primero, descarga las imágenes de Docker necesarias para cada lenguaje. Esto asegura que tengas los entornos listos para usar:

    ```bash
    docker pull python:3.12-slim-bookworm
    docker pull node:lts-alpine
    docker pull ruby:3.2-alpine
    docker pull php:8.2-cli-alpine
    docker pull perl:slim
    ```

2.  **Iniciar el proyecto:**
    Una vez que tengas las imágenes, inicia el proyecto con Docker Compose:

    ```bash
    docker compose up
    ```

    El servidor backend estará disponible en `http://localhost:3000` y la interfaz del cliente en `http://localhost:5173`.

---

## Scripts de ejemplo

Aquí tienes algunos ejemplos de cómo puedes probar cada lenguaje dentro del `sandbox`:

---

### Python

```python
print("Hello from Python!")
```

---

### JavaScript

```javascript
console.log("Hello from JavaScript!");
```

---

### PHP

```php
<?php
echo "Hello World from PHP!";
?>
```

---

### Ruby

```ruby
puts "Hello from Ruby!"
```

---

### Perl

```perl
print "Hello from Perl!\n";
```

---