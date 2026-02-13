# Referencia — Next.js estático en Azure

## Precondiciones (verificar antes de ejecutar)

- [ ] Existe `package.json`
- [ ] Proyecto es Next.js
- [ ] Node >= 18
- [ ] Repo conectado a GitHub
- [ ] Cuenta Azure disponible

Si alguna falla → detener y reportar error.

## Límites del plan Free (Azure Static Web Apps)

El agente debe advertir si:

- El tamaño del sitio supera los límites
- Se excede el ancho de banda
- Se requiere entorno staging

En ese caso: **UPGRADE_REQUIRED: Plan Standard recomendado.**

## Reporte final — formato JSON

**Éxito:**

```json
{
  "status": "SUCCESS",
  "static_build": true,
  "ci_cd_configured": true,
  "deploy_url": "https://<app>.azurestaticapps.net",
  "https_enabled": true,
  "custom_domain": "optional-domain.com",
  "issues_detected": []
}
```

**Fallo:**

```json
{
  "status": "FAILED",
  "stage": "BUILD | CI | DEPLOY",
  "error": "descripcion clara",
  "action_required": "detalle concreto"
}
```

## Errores frecuentes y acción

| Error | Acción del agente |
|-------|-------------------|
| getServerSideProps detectado | Detener y reportar |
| Carpeta out no generada | Revisar build log |
| Token inválido | Solicitar regeneración |
| Workflow falla | Reintentar una vez |
| Error DNS | Esperar propagación |
