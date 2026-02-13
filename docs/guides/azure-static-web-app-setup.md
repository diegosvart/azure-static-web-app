# Configuración de Azure Static Web Apps (Fase 3)

Instrucciones para crear el recurso en Azure y configurar el secret en GitHub para el despliegue automático.

## Requisitos

- Cuenta de Azure con permiso para crear recursos.
- Repositorio en GitHub conectado (este repo).

## 1. Crear el recurso Azure Static Web App

1. Entra en [Azure Portal](https://portal.azure.com).
2. Busca **Static Web Apps** y selecciona **Create**.
3. Configura:
   - **Subscription:** tu suscripción.
   - **Resource group:** crea uno nuevo o usa existente (ej. `rg-static-web-app`).
   - **Name:** nombre único para la app (ej. `azure-static-web-app` o `hcempresas-static`).
   - **Plan type:** **Free**.
   - **Deployment details:**
     - **Source:** GitHub.
     - **Sign in with GitHub** y autoriza si hace falta.
     - **Organization:** tu org o usuario.
     - **Repository:** `azure-static-web-app` (o el nombre de este repo).
     - **Branch:** `main`.
   - **Build Details:**
     - **Build Presets:** Custom.
     - **App location:** `/` (raíz del repo).
     - **Output location:** `out`.
     - **API location:** (dejar vacío).

4. **Review + create** y luego **Create**.

## 2. Obtener el token de despliegue

Tras crear el recurso:

1. En el recurso Static Web App, ve a **Overview**.
2. Copia el valor de **Deployment token** (o en **Manage deployment token**).

Este token es el que se usará como secret en GitHub. **No lo compartas ni lo subas al repo.**

## 3. Configurar el secret en GitHub

1. En GitHub, abre este repositorio.
2. **Settings** → **Secrets and variables** → **Actions**.
3. **New repository secret**.
4. **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. **Value:** pega el Deployment token copiado de Azure.
6. **Add secret**.

## 4. Verificar

- La URL del sitio será: `https://<nombre-app>.azurestaticapps.net`
- El primer despliegue se ejecutará cuando el workflow de GitHub Actions se dispare (al hacer push a `main` con el workflow ya configurado en Fase 4).

## Referencia rápida

| Parámetro        | Valor  |
|------------------|--------|
| Plan             | Free   |
| Source           | GitHub |
| Branch           | main   |
| App location     | `/`    |
| Output location  | `out`  |
| API location     | (vacío)|
| Secret en GitHub | `AZURE_STATIC_WEB_APPS_API_TOKEN` |
