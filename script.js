import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const text = document.getElementById('input-text');
const inputImg = document.getElementById('input-img');
const img = document.getElementById('img-input');
const uploadBtn = document.getElementById('upload-btn');
const postsContainer = document.getElementById('post-container');

const firebaseConfig = {
    apiKey: "AIzaSyBCnqrnvnJLaKu-5OLII4sXRgxaVbpWmuc",
    authDomain: "oldgram-dd94a.firebaseapp.com",
    databaseURL: "https://oldgram-dd94a-default-rtdb.firebaseio.com",
    projectId: "oldgram-dd94a",
    storageBucket: "oldgram-dd94a.appspot.com",
    messagingSenderId: "388076421720",
    appId: "1:388076421720:web:e535cb0192adbc55c9c02d"
}

const appSettings = {
    databaseURL: "https://oldgram-dd94a-default-rtdb.firebaseio.com/"
}

const app = firebase.initializeApp(firebaseConfig)
const app2 = initializeApp(appSettings)

const storage = firebase.storage()

const database = getDatabase(app2)

const oldgramInDb = ref(database, "oldgram-post")

let file, fileName, uploadedFileName

const getImageData = (e) => {
    file = e.target.files[0]
    fileName = Math.round(Math.random() * 1000) + file.name
}

inputImg.addEventListener('change', getImageData)

const uploadDB = () => {
    const storageRef = storage.ref().child("myimages")
    const folderRef = storageRef.child(fileName)
    const uploadtask = folderRef.put(file)
    
    let myObj = {
        id: fileName,
        text: text.value
    }

    push(oldgramInDb, myObj)

    uploadtask.on("state_changed", (snapshot) => {
        uploadedFileName = snapshot.ref.name
      }, (error) => {
        console.log(error)
      }, () => {
        storage
            .ref("myimages")
            .child(uploadedFileName)
            .getDownloadURL()
            .then((url) => {
                if (!url){
                    img.style.display = "none"
                } else {
                    img.style.display = "block"
                }
                img.setAttribute("src", url)
            })
      })
}

uploadBtn.addEventListener("click", uploadDB)


function listAllImages(){

    const storageRef = storage.ref().child("myimages")
    storageRef.listAll().then((result) => {
        result.items.forEach((imageRef) => {
            if (myArr.includes(imageRef.name))
                displayImage(imageRef)
                displayText(myArr.indexOf(imageRef.name))
        })
    }).catch((error) => {
        console.log(error)
    })
}

const displayImage = (imageRef) => {
    // console.log(imageRef.name)
    imageRef.getDownloadURL().then((url) => {
        const imgElement = document.createElement("img")
        imgElement.src = url
        imgElement.style.width = "100px"
        document.body.appendChild(imgElement)
    })
}


window.onload = () =>{
    setTimeout(listAllImages, 1000)
    myArr = []
    textoArr = []
}

let myArr = []
let textoArr = []

onValue(oldgramInDb, function(snapshot){
    if (snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
        for (let items of itemsArray){
            myArr.push(items[1].id)
            textoArr.push(items[1].text)
        }
    }
    console.log(myArr)
})

const displayText = (position) => {
    const newEl = document.createElement('p')
    newEl.textContent = textoArr[position]
    document.body.appendChild(newEl)
}