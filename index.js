var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bheam, bheam_collide, bheam_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var ratsGroup, rat;
var ladooImg, ladoo;

var score;

var gameOver, restart;


function preload() {
    bheam_running = loadAnimation("bhe.png");
    bheam_collide = loadAnimation("bheam.png");
    groundImage = loadImage("brick.jpeg");


    cloudImage = loadImage("cloud.png");
    rat = loadImage("1.png");
    ladooImg = loadImage("lad.png");

    gameOverImg = loadImage("ove.png");
    restartImg = loadImage("restart.png");

    jumpSound = loadSound("jump.wav");
    dieSound = loadSound("die.wav");
    pointSound = loadSound("1-up.wav");
}

function setup() {
    createCanvas(600, 400);

    bheam = createSprite(50, 30);
    bheam.addAnimation("running", bheam_running);
    bheam.addAnimation("collided", bheam_collide);

    ladoo = createSprite(200, 200);
    ladoo.addImage("coin", ladooImg);
    ladoo.scale = 0.15;
    ladoo.velocityX = -5;

    ground = createSprite(250, 485, 400, 20);
    ground.addImage("ground", groundImage);
    ground.x = ground.width / 2;
    ground.velocityX = -5;

    gameOver = createSprite(300, 130);
    gameOver.addImage(gameOverImg);

    restart = createSprite(300, 240);
    restart.addImage(restartImg);

    gameOver.scale = 0.4;
    restart.scale = 0.2;

    gameOver.visible = false;
    restart.visible = false;

    invisibleGround = createSprite(200, 330, 400, 10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    ratsGroup = new Group();


    score = 0;
}

function draw() {
    background("#00e6e6");

    fill("black");
    textSize(20);
    text("Score: " + score, 450, 50);

    if (gameState === PLAY) {
        bheam.scale = 0.25;


        if (ratsGroup.isTouching(bheam)) {
            dieSound.play();
            gameState = END;
        }

        if (World.frameCount % 90 === 0) {
            ladoo = createSprite(400, 50, 40, 10);

            ladoo.y = Math.round(random(150, 200));
            ladoo.addImage(ladooImg);
            ladoo.scale = 0.3;
            ladoo.velocityX = -5;
            ladoo.lifetime = 134;
        }

        if (keyDown("space") && bheam.y >= 100) {
            jumpSound.play();
            bheam.velocityY = -14;
        }
        bheam.velocityY = bheam.velocityY + 0.8;

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        bheam.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if (ladoo.isTouching(bheam)) {
            ladoo.destroy();
            score = score + 2;
        }


        if (score > 0 && score % 100 === 0) {
            pointSound.play();
        }

    } else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        bheam.velocityY = 0;
        ratsGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        ladoo.velocityX = 0;


        bheam.changeAnimation("collided", bheam_collide);
        bheam.scale = 0.3;

        ratsGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(1);

        if (mousePressedOver(restart)) {
            reset();
        }
    }
    drawSprites();
}

function spawnClouds() {
    if (frameCount % 60 === 0) {
        var cloud = createSprite(600, 320, 40, 10);
        cloud.y = 100;
        cloud.addImage(cloudImage);
        cloud.scale = 0.1;
        cloud.velocityX = -3;
        cloud.lifetime = 200;

        cloud.depth = bheam.depth;
        bheam.depth = bheam.depth + 1;

        cloudsGroup.add(cloud);
    }

}

function spawnObstacles() {
    if (frameCount % 60 === 0) {
        var obstacle = createSprite(600, 290, 10, 40);
        obstacle.velocityX = -(6 + 3 * score / 100);
        obstacle.addImage(rat);

        obstacle.scale = 0.2;
        obstacle.lifetime = 300;

        ratsGroup.add(obstacle);
    }
}


function reset() {
    gameState = PLAY;
    ground.velocityX = -(6 + 3 * score / 100);
    gameOver.visible = false;
    restart.visible = false;

    ratsGroup.destroyEach();
    cloudsGroup.destroyEach();

    bheam.changeAnimation("running", bheam_running);

    score = 0;
}