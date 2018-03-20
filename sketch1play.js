// Encoding: UTF-8

var table;
var tableOne;
var tableTwo;

var pickTwo=false;
var pickOne=false;

var spriteArray=[];
var imageArrayOne=[];
var imageArrayTwo=[];
var imageArray=[];

var imageSprite;
var eplosionAnimationSprite;
var eplosionAnimation;
var p;

var notStarted;

function imageArrayGetOne(){
    for (var r=1; r<tableOne.length;r++){
        //table 
        fileName='assets/emojiLibrary/'+tableOne[r]+'.png'
        img=loadImage(fileName)
        imageArrayOne.push(img)
    }
}

function imageArrayGetTwo(){
    for (var r=1; r<tableTwo.length;r++){
        //table 
        fileName='assets/emojiLibrary/'+tableTwo[r]+'.png'
        img=loadImage(fileName)
        imageArrayTwo.push(img)
    }
}

function preload(){
    fontQ=loadFont('assets/Verdana.ttf')
    tableOne = loadStrings('emojiYoga.txt', imageArrayGetOne);
    tableTwo = loadStrings('emojiMarchMadness.txt', imageArrayGetTwo);
}

function setup(){ 
    createCanvas(windowWidth,windowHeight);
    notStarted=true;
}

function getRandomSpeed(){
    return random(.5,3);
}

function pOne(){
    if (notStarted){
        notStarted=false;
        pickOne=true;
        imageArray=imageArrayOne;
        imageArrayTwo=[];
    }
}

function pTwo(){
    if (notStarted){
        notStarted=false;
        pickTwo=true;
        imageArray=imageArrayTwo;
        imageArrayOne=[];
    }
}

function mouseClicked(){
    if (notStarted){
        if (mouseX<floor(width/2)){
            pOne();
        }
        else{
            pTwo();
        }
    }
}



function draw(){

    if (notStarted){
        background(255);

        //create buttons
        rectMode(CENTER);
        noStroke();
        fill(color(239,239,239));
        rect(floor(.25*width), floor(height/2), floor(width/7), 55, 10);
        rect(floor(.75*width), floor(height/2), floor(width/7), 55, 10);

        // add text on the buttons
        fill(63, 87, 101);
        textFont(fontQ);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Yoga", floor(.25*width), floor(height/2))
        text("March Madness", floor(.75*width), floor(height/2))

        //add title
        text("Select the topic you want to explore", floor(width/2), floor(height/7));


    }

    else{

    background(255);

    var rangeXlower=0.1*width;
    var rangeXupper=0.9*width;
    var titleTexts=0.1*height;

    
    if (imageArray.length>0 && frameCount%10==0){ 
        imageSprite = createSprite(floor(random(rangeXlower, rangeXupper)),height);
        imageSprite.addImage(imageArray[imageArray.length-1]);
        imageArray.pop();
        imageSprite.setSpeed(getRandomSpeed(),-90);
        spriteArray.push(imageSprite);
    }

    if(frameCount%10==0){
        for (var d=0; d<spriteArray.length; d++){
            //spriteArray[d].velocity.x+=.1
            spriteArray[d].velocity.y-=.1
            if (spriteArray[d].position.y<titleTexts+50){
                spriteArray[d].remove();
            }
        }
    }
    if (imageArray.length<1){
        if (pickOne){
            imageArrayGetOne();
        }
        if (pickTwo){
            imageArrayGetTwo();
        }
    }
    drawSprites();

    //title
    textFont(fontQ);
    fill(26, 42, 110, 180);
    textAlign(CENTER, CENTER);
    textSize(62);

    if (pickTwo){
        text("March Madness", floor(width/2),floor(titleTexts));
    }

    if (pickOne){
        text("Yoga", floor(width/2),floor(titleTexts));
    }

}

}
