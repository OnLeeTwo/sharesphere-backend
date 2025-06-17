# 📘 ShareSphere API Documentation

Base URL:
<https://sharesphere-backend-o4zw.onrender.com/api>
Notes: API is in demo mode, you need to cold start the API before using it

## 🔐 Authentication

### Register

**POST** `/auth/register`

**Body:**

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### Login

**POST** `/auth/login`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### OAuth Login (Google/Facebook)

**POST** `/auth/oauth`

**Body:**

```json
{
  "provider": "google" | "facebook",
  "token": "your_oauth_access_token"
}
```

### Get Profile

**GET** `/auth/profile`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

---

## 📄 Articles

### Get All Articles

**GET** `/articles`

**Query Params:**

- `page`: number (default: 1)
- `per_page`: number (default: 10)
- `search`: string (optional)
- `sort_by`: `created_at`, `created_at_asc`, `views`, `title`, `title_desc`
- `access_tier`: `free` | `basic` | `premium`
- `category`: string (optional)

**Example:**

```json
/articles?page=1&per_page=10&search=react&sort_by=views
```

### Get Single Article

**GET** `/articles/:id`

### Create Article

**POST** `/articles`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**

```json
{
  "title": "My Article",
  "content": "Full content here",
  "access_tier": "free",
  "category": "Programming"
}
```

### Update Article

**PUT** `/articles/:id`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "access_tier": "basic",
  "category": "DevOps"
}
```

### Delete Article

**DELETE** `/articles/:id`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

---

## 🎥 Videos

### Get All Videos

**GET** `/videos`

**Query Params:** same as articles

**Example:**

```json
/videos?page=1&per_page=8&sort_by=created_at
```

### Get Single Video

**GET** `/videos/:id`

### Create Video

**POST** `/videos`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**

```json
{
  "title": "My Video",
  "description": "This is a video description",
  "url": "https://example.com/video.mp4",
  "thumbnail": "https://example.com/thumb.jpg",
  "access_tier": "premium"
}
```

### Update Video

**PUT** `/videos/:id`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

### Delete Video

**DELETE** `/videos/:id`

**Headers:**

```json
Authorization: Bearer <JWT_TOKEN>
```

---

## 🛑 404 Handling

Any non-existent route will return:

```json
{
  "message": "Not Found"
}
```
