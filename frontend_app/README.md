# React + Vite Frontend app

This application communicate with the backend application on the following URL: `http://localhost:8000` and allow edit and adding tasks to the list

For running this frontend application you need to have installed Node.js (v.22+), npm and vite.
Run backend application. Then run the following commands:

```bash
npm install  # << Install dependencies
npm run dev  # << Run the application
```

To run from the Docker container you can use the following commands (from the frontend_app directory):

```bash
docker build -t frontend-app .
docker run -p 5173:5173 --rm frontend-app
```


How to use confirmation dialog in your component: 

```
    // use hook in your component (hook is a function that starts from 'use' word)
    const {openConfirmation, closeConfirmation} = useConfirmationDialog();
    ...
    //execute openConfirmation function, f.ex like this: 
    openConfirmation({
        title:'Delete Task',
        confirmLabel:'Delete',
        text:`Are you sure you want to delete ${delTitle} task?`,  
        onConfirm: () => handleDeleteTask(taskId),
        onCancel: closeConfirmation,     
    });
```

