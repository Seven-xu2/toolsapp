# API 摘要

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `GET /api/v1/users/me/stats`
- `GET /api/v1/tools`
- `GET /api/v1/tools/favorites`
- `GET /api/v1/favorites`
- `POST /api/v1/favorites`
- `DELETE /api/v1/favorites/{toolCode}`
- `GET /api/v1/histories`
- `POST /api/v1/histories`
- `DELETE /api/v1/histories/{id}`
- `DELETE /api/v1/histories`
- `GET /api/v1/health`

统一返回：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

Swagger 页面：`http://127.0.0.1:8080/swagger-ui.html`
