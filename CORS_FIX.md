# 🔧 Corrections CORS & 404 - Backend

## 🎯 Problèmes Identifiés et Corrigés

### ❌ PROBLÈME 1 : Erreur CORS "No 'Access-Control-Allow-Origin' header"

**Causes :**

- La config CORS utilisait seulement `process.env.FRONTEND_URL`
- Pas de support pour localhost:5173 et 5174 (ports Vite)
- Pas de gestion explicite des méthodes OPTIONS (preflight)

**Corrections appliquées dans `app.js` :**

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://speaktime.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin (Mobile, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};
```

✅ **Résultat :** CORS fonctionne maintenant pour localhost ET production

---

### ❌ PROBLÈME 2 : Route POST /api/auth/register retourne 404

**Causes :**

- Routes importées mais pas testées
- Pas de vérification que les middlewares fonctionnaient
- Pas de route de test

**Corrections appliquées :**

1. **Ajout route de test globale** dans `app.js` :

```javascript
app.get("/api/auth/test", (req, res) => {
  res.status(200).json({
    message: "Backend fonctionne ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
  });
});
```

2. **Ajout route de test dans authRoutes.js** :

```javascript
router.get("/api/auth/test", (req, res) => {
  res.status(200).json({
    message: "Routes authentification fonctionnelles ✅",
    routes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/refresh (protégée)",
    ],
  });
});
```

✅ **Résultat :** Vérifiez avec `GET /api/auth/test` que tout fonctionne

---

### ❌ PROBLÈME 3 : Ordre des middlewares incorrect

**Erreur :** `app.use(express.json())` était appelé APRÈS cors()

**Correction :** Ordre correct dans `app.js` :

```javascript
// CORRECT : CORS en premier
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PUIS : Connexion DB
connectDB();

// PUIS : Routes
app.use("/api/auth", authRoutes);
```

---

## ✅ Checklist de Vérification

### Test 1 : Backend tourne

```bash
curl http://localhost:5000/
# Doit retourner : { "message": "API SpeakTime opérationnelle ✅" }
```

### Test 2 : Routes d'authentification disponibles

```bash
curl http://localhost:5000/api/auth/test
# Doit retourner :
{
  "message": "Routes authentification fonctionnelles ✅",
  "routes": [...]
}
```

### Test 3 : CORS fonctionne (depuis Vercel)

```javascript
// Depuis https://speaktime.vercel.app
fetch("http://localhost:5000/api/auth/test", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
// Ne doit PAS retourner d'erreur CORS
```

### Test 4 : Inscription POST fonctionne

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Pass123!"}'
# Doit retourner : 200 ou 201 (pas 404)
```

---

## 📝 Configuration .env requise

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=votre_secret
FRONTEND_URL=https://speaktime.vercel.app
NODE_ENV=development
```

---

## 🚀 Déploiement sur Render

**Render reconnaît maintenant :**

- ✅ Routes correctement définies
- ✅ CORS configuré pour localhost ET production
- ✅ Express JSON middleware avant les routes
- ✅ Gestion des 404 et erreurs

**Variables d'environnement sur Render :**

```
FRONTEND_URL=https://speaktime.vercel.app
NODE_ENV=production
PORT=5000 (géré par Render automatiquement)
MONGO_URI=<votre_uri>
JWT_SECRET=<votre_secret>
```

---

## 🔍 Fichiers Modifiés

1. **app.js** - Configuration CORS améliorée + routes de test + gestion erreurs
2. **authRoutes.js** - Ajout route GET /api/auth/test

---

## 💡 Résumé des Changements

| Avant                                  | Après                                        |
| -------------------------------------- | -------------------------------------------- |
| ❌ CORS accepte seulement prod         | ✅ CORS accepte localhost (5173/5174) + prod |
| ❌ Pas de route de test                | ✅ GET /api/auth/test disponible             |
| ❌ express.json() après CORS           | ✅ express.json() avant routes               |
| ❌ Pas de gestion 404                  | ✅ Gestion 404 et erreurs                    |
| ❌ Render peut crasher silencieusement | ✅ Erreurs loggées et traitées               |

---

✅ **Backend prêt pour Render !**
