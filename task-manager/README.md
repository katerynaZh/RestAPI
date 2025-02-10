# React + Vite Frontend app

This application communicate with the backend application on the following URL: `http://localhost:8000` and allow edit and adding tasks to the list

For running this frontend application you need to have installed Node.js (v.22+), npm and vite.
Run backend application. Then run the following commands:

```bash
npm install  # << Install dependencies
npm run dev  # << Run the application
```

To run from the Docker container you can use the following commands (from the task-manager directory):

```bash
docker build -t my-react-app .
docker run -p 5173:5173 --rm my-react-app
```
