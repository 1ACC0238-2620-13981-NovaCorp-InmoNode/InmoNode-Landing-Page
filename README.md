# InmoNode Landing Page

Landing page de **InmoNode**, la plataforma de NovaCorp para vender lotes en campo sin conexión, validar vouchers con OCR y dar transparencia a los compradores. Corresponde a la historia de usuario **US-P01** (Landing Page informativa).

## Contenido de la página

1. Encabezado con navegación y acceso a la demo.
2. Propuesta de valor.
3. Problema del sector.
4. Solución: modo offline, OCR, sincronización y repositorio digital.
5. Cómo funciona, en tres pasos.
6. Segmentos: agentes comerciales y compradores.
7. Proyectos destacados (datos de demostración).
8. Comparativa con un CRM tradicional.
9. Hallazgos de las entrevistas.
10. Planes.
11. Equipo.
12. Preguntas frecuentes.
13. Formulario para solicitar una demo.

## Tecnologías

HTML5, CSS3 y JavaScript, sin dependencias ni proceso de compilación.

## Estructura

```
.
├── index.html            Página principal
├── privacy.html          Política de privacidad
└── assets
    ├── css
    │   ├── tokens.css    Colores, tipografía y espaciado
    │   ├── base.css      Estilos base y componentes compartidos
    │   └── sections.css  Estilos de cada sección
    ├── img               Logotipo, favicon, imagen para redes y fotos del equipo
    └── js
        └── main.js       Menú móvil, pasos, validación del formulario
```

## Guía de estilo

Los estilos reproducen el mock-up de la Landing Page del informe del proyecto (sección 3.1.3.2). Todos los valores están en `assets/css/tokens.css`:

| Elemento | Valor |
| :--- | :--- |
| Color primario | `#1E9743` |
| Color de acento | `#35C966` |
| Texto y fondos oscuros | `#0B141D` |
| Superficie | `#F6F8F7` |
| Advertencia | `#F2B943` |
| Error u ocupado | `#C74A38` |
| Tipografía | Manrope (título principal 60 px, títulos de sección 46 px, cuerpo 16 px) |
| Espaciado | Base de 8 px |

## Uso local

Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático:

```bash
npx serve .
```

## Configuración

| Qué | Dónde | Detalle |
| :--- | :--- | :--- |
| URL de la aplicación web | Atributo `data-app-url` de `<body>` en `index.html` | Mientras esté vacío, los enlaces a proyectos y registro llevan al formulario de demo. |
| Envío del formulario | Atributo `action` de `.demo-form` en `index.html` | Mientras esté vacío, el formulario valida los datos pero no los envía. |
| Imagen para redes | Meta `og:image` en `index.html` | Debe cambiarse a la URL absoluta del sitio publicado. |

## Despliegue

El sitio se publica en Vercel:

1. Importar este repositorio desde el panel de Vercel.
2. Elegir el preset **Other**, sin comando de compilación y con el directorio raíz como salida.
3. Publicar la rama `main`.

## Convenciones

- Ramas según Gitflow: `main`, `develop`, `feature/<story-id>-<short-description>`, `release/<version>`.
- Mensajes de commit según Conventional Commits.
- Nombres de archivos, clases y funciones en inglés; textos de interfaz en español.

## Equipo

NovaCorp, Ingeniería de Software, Universidad Peruana de Ciencias Aplicadas.

| Código | Integrante |
| :--- | :--- |
| U202419462 | Caisahuana Osores, Becker Junior |
| U20241C101 | Capillo Lema, Mía Valentina |
| U20231E795 | Nuñez Soto, Andy Arturo |
| U202418577 | Perez Encarnacion, Breithner Rodolfo |
| U20231E515 | Rocca Mariaca, Angel Mathias |
