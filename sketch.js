let video;
let detector;
let detections = [];
let bisleriImage;
let bananaImage;
let orangeImage;
let blankImage;
let addToCartButton;
let cartItems = 0;
let cartImage;

function preload() {
  detector = ml5.objectDetector('cocossd');
  bisleriImage = loadImage('bisleri.png');
  bananaImage = loadImage('banana.png');
  orangeImage = loadImage('orange.png');
  blankImage = loadImage('blank.png');
  cartImage = loadImage('cart.png');
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
}

function setup() {
  const canvas = createCanvas(300, 580);
  canvas.style('border', '2px solid lightblue');

  // Access the back camera using getUserMedia()
  const constraints = {
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  };

  video = createCapture(constraints, function(stream) {
    video.style('transform', 'scaleX(-1)'); // Flip the video horizontally to mirror the view
  });
  video.size(640, 480);
  video.hide();
  detector.detect(video, gotDetections);

  // Create the "Add to Cart" button
  addToCartButton = createButton('Add to Cart');
  addToCartButton.position(45, height - 52);
  addToCartButton.style('background-color', 'white');
  addToCartButton.style('border', '2px solid lightblue');
  addToCartButton.style('width', '80px');
  addToCartButton.style('height', '25px');
  addToCartButton.style('font-size', '12px');
  addToCartButton.style('color', 'lightblue'); // Set the text color to light blue
  addToCartButton.mousePressed(addToCart);
}

function addToCart() {
  // Add your logic here for adding the detected object to the cart
  // For example, you can store the detected object in an array or trigger a function to handle the cart functionality
  cartItems++;
}

function draw() {
  image(video, 0, 0);

  let objectDetected = false; // Flag to check if any object was detected

  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];

    if (object.label !== 'bottle' && object.label !== 'orange' && object.label !== 'banana') {
      continue; // Skip the iteration for labels other than 'bottle', 'orange', or 'banana'
    }

    objectDetected = true; // Set the flag to true as an object was detected

    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y + 90, object.width, object.height + 70);
    noStroke();
    fill(255);
    textSize(18);

    if (object.label === 'bottle') {
      text('bisleri', object.x + 50, object.y + 215);
      image(bisleriImage, -45, 440, bisleriImage.width / 3.4, bisleriImage.height / 3.4);
    } else if (object.label === 'banana') {
      text('banana', object.x + 50, object.y + 215);
      image(bananaImage, -45, 440, bananaImage.width / 3.4, bananaImage.height / 3.4);
    } else if (object.label === 'orange') {
      text('orange', object.x + 50, object.y + 215);
      image(orangeImage, -45, 440, orangeImage.width / 3.4, orangeImage.height / 3.4);
    }
  }

  // Draw the blank image if no object was detected
  if (!objectDetected) {
    image(blankImage, -50, 440, blankImage.width / 3.4, blankImage.height / 3.4);
  }

  // Display the cart image
  image(cartImage, 234, 12, 55, 35); // Adjust the position and size of the cart image as needed

  // Display the number of items in the cart over the cart image
  const cartText = `${cartItems}`;
  const cartTextWidth = textWidth(cartText);
  // Display the cart item text
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(cartText, 265 + (cartTextWidth / 2), 30); // Adjust the position as needed
}
