var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//Przyciski nagrywania
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    console.log("recordButton clicked");



    var constraints = {
        audio: true,
        video: false
    }

    /*
    	Wyłączenie nagrywania
	*/

    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false



    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
        	nagrwanie dźwięku
        */
        audioContext = new AudioContext();
        document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        rec = new Recorder(input, {
            numChannels: 1
        })
        rec.record()

        console.log("Recording started");

    }).catch(function (err) {
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true
    });
}

function pauseRecording() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pauza
        rec.stop();
        pauseButton.innerHTML = "Resume";
    } else {
        //wznownienie
        rec.record()
        pauseButton.innerHTML = "Pause";

    }
}
//pszycisk zatrzymania
function stopRecording() {
    console.log("stopButton clicked");
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    //przycisk resetowanie w trybie pauzy
    pauseButton.innerHTML = "Pause";

    //zatrzymanie nagrwyania
    rec.stop();
    gumStream.getAudioTracks()[0].stop();

    //tworzenie pliku zapisu
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    //nazwa pliku zapisu
    var filename = new Date().toISOString();

    //Dodanie kontrolek do audio
    au.controls = true;
    au.src = url;

    //zapisywanie pliku
    link.href = url;
    link.download = filename + ".wav";
    link.innerHTML = "Save to disk";

    //dodanie nowego zapisu pliku do listy
    li.appendChild(au);
    li.appendChild(document.createTextNode(filename + ".wav "))
    li.appendChild(link);
    recordingsList.appendChild(li);
}
//Przyciski keyboarda
function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('playing');
}

function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;
    key.classList.add('playing');
    audio.currentTime = 0;
    audio.play();
}
const keys = Array.from(document.querySelectorAll('.key'));
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playSound);