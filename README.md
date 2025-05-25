# Cómo empezar

Este proyecto requiere **pnpm** y **Docker**.

1.  **Instalar pnpm:**

    ```bash
    npm install -g pnpm
    ```
2. **Instalar imagenes de cada lenguaje:**

    ```bash
        docker pull python:3.12-slim-bookworm
        docker pull node:lts-alpine
        docker pull ruby:3.2-alpine
        docker pull php:8.2-cli-alpine
        docker pull perl:slim
    ```


3.  **Iniciar el proyecto:**

    ```bash
    docker compose up
    ```

4.  **Abrir `index.html`:**

    Simplemente abre el archivo `index.html` en tu navegador web.

---

## Code Editor Sandbox - Test Scripts

---

## Python

```bash
  print("Hello from Python!")
```

---

## JavaScript

```
  console.log("Hello from JavaScript!");
```

---

## PHP

```
  <?php
  echo "Hello World!";
  ?>
```

---

## Ruby

```
  puts "Hello from Ruby!"
```

---

## Perl

```
  print "Hello from Perl!\n";
```