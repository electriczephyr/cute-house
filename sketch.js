// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
Simple Image Classification Drag and Drop
=== */

/* 
  Adapted from this example https://github.com/ml5js/ml5-homepage-demo
*/

const image = document.getElementById('image'); // The image we want to classify
const dropContainer = document.getElementById('container');
const warning = document.getElementById('warning');
const fileInput = document.getElementById('fileUploader');
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/VfEFZL95v/model.json';

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};

function windowResized() {
  let windowW = window.innerWidth;
  if (windowW < 480 && windowW >= 200) {
    image.style.maxWidth = windowW - 80;
    dropContainer.style.display = 'block';
  } else if (windowW < 200) {
    dropContainer.style.display = 'none';
  } else {
    image.style.maxWidth = '90%';
    dropContainer.style.display = 'block';
  }
}

['dragenter', 'dragover'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => dropContainer.classList.add('highlight'), false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => dropContainer.classList.remove('highlight'), false)
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, preventDefaults, false)
});

dropContainer.addEventListener('drop', gotImage, false)

function gotImage(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 1) {
    console.error('upload only one file');
  }
  const file = files[0];
  const imageType = /image.*/;
  if (file.type.match(imageType)) {
    warning.innerHTML = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      image.src = reader.result;
      setTimeout(classifyImage, 100);
    }
  } else {
    image.src = './images/bird.jpg';
    setTimeout(classifyImage, 100);
    warning.innerHTML = 'Please drop an image file.'
  }
}

function handleFiles() {
  const curFiles = fileInput.files;
  if (curFiles.length === 0) {
    image.src = './images/bird.jpg';
    setTimeout(classifyImage, 100);
    warning.innerHTML = 'No image selected for upload';
  } else {
    image.src = window.URL.createObjectURL(curFiles[0]);
    warning.innerHTML = '';
    setTimeout(classifyImage, 100);
  }
}

function clickUploader() {
  fileInput.click();
}

const result = document.getElementById('result'); // The result tag in the HTML

// const barCute = document.querySelector(`[data-ml5-label="Cute"]`);
// const barNotCute = document.querySelector(`[data-ml5-label="Not Cute"]`);
// const barNotNHouse = document.querySelector(`[data-ml5-label="Not a house"]`);

const probability = document.getElementById('probability'); // The probability tag in the HTML

// Initialize the Image Classifier method
const classifier = ml5.imageClassifier(imageModelURL, () => {});

// Make a prediction with the selected image
// This will return an array with a default of 10 options with their probabilities
classifyImage();

function classifyImage() {
  classifier.predict(image, (err, results) => {
    let resultTxt = results[0].label;
    result.innerText = resultTxt;
    let prob = 100 * results[0].confidence;
    probability.innerText = Number.parseFloat(prob).toFixed(1) + '%';

    if(results.length > 0) {
      results.forEach(res => {
        const { label, confidence } = res;
        const prob = Number.parseFloat(100 * confidence).toFixed(2) + '%';
        const bar = document.querySelector(`[data-ml5-label="${label}"]`);
        bar.style.width = prob;
      });
    }
  });
}
