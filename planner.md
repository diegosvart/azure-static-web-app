AGENT TASK SPECIFICATION
Publicar Next.js como Sitio Estático en Azure (Free Tier)
1. Objetivo del Agente

Configurar y desplegar una aplicación desarrollada en Next.js como sitio 100% estático en Azure Static Web Apps (plan Free), utilizando integración continua mediante GitHub Actions.

El agente debe garantizar:

Exportación estática funcional

Pipeline CI/CD operativo

Despliegue exitoso

SSL habilitado

Dominio opcional configurado

2. Modo de Operación del Agente

El agente debe:

Analizar el repositorio

Validar compatibilidad con exportación estática

Configurar scripts si faltan

Generar o actualizar workflow

Validar generación carpeta out

Confirmar despliegue correcto

Emitir reporte estructurado

3. Precondiciones

El agente debe verificar:

 Existe package.json

 Proyecto es Next.js

 Node >= 18

 Repo conectado a GitHub

 Cuenta Azure disponible

Si alguna condición falla → detener ejecución y reportar error.

4. Fase 1 — Validación del Proyecto
4.1 Detectar incompatibilidades

Buscar en el código:

getServerSideProps

middleware.ts

/pages/api

Uso de Edge runtime

Si existen → marcar como:

BLOCKING_ISSUE: Proyecto no es 100% estático.

4.2 Validar Scripts

Verificar que existan en package.json:

"build": "next build",
"export": "next export -o out"


Si no existen → agregarlos automáticamente.

5. Fase 2 — Build Local Automatizado

El agente debe ejecutar:

npm ci
npm run build
npm run export


Validar:

 Carpeta /out creada

 index.html existe

 No errores en consola

Si falla → detener y reportar log.

6. Fase 3 — Configuración Azure Static Web App
6.1 Crear Recurso (Manual o API)

Configuración requerida:

Plan: Free

Source: GitHub

Branch: main

App location: /

Output location: out

API location: vacío

El agente debe confirmar que:

Se generó URL tipo:

https://<app>.azurestaticapps.net

7. Fase 4 — Configuración CI/CD
7.1 Crear Workflow

Ruta obligatoria:

.github/workflows/azure-static-web-app.yml


Contenido requerido:

name: Deploy Next.js Static to Azure

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build
      - run: npm run export

      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "out"

7.2 Validar Secret

Confirmar existencia de:

AZURE_STATIC_WEB_APPS_API_TOKEN


Si no existe → detener y solicitar creación.

8. Fase 5 — Despliegue Automatizado

Acción:

git add .
git commit -m "Configure Azure Static Web App"
git push origin main


El agente debe:

Monitorear GitHub Actions

Confirmar estado SUCCESS

Confirmar que URL responde HTTP 200

9. Fase 6 — Validación Post-Deploy

Verificar:

 Página principal carga

 Assets JS/CSS cargan

 No errores 404

 HTTPS activo

 Certificado válido

10. Fase 7 — Dominio Personalizado (Opcional)

Si se solicita dominio:

10.1 Agregar dominio en Azure
10.2 Generar instrucciones DNS:

Tipo:

CNAME
www → <app>.azurestaticapps.net


Validar propagación DNS.

Confirmar SSL activo en dominio personalizado.

11. Criterios de Éxito

La ejecución es exitosa si:

Build estático correcto

Pipeline automático operativo

Deploy exitoso

HTTPS activo

Sin errores críticos

12. Reporte Final del Agente

El agente debe emitir salida estructurada:

{
  "status": "SUCCESS",
  "static_build": true,
  "ci_cd_configured": true,
  "deploy_url": "https://app.azurestaticapps.net",
  "https_enabled": true,
  "custom_domain": "optional-domain.com",
  "issues_detected": []
}


Si falla:

{
  "status": "FAILED",
  "stage": "BUILD | CI | DEPLOY",
  "error": "descripcion clara",
  "action_required": "detalle concreto"
}

13. Manejo de Errores
Error	Acción del Agente
getServerSideProps detectado	Detener y reportar
Carpeta out no generada	Revisar build log
Token inválido	Solicitar regeneración
Workflow falla	Reintentar una vez
Error DNS	Esperar propagación
14. Límites del Plan Free

El agente debe advertir si:

Tamaño del sitio supera límites

Se excede ancho de banda

Se requiere entorno staging

En ese caso:

UPGRADE_REQUIRED: Plan Standard recomendado.

15. Modo Idempotente

El agente debe poder ejecutarse múltiples veces sin:

Duplicar workflows

Duplicar secrets

Reconfigurar recursos existentes innecesariamente

16. Resultado Esperado del Sistema

Estado final:

Aplicación desplegada

Integración automática activa

Costo $0 dentro de límites

Entorno reproducible