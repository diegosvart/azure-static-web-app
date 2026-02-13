---
name: next-static-azure-deploy
description: Guía el flujo de validación, build, export y deploy de Next.js estático a Azure Static Web Apps. Usar cuando se pida ejecutar el plan de despliegue estático, configurar CI/CD para Azure, o seguir el planner de Next.js estático.
---

# Next.js estático → Azure Static Web Apps

Sigue el flujo definido en [planner.md](../../planner.md) para publicar la app Next.js como sitio 100% estático en Azure Static Web Apps (plan Free) con GitHub Actions.

## Flujo en 7 fases

1. **Validación del proyecto**: Detectar incompatibilidades (getServerSideProps, middleware.ts, /pages/api, Edge runtime). Validar scripts en package.json (`build`, `export`). Si hay bloqueos → reportar y detener.
2. **Build local**: Ejecutar `npm ci`, `npm run build`, `npm run export`. Verificar que exista carpeta `out` e `index.html`.
3. **Recurso Azure**: Crear o confirmar recurso Azure Static Web App (Free, GitHub, branch main, app location `/`, output location `out`, API vacío).
4. **CI/CD**: Crear o actualizar `.github/workflows/azure-static-web-app.yml` con checkout, setup-node 18, npm ci/build/export, y `Azure/static-web-apps-deploy@v1` (token desde secret).
5. **Secret**: Confirmar que existe `AZURE_STATIC_WEB_APPS_API_TOKEN` en el repo; si no → solicitar creación.
6. **Deploy**: Push a main; monitorear GitHub Actions hasta SUCCESS; verificar que la URL responde HTTP 200.
7. **Validación post-deploy**: Comprobar que la página carga, assets JS/CSS, sin 404, HTTPS y certificado válido.

## Referencia detallada

- Precondiciones, límites del plan Free y formato del reporte final (JSON éxito/error): ver [reference.md](reference.md).
- Especificación completa de fases, workflow y manejo de errores: [planner.md](../../planner.md).

## Reporte final

Emitir JSON estructurado (éxito o fallo) según planner.md sección 12. No duplicar workflows ni secrets; ejecución idempotente.
