# GTA V Backend

This backend is first of all not meant to be secure and can be easily abused to modify other user's their handling profiles. Keep this in mind and you'd be best to introduce some kind of password authentication on the endpoint that gives out session tokens.


This backend is used in private on my [GTA V menu](https://github.com/Yimura/YimMenu) to share handling profiles with my friends.

## How to deploy

### 1. Clone the code

```bash
git clone https://github.com/Yimura/GTA5-Backend.git
cd GTA5-Backend
```

### 2. Fill in database details

Open [`data/auth.js`](data/auth.js):
```json
{
    "credentials": {
        "mongodb": {
            "dev": {
                "auth": {
                    "user": "db_user",
                    "password": "password",
                    "host": "example.com",
                    "database": "yimmenu"
                },
                "options": {
                    "useNewUrlParser": true,
                    "useUnifiedTopology": true,
                    "useFindAndModify": false,
                    "useCreateIndex": true
                }
            },
            "prod": {
                "auth": {
                    "user": "db_user",
                    "password": "password",
                    "host": "example.com",
                    "database": "yimmenu"
                },
                "options": {
                    "useNewUrlParser": true,
                    "useUnifiedTopology": true,
                    "useFindAndModify": false,
                    "useCreateIndex": true
                }
            }
        }
    }
}
```

### 3. Starting the backend

#### Docker

```bash
docker-compose up --build
```

#### Without Docker

Have NodeJS (v14+) installed
```bash
npm install
node --experimental-loader=./util/loader.js .
```

## Documentation

None available currently, open an issue if you wish for me to add this.