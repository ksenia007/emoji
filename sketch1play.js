// Encoding: UTF-8


//Variables that we are going to use
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

////////////////////////////////////// Preload section

// load two image arrays we will use
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

////////////////////////////////////// Action section

function setup(){ 
    createCanvas(windowWidth,windowHeight);
    notStarted=true;
}

function getRandomSpeed(){
    return random(.5,3);
}

// initializes variables that control which search was used
function pOne(){
    if (notStarted){
        notStarted=false;
        pickOne=true;
        imageArray=imageArrayOne;
    }
}

function pTwo(){
    if (notStarted){
        notStarted=false;
        pickTwo=true;
        imageArray=imageArrayTwo;
    }
}

// select the search line that will be showed
function mouseClicked(){
    if (notStarted){
        if (mouseX<floor(width/2)){
            pOne();
        }
        else{
            pTwo();
        }
    }
    else{
        notStarted=true;
        pickOne=false;
        pickTwo=false;
    }
}

function draw(){

    print('hello');
    ////////////////////////// Waiting for user input
 
    if (notStarted){
        background(255);

        //add a note about using the emoji one library
        fill(63, 87, 101);
        textFont(fontQ);
        textAlign(CENTER, CENTER);
        textSize(10);
        text("Thanks to EmojiOne for providing free emoji icons", floor(width/2), floor(.9*height))

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
        ////////////////////////// Selected the topic
        background(255);
        //add a note about using the emoji one library
        fill(63, 87, 101);
        textFont(fontQ);
        textAlign(CENTER, CENTER);
        textSize(10);
        text("Thanks to EmojiOne for providing free emoji icons", floor(width/2), floor(.9*height))

        //define borders for the flowing emojis
        var rangeXlower=0.1*width;
        var rangeXupper=0.9*width;
        var titleTexts=0.1*height;

        //get the new emoji, make a sprite out of it. 
        //remove the image from the array
        if (imageArray.length>0 && frameCount%10==0){ 
            imageSprite = createSprite(floor(random(rangeXlower, rangeXupper)),height);
            imageSprite.addImage(imageArray[imageArray.length-1]);
            imageArray.pop();
            imageSprite.setSpeed(getRandomSpeed(),-90);
            spriteArray.push(imageSprite);
        }
        
        //check the position of the sprites every 10 frames
        // remove the ones that are at the very top
        if(frameCount%10==0){
            for (var d=0; d<spriteArray.length; d++){
                //spriteArray[d].velocity.x+=.1
                spriteArray[d].velocity.y-=.1
                if (spriteArray[d].position.y<titleTexts+50){
                    spriteArray[d].remove();
                }
            }
        }

        //if we are out of images - restart
        if (imageArray.length<1){
            if (pickOne){
                imageArray=imageArrayOne;
            }
            if (pickTwo){
                imageArray=imageArrayTwo;
            }
        }
        //draw all the emojis
        drawSprites();

        //add title - search line depending on the one picked
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
