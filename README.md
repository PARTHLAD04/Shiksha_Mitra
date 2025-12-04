# Shiksha Mitra

Shiksha Mitra is a web application built with Node.js and Express.js. It uses MongoDB as the database and Mongoose as the ODM. The application provides a set of API endpoints for managing educational resources.

## File Structure

```
├── .env
├── .git
├── .gitignore
├── config
│   └── db.js
├── middleware
│   └── auth.js
├── models
│   ├── Course.js
│   ├── Review.js
│   └── User.js
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── css
│   ├── img
│   └── js
├── routes
│   ├── courses.js
│   ├── reviews.js
│   └── users.js
├── seeder.js
└── server.js
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

### Installation & Running the project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/shiksha-mitra.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd shiksha-mitra
   ```

3. **Install the dependencies:**

   This will install all the necessary modules listed in `package.json`.
   ```bash
   npm install
   ```

4. **Create a `.env` file:**

   Create a `.env` file in the root directory and add the following environment variables:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

5. **Run the application:**

   ```bash
   npm start
   ```

   The server will start on port 5000.

## Important Modules Installed

- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: A library for hashing passwords.
- **[cors](https://www.npmjs.com/package/cors)**: A middleware for enabling Cross-Origin Resource Sharing.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: A module that loads environment variables from a `.env` file.
- **[express](https://www.npmjs.com/package/express)**: A fast, unopinionated, minimalist web framework for Node.js.
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: An implementation of JSON Web Tokens.
- **[mongoose](https://www.npmjs.com/package/mongoose)**: A MongoDB object modeling tool for Node.js.

## Usage

The application provides a set of API endpoints for managing educational resources. You can use a tool like [Postman](https://www.postman.com/) to test the endpoints.

## API Endpoints

- `GET /api/v1/courses`: Get all courses.
- `GET /api/v1/courses/:id`: Get a single course.
- `POST /api/v1/courses`: Create a new course.
- `PUT /api/v1/courses/:id`: Update a course.
- `DELETE /api/v1/courses/:id`: Delete a course.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
