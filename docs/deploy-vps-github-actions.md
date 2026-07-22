# Deploy NaHerbs Len VPS Bang GitHub Actions

Tai lieu nay mo ta dung luong deploy hien tai cua du an:

1. Push code len nhanh `main`
2. GitHub Actions build Docker images
3. GitHub Actions push images len Docker Hub
4. GitHub Actions SSH vao VPS va chay `docker compose pull && docker compose up -d`

## 1. Dieu kien can co

- Da co tai khoan GitHub
- Da co tai khoan Docker Hub
- Da co VPS cai san Docker va Docker Compose plugin
- Domain:
  - `naherb.com.vn`
  - `api.naherb.com.vn`

## 2. Workflow hien tai

Workflow nam o [`.github/workflows/deploy.yml`](/home/duy/develop/NaHerbs/.github/workflows/deploy.yml:1).

Compose deploy nam o [`docker-compose.yml`](/home/duy/develop/NaHerbs/docker-compose.yml:1).

File env mau nam o [`.env.example`](/home/duy/develop/NaHerbs/.env.example:1).

## 3. Tao Docker Hub repositories

Can co 2 repository tren Docker Hub:

- `your-dockerhub-username/naherb-api`
- `your-dockerhub-username/naherb-web`

Cach tao:

1. Dang nhap `https://hub.docker.com/`
2. Bam `Create Repository`
3. Tao repo `naherb-api`
4. Tao repo `naherb-web`

## 4. Tao Docker Hub access token

Khong nen dung password Docker Hub trong GitHub Actions.

Cach tao token:

1. Dang nhap Docker Hub
2. Vao `Account Settings`
3. Vao `Personal access tokens`
4. Bam `Generate new token`
5. Dat ten, vi du `naherb-github-actions`
6. Copy token vua tao

Gia tri can dung:

- `DOCKERHUB_USERNAME`: username Docker Hub
- `DOCKERHUB_TOKEN`: token vua tao

## 5. Tao SSH key cho deploy

Neu may local da co `~/.ssh/id_ed25519`, hay tao mot key rieng cho deploy:

```bash
ssh-keygen -t ed25519 -C "naherb-github-actions-deploy" -f ~/.ssh/naherb_github_actions
```

Sau lenh nay se co:

- private key: `~/.ssh/naherb_github_actions`
- public key: `~/.ssh/naherb_github_actions.pub`

Xem public key:

```bash
cat ~/.ssh/naherb_github_actions.pub
```

## 6. Them public key vao VPS

Dang nhap VPS bang password:

```bash
ssh your_user@your_vps_ip
```

Tren VPS:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

Dan noi dung cua `naherb_github_actions.pub` vao file `authorized_keys`, luu lai, sau do chay:

```bash
chmod 600 ~/.ssh/authorized_keys
```

Test lai tu may local:

```bash
ssh -i ~/.ssh/naherb_github_actions your_user@your_vps_ip
```

Neu dang nhap duoc ma khong can password la OK.

## 7. Tao GitHub Secrets

Vao repo tren GitHub:

1. `Settings`
2. `Secrets and variables`
3. `Actions`
4. `New repository secret`

### 7.1. Secrets cho Docker Hub

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### 7.2. Secrets cho frontend build

- `NEXT_PUBLIC_API_BASE_URL`
  - `https://api.naherb.com.vn/api`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  - Google OAuth client id cua frontend
- `NEXT_PUBLIC_TINYMCE_API_KEY`
  - TinyMCE API key
- `NEXT_PUBLIC_SITE_URL`
  - `https://naherb.com.vn`

### 7.3. Secrets cho deploy VPS

- `VPS_HOST`
  - IP hoac domain cua VPS
- `VPS_USER`
  - user SSH, vi du `root` hoac `ubuntu`
- `VPS_PORT`
  - thuong la `22`
- `VPS_DEPLOY_PATH`
  - vi du `/opt/naherb`
- `VPS_SSH_KEY`
  - noi dung private key:

```bash
cat ~/.ssh/naherb_github_actions
```

Copy toan bo noi dung private key va dan vao secret `VPS_SSH_KEY`.

## 8. Chuan bi VPS

Dang nhap VPS va tao thu muc deploy:

```bash
mkdir -p /opt/naherb
```

Trong tai lieu nay, minh gia su dung:

```text
VPS_DEPLOY_PATH=/opt/naherb
```

### 8.1. Cai Docker neu VPS chua co

Kiem tra:

```bash
docker --version
docker compose version
```

Neu chua co, cai Docker va Docker Compose plugin truoc khi deploy.

### 8.2. Tao file `.env` tren VPS

Tren VPS, vao thu muc deploy:

```bash
cd /opt/naherb
nano .env
```

Lay noi dung tu file [`.env`](/home/duy/develop/NaHerbs/.env:1) hoac [`.env.example`](/home/duy/develop/NaHerbs/.env.example:1) roi dien gia tri that.

Bat buoc sua cac bien sau:

- `DOCKER_USERNAME`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `REDIS_PASSWORD`
- `JWT_SECRET`
- `MAIL_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `AI_API_KEY`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_TINYMCE_API_KEY`

Gia tri domain production:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.naherb.com.vn/api
NEXT_PUBLIC_SITE_URL=https://naherb.com.vn
UPLOAD_PUBLIC_BASE_URL=https://api.naherb.com.vn/api
CORS_ALLOWED_ORIGINS=https://naherb.com.vn,https://www.naherb.com.vn,https://api.naherb.com.vn
COOKIE_SECURE=true
```

## 9. Chuan bi Nginx Proxy Manager

Can tao 2 Proxy Host:

### Web

- Domain: `naherb.com.vn`
- Forward Hostname / IP: `naherb_web`
- Forward Port: `3000`

Neu dung them `www.naherb.com.vn`, tao them domain do trong cung Proxy Host.

### API

- Domain: `api.naherb.com.vn`
- Forward Hostname / IP: `naherb_api`
- Forward Port: `8080`

Bat SSL cho ca hai domain.

## 10. Lan deploy dau tien

Sau khi da:

- tao Docker Hub repos
- tao GitHub Secrets
- cai SSH key
- tao file `.env` tren VPS
- cai Docker tren VPS

thi chi can push code len `main`.

Workflow se tu dong:

1. Build image backend
2. Build image frontend
3. Push ca 2 image len Docker Hub
4. SSH vao VPS
5. Copy `docker-compose.yml`
6. Chay `docker compose pull`
7. Chay `docker compose up -d`

## 11. Kiem tra sau deploy

Dang nhap VPS:

```bash
cd /opt/naherb
docker compose ps
docker compose logs -f naherb_api
docker compose logs -f naherb_web
```

Kiem tra nhanh:

- `https://naherb.com.vn`
- `https://api.naherb.com.vn/api/health/live` (liveness — Docker healthcheck)
- `https://api.naherb.com.vn/api/health` (readiness — DB/Redis)

Neu `api/health/live` OK ma `api/health` 503: container van healthy, nhung Redis/DB dang loi.
Neu FE khong len sau deploy: thuong do API unhealthy + `depends_on` (da sua: FE chi can API started).

Tren VPS:

```bash
docker compose ps
docker inspect -f '{{.State.Health.Status}}' naherb_api naherb_web
docker exec naherb_api wget -qO- http://127.0.0.1:8080/api/health/live
docker exec naherb_api wget -qO- http://127.0.0.1:8080/api/health
docker logs --tail 100 naherb_api
docker logs --tail 100 naherb_web
```

## 12. Khi can deploy lai

Moi lan can deploy:

1. Commit code
2. Push len `main`
3. GitHub Actions se tu build va deploy lai

Khong can SSH vao VPS de keo source code.

## 13. Luu y quan trong

- VPS khong can source code cua du an
- VPS chi can:
  - `docker-compose.yml`
  - file `.env`
  - Docker / Docker Compose
- Frontend image duoc build tren GitHub Actions, nen cac bien `NEXT_PUBLIC_*` phai ton tai trong GitHub Secrets
- Backend runtime doc bien tu file `.env` tren VPS
- Khong commit file `.env` that len git
- Neu trong repo da lo secret that, nen rotate lai secret do

## 14. Danh sach secret tong hop

### Tren GitHub

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_TINYMCE_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `VPS_HOST`
- `VPS_USER`
- `VPS_PORT`
- `VPS_DEPLOY_PATH`
- `VPS_SSH_KEY`

### Tren VPS `.env`

- `DOCKER_USERNAME`
- `SERVER_PORT`
- `DB_PORT`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JPA_DDL_AUTO`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_TIMEOUT`
- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_ACCESS_EXPIRATION`
- `REFRESH_TOKEN_EXPIRATION`
- `ACCESS_COOKIE_NAME`
- `REFRESH_COOKIE_NAME`
- `COOKIE_SECURE`
- `COOKIE_SAME_SITE`
- `CORS_ALLOWED_ORIGINS`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_SMTP_AUTH`
- `MAIL_SMTP_STARTTLS_ENABLE`
- `OTP_MAIL_FROM`
- `GOOGLE_CLIENT_ID`
- `AI_PROVIDER`
- `AI_API_KEY`
- `AI_MODEL`
- `AI_EMBEDDING_MODEL`
- `CHATBOT_KNOWLEDGE_PATH`
- `CHATBOT_INGEST_ON_STARTUP`
- `RAG_TOP_K`
- `RAG_PER_DOCUMENT_TOP_K`
- `UPLOAD_BASE_PATH`
- `UPLOAD_PUBLIC_BASE_URL`
- `UPLOAD_MAX_AVATAR_BYTES`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_TINYMCE_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
