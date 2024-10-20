import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Initialize Firebase Admin SDK
const serviceAccount = await readFile(new URL('./note-app-a0808-firebase-adminsdk-35brb-72574ffa33.json', import.meta.url)); // Adjust path to your service account key

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to send push notifications
app.post('/send-notification', (req, res) => {
    const { token, title, body } = req.body;

    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: token,
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Notification sent successfully:', response);
            res.status(200).send('Notification sent successfully');
        })
        .catch((error) => {
            console.error('Error sending notification:', error);
            res.status(500).send('Error sending notification');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
