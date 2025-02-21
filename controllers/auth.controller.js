const { knex } = require('../config/database.js');
const httpstatus = require('../utils/httpstatus.js');
const validator = require('../utils/validator.js');
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken')

//google sign in
const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
});

class authFunction {
    async login(req,res) {
        try{
            // Google Sign-In Endpoint
            const { idToken } = req.body;
        
            // Verify the Google ID Token with Firebase
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email } = decodedToken;
        
            // Generate a JWT for the user
            const token = jwt.sign({ uid, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
        
            res.json({
                message: "User authenticated successfully",
                token,
                user: { uid, email, name, picture },
            });
        } catch(e) {
            console.log('error',e);
            return httpstatus.errorResponse({message:e.message});
        }
    }
}

module.exports = new authFunction();