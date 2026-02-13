# Guía de uso — Herramientas Cursor instaladas

Esta guía describe cómo usar las reglas, el skill y los subagentes configurados en el proyecto para trabajar con Next.js estático y el despliegue en Azure Static Web Apps.

---

## 1. Reglas de Cursor (Rules)

Las reglas se aplican automáticamente cuando abres archivos que coinciden con su patrón. No hace falta invocarlas manualmente.

### 1.1 Next.js estático (`next-static-export`)

- **Archivos afectados:** `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`
- **Qué hace:** Orienta al asistente para mantener el proyecto 100% estático:
  - No usar `getServerSideProps`, rutas `/pages/api`, `middleware.ts` que dependan de servidor ni Edge runtime.
  - Mantener en `package.json` los scripts `"build": "next build"` y `"export": "next export -o out"`.
- **Cuándo notarás la regla:** Al editar componentes o páginas en TypeScript/JavaScript, el asistente tendrá en cuenta estas restricciones al sugerir o generar código.

### 1.2 Workflows de GitHub (`github-workflows`)

- **Archivos afectados:** `.github/workflows/**/*.yml`
- **Qué hace:** Guía la creación o edición del workflow de deploy:
  - Pasos: checkout, setup-node 18, `npm ci` / `npm run build` / `npm run export`, y acción `Azure/static-web-apps-deploy@v1`.
  - Uso del secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.
- **Cuándo notarás la regla:** Al crear o modificar el workflow en `.github/workflows/azure-static-web-app.yml`.

---

## 2. Skill de proyecto (next-static-azure-deploy)

El skill guía al agente en todo el flujo de validación, build, export y deploy.

### Cómo usarlo

- **En el chat:** Pide explícitamente ejecutar el plan de despliegue estático, por ejemplo:
  - *"Ejecuta el plan de despliegue estático"*
  - *"Configura el CI/CD para Azure Static Web Apps según el planner"*
  - *"Sigue el planner de Next.js estático"*
- El agente usará el skill y seguirá las 7 fases definidas en `planner.md` (validación → build local → recurso Azure → CI/CD → secret → deploy → validación post-deploy).

### Dónde está

- Skill: `.cursor/skills/next-static-azure-deploy/SKILL.md`
- Referencia (precondiciones, límites Free, formato del reporte): `.cursor/skills/next-static-azure-deploy/reference.md`

---

## 3. Subagentes (Agents)

Los subagentes son asistentes especializados que se invocan por nombre. Úsalos para validar o revisar sin mezclar con el contexto principal.

### 3.1 Validador estático (`next-static-validator`)

- **Nombre a usar al invocar:** `next-static-validator`
- **Para qué sirve:** Comprobar que el proyecto sea 100% estático y que build/export funcionen.
- **Cuándo usarlo:**
  - Antes de hacer deploy.
  - Cuando quieras comprobar compatibilidad con Azure Static Web Apps.
  - Si dudas si hay código que rompe el export estático.
- **Qué hace al invocarlo:**
  1. Busca incompatibilidades: `getServerSideProps`, `middleware.ts`, `/pages/api`, Edge runtime.
  2. Revisa que en `package.json` existan los scripts `build` y `export`.
  3. Comprueba (si ya hiciste build) que exista la carpeta `out` y `out/index.html`.
- **Ejemplo de petición:** *"Invoca al validador estático"* o *"Valida que este proyecto sea estático"*.

### 3.2 Revisor de deploy Azure (`azure-static-deploy-reviewer`)

- **Nombre a usar al invocar:** `azure-static-deploy-reviewer`
- **Para qué sirve:** Revisar la configuración del workflow de GitHub Actions y del recurso Azure (secrets, `output_location`, pasos del workflow).
- **Cuándo usarlo:**
  - Al configurar o modificar el CI/CD.
  - Cuando el deploy falle y quieras revisar workflow y secrets.
  - Para comprobar que `app_location` y `output_location` sean correctos.
- **Qué hace al invocarlo:**
  1. Revisa el workflow (checkout, setup-node 18, npm ci/build/export, acción Azure con token y `output_location: "out"`).
  2. Comprueba que exista el secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.
  3. Verifica coherencia entre workflow y recurso Azure.
- **Ejemplo de petición:** *"Revisa la configuración de Azure y del workflow"* o *"Invoca al revisor de deploy de Azure"*.

---

## 4. Configuración del editor (Cursor)

Se ha añadido en tu configuración de Cursor (usuario):

- **`editor.formatOnSave`: true** — El código se formatea al guardar el archivo.

**Ubicación (Windows):** `%APPDATA%\Cursor\User\settings.json`

No hace falta hacer nada más; la opción ya está aplicada. Si quieres cambiar el formateador por defecto (por ejemplo a Prettier), configúralo en ese mismo `settings.json` o en `.vscode/settings.json` del proyecto.

---

## 5. MCP (Model Context Protocol)

MCP permite conectar Cursor con herramientas externas (bases de datos, APIs, navegador, etc.). La configuración del proyecto ya está preparada en `.cursor/mcp.json`.

### Cómo instalar servidores MCP

1. **Desde Cursor (recomendado):**  
   **Cursor → Settings → MCP** → explora servidores disponibles y pulsa **"Add to Cursor"** para instalarlos con un clic.

2. **Manual (proyecto):** Edita `.cursor/mcp.json` y **añade** entradas en `mcpServers` **sin borrar las que ya tengas**. Para servidores STDIO (locales) incluye `"type": "stdio"`. Ejemplo de una entrada nueva:
   ```json
   "nombre-servidor": {
     "type": "stdio",
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-nombre"],
     "env": { "API_KEY": "${env:API_KEY}" }
   }
   ```
   Para servidores remotos (HTTP/SSE) usa `"url": "https://..."` en lugar de `command`/`args`.

3. **Global (tu usuario):** Crea o edita `~/.cursor/mcp.json` (en Windows: `%USERPROFILE%\.cursor\mcp.json`) para tener las mismas herramientas en todos los proyectos.

### Uso

- Los tools MCP aparecen en el chat como **Available Tools**; el agente los usará cuando sean relevantes.
- Por defecto Cursor pide confirmación antes de ejecutar un tool; puedes activar **Auto-run** en ajustes si quieres que se ejecuten sin preguntar.

Documentación oficial: [Cursor → Context → MCP](https://cursor.com/docs/context/mcp). Directorio de servidores: [Cursor MCP Directory](https://cursor.com/docs/context/mcp/directory).

### Si MCP no se activa (errores)

- **`type` en STDIO:** En servidores locales (command/args) incluye `"type": "stdio"` en cada entrada.
- **No sobrescribir:** Al editar `mcp.json`, añade o modifica solo la entrada que toque; no reemplaces todo el archivo para no perder herramientas ya instaladas (por Cursor o manualmente).
- **Windows:** Si la configuración de proyecto no funciona, prueba la **configuración global**: `%USERPROFILE%\.cursor\mcp.json`.
- **Reiniciar Cursor:** Tras cambiar `mcp.json`, cierra Cursor por completo (Alt+F4) y ábrelo de nuevo.
- **Node.js:** Los servidores que usan `npx` requieren Node.js 20 o superior en el PATH.

---

## 6. Resumen rápido

| Herramienta | Tipo | Cómo usarla |
|-------------|------|-------------|
| Next.js estático | Regla | Se aplica al editar `.ts` / `.tsx` / `.js` / `.jsx`. |
| GitHub workflows | Regla | Se aplica al editar `.github/workflows/*.yml`. |
| no-overwrite-config | Regla | Siempre activa; evita sobrescribir `.cursor/`, `mcp.json`, `settings.json` completos. |
| next-static-azure-deploy | Skill | Pedir en el chat: "Ejecuta el plan de despliegue estático" (o similar). |
| next-static-validator | Subagente | Invocar por nombre para validar estático y build/export. |
| azure-static-deploy-reviewer | Subagente | Invocar por nombre para revisar workflow y secrets. |
| Formato al guardar | Configuración | Ya activo en Cursor; formatea al guardar. |
| MCP | Configuración | `.cursor/mcp.json`; añadir servidores desde Settings → MCP o editando el JSON. |

Para el flujo completo de despliegue y criterios de éxito, consulta la raíz del proyecto: [planner.md](../../planner.md).

---

## 7. Restauración de la configuración

Si la configuración de Cursor (reglas, agents, skills, MCP o editor) se pierde por una actualización o un comando destructivo, sigue estos pasos.

### 7.1 Configuración del proyecto (fuente de verdad: el repositorio)

La configuración del **proyecto** vive en el repo. Al clonar o restaurar el repositorio se recuperan:

| Elemento | Ubicación en el repo |
|----------|----------------------|
| Reglas | `.cursor/rules/` (p. ej. `next-static-export.mdc`, `github-workflows.mdc`, `no-overwrite-config.mdc`) |
| Agents | `.cursor/agents/` (`next-static-validator.md`, `azure-static-deploy-reviewer.md`) |
| Skills | `.cursor/skills/next-static-azure-deploy/` (`SKILL.md`, `reference.md`) |
| MCP (proyecto) | `.cursor/mcp.json` |

**Pasos:**

1. Confirmar que `.cursor/rules/`, `.cursor/agents/`, `.cursor/skills/next-static-azure-deploy/` existen y contienen los archivos listados en esta guía (secciones 1–2 y 3).
2. Si falta algún archivo, recuperarlo desde Git o recrearlo según la documentación.
3. **No añadir `.cursor/` a `.gitignore`** para que esta configuración quede versionada y se restaure al clonar.

### 7.2 Configuración de usuario (Cursor)

Si se perdió la configuración **de usuario** (editor o MCP global):

1. **Editor (formato al guardar):**  
   Abre `%APPDATA%\Cursor\User\settings.json` (Windows) y añade o restaura, **sin borrar el resto** del JSON:
   ```json
   "editor.formatOnSave": true
   ```
2. **MCP global:**  
   Si usabas servidores en `%USERPROFILE%\.cursor\mcp.json`, restáuralos desde una copia de seguridad o vuelve a añadirlos desde **Cursor → Settings → MCP** (añadir entradas sin sobrescribir las que ya existan).

### 7.3 Regla de protección

El proyecto incluye la regla **no-overwrite-config** (`.cursor/rules/no-overwrite-config.mdc`), que indica al agente no sobrescribir archivos de configuración completos y solo hacer ediciones incrementales. Mantenerla activa ayuda a evitar pérdidas futuras.

### 7.4 Backup de la configuración de usuario (recomendado)

Para no volver a perder la configuración de tu entorno en nuevos proyectos o en otra máquina:

- Haz **copia periódica** de:
  - `%APPDATA%\Cursor\User\settings.json`
  - `%USERPROFILE%\.cursor\mcp.json` (si existe)
  - Cualquier otra carpeta bajo `%USERPROFILE%\.cursor\` que uses (reglas/agents/skills globales).
- Guarda esas copias en un repo privado, OneDrive o carpeta versionada para poder restaurar tras un borrado accidental o al cambiar de equipo.
