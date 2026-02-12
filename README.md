# 🗡️ La Leyenda de Jhulian

> *Una historia de amor y superación*

Un Action RPG 2D Top-Down creado con **Phaser 3** como regalo de aniversario. 💜

## 🎮 Historia

**Dani**, nuestra heroína pelirroja, debe atravesar tres misiones llenas de desafíos para llegar al **Jardín de la Paz**, donde la espera su amor, **Jhulian**. Cada misión es una metáfora de superación personal.

### Misiones

1. 🌲 **El Bosque de la Incertidumbre** — Enfrenta a las Sombras de Duda y vence al Guardián del Miedo.
2. 🕳️ **La Cueva del Aislamiento** — Atraviesa la oscuridad, derrota a los Ecos del Silencio y destruye al Golem de la Tristeza.
3. 🌸 **El Camino al Reencuentro** — Un sendero lleno de flores que conduce al reencuentro con Jhulian.

## 🕹️ Controles

| Tecla | Acción |
|-------|--------|
| ⬆ ⬇ ⬅ ➡ | Mover a Dani |
| `Espacio` | Atacar (espada) |
| `E` | Hablar con NPCs |
| `Enter` | Navegar menús / Continuar diálogos |

## 🚀 Cómo Jugar

### Opción 1: Abrir directamente
Simplemente abre `index.html` en tu navegador (Chrome/Firefox/Edge recomendado).

> ⚠️ Algunos navegadores bloquean scripts locales. Si no funciona, usa la Opción 2.

### Opción 2: Servidor local
```bash
# Con Node.js
npx serve .

# O con Python
python3 -m http.server 8000
```
Luego abre `http://localhost:3000` (o `:8000`).

## 📦 Publicar en GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. ¡Tu juego estará disponible en `https://tu-usuario.github.io/TheLegendOfJhulian/`!

## 🏗️ Estructura del Proyecto

```
TheLegendOfJhulian/
├── index.html              ← Punto de entrada
├── css/style.css           ← Estilos UI
├── js/
│   ├── main.js             ← Config de Phaser
│   ├── GraphicsFactory.js  ← Gráficos placeholder
│   ├── Player.js           ← Dani (movimiento, ataque, vida)
│   ├── Enemy.js            ← Enemigos con IA
│   ├── Boss.js             ← Jefes con patrones de ataque
│   ├── NPC.js              ← NPCs interactivos
│   ├── DialogueManager.js  ← Sistema de diálogos
│   ├── HUD.js              ← Corazones y título
│   ├── BootScene.js        ← Carga inicial
│   ├── TitleScene.js       ← Pantalla de título
│   ├── Level1Scene.js      ← Bosque de la Incertidumbre
│   ├── Level2Scene.js      ← Cueva del Aislamiento
│   ├── Level3Scene.js      ← Camino al Reencuentro
│   ├── BossScene.js        ← Arena de jefe (reutilizable)
│   ├── VictoryScene.js     ← Pantalla final
│   └── GameOverScene.js    ← Game Over
└── README.md
```

## 💜 Hecho con amor
