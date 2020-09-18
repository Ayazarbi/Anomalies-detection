var image=document.getElementById("img");
var canvas=document.getElementById("canvass");
var context=canvas.getContext('2d');
let model
var nousercount=0;
var speech
var recognition
var log=document.getElementById("log");
var nousertime=0;
var multipleusertime=0;
var mobiledetectcount=0;
var speechdetecttime=0;



// Load the model.
(async()=>{


    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
    try {
        var recognition = new webkitSpeechRecognition();
      } catch (e) {
        var recognition = Object;
      }
      ++speechdetecttime

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = function (event) {
      
        speechdetecttime++
       // createelement("Voice detected You just spoke something")
         
      }
      
    
    model= await cocoSsd.load();
    
    navigator.getUserMedia(
        {   audio:true,
            video: {} },
        stream =>video.srcObject = stream,

        
        err => console.error(err)
      )

    recognition.start();
    
    predict()
    async function predict(){
    context.drawImage(video,0,0,200,150)
    model.detect(canvas).then(predictions=>{
     
           if(predictions.length>0){
            var count=0;
            for (const key in predictions) {
                 if(predictions[key].class=="cell phone"||predictions[key].class=="laptop" ||predictions[key].class=="tv"||predictions[key].class=="book"){

                  ++mobiledetectcount  
                  createelement("Device detected please put your "+(predictions[key].class+" back"))
                }
               
               
                    
                
            }
           
    //         if(nousercount>20){
    //             console.log("Usernotfoundinside")
    //             nousercount=0;
    //         }
    //    }

    //    else{
    //        nousercount++
    //        if(nousercount>20){
    //            console.log("UsernotFound")
    //            nousercount=0;
    //        }
       }
        requestAnimationFrame(predict)
    
    })
}
})();


video.addEventListener('play',()=>{

    let canvas = faceapi.createCanvasFromMedia(video)
    canvas.style.marginLeft="200px"
    canvas.style.marginTop="25px"
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    nousercount=0;
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    if(detections.length>1){
        ++multipleusertime
        createelement("Multiple People Detected")
    }
    if(detections.length>1){
        nousercount++
    }
    if(detections.length<1){
      ++nousertime  
      nousercount++
    }
    
    if(nousercount==10){
        createelement("Warning:Unale to detect User please sit properly and make sure your face is not covered ")
        nousercount++

    }
    
    if(nousercount>20){
      
       createelement("User not found")
        nousercount=0
    }
    
    
    
  }, 200)

  

})

function createelement(msg){
     var li=document.createElement('li');
     li.textContent=msg
    log.appendChild(li)
}


async function showdata(){

  video.removeAttribute('src');
  video.pause()
  let menu = document.getElementById('log');
  while (menu.firstChild) {
    menu.removeChild(menu.firstChild);
}
  createelement("Annomaly 1:Multiple users where present for"+(multipleusertime*200)/1000+" seconds through out the session")
  createelement("Annomaly 2:User Was not Present for"+(nousertime*200/1000)+" seconds through out the session")
  createelement("Annomaly 6:User Accesed Mobile for"+(+mobiledetectcount*60/1000)+" seconds throughout the session")
  createelement("Annomaly 7:User was on call for"+speechdetecttime/3+"seconds time through out the session")
}