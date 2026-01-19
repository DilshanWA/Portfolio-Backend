var admin = require("firebase-admin");
var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://personalportfolio-11643-default-rtdb.firebaseio.com"
});
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};