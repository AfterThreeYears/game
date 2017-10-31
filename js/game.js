var pro = 0;

var bgMusic;
var scoreMusic;
var bombMusic;

var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'game');

var progressFn = function() {
    var style = { 
        font: "50px Arial",
        fill: "#fff", 
        align: "center",
        wordWrap: true,
        wordWrapWidth: 200,
    };
    var loadText = ' 请 耐 心 等 待';
    var textX  = game.world.centerX;
    var textY = game.world.centerY;
    var progressText = game.add.text(textX, textY, `0%${loadText}`, style);
    progressText.inputEnabled = true;
    progressText.input.enableDrag();
    progressText.anchor.setTo(0.5, 0.5);

    var deadLine = false;
    setTimeout(function() {
        deadLine = true;
    }, 0);
    var loadComplete = function() {
        if (deadLine) {
            // game.state.start('created');
        } else {
            setTimeout(loadComplete, 0);
        }
    };

    var loading = function(progress) {
        pro = progressText.text = `${progress}%${loadText}`;
    };

    game.load.onFileComplete.add(loading);
    game.load.onLoadComplete.add(loadComplete);
}

var startGame = function() {
  bgMusic.stop();
  game.state.start('play');
}

var states = {
    preload: function() {
        this.preload = function() {
			game.stage.backgroundColor = '#000';
            game.load.crossOrigin = 'anonymous'; // 设置跨域
            game.load.image('bg', './img/bg.png');
            game.load.image('dude', './img/dude.png');
            game.load.image('green', './img/green1.png');
            game.load.image('red', './img/red1.png');
            game.load.image('yellow', './img/yellow1.png');
            game.load.image('bomb', './img/bomb.png');
            game.load.image('five', './img/five.png');
            game.load.image('three', './img/three.png');
            game.load.image('one', './img/one.png');
            game.load.audio('bgMusic', './audio/bgm.mp3');
            game.load.audio('scoreMusic', './audio/flap.wav');
            game.load.audio('bombMusic', './audio/boom.mp3');
            // 加载一个“老式的”精灵集，注意和atlas的区别，37x45大小，18帧
            game.load.spritesheet('uniqueKey', '/sprites/metalslug_mummy37x45.png', 37, 45, 18);
            game.load.bitmapFont('desyrel', '/fonts/bitmapFonts/desyrel.png', '/fonts/bitmapFonts/desyrel.xml');
            progressFn();
        }
        this.create = function() {
            text = game.add.bitmapText(game.world.centerX, game.world.centerY, 'desyrel', 'Bitmap Fonts!', 64);
            text.setText('Bitmap Fonts!\nx: ' + Math.round(game.input.x) + ' y: ' + Math.round(game.input.y));
            text.anchor.setTo(0.5, 0.5);
        }
    },
    created: function() {
        this.create = function() {
            // 添加背景
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加标题
            var title = game.add.text(game.world.centerX, game.world.centerY * 0.25, '小恐龙接苹果', {
                fontSize: '40px',
                fontWeight: 'blod',
                fill: '#f2bb15',
            });
            title.anchor.setTo(0.5, 0.5);
            // 添加提示
            var remind = game.add.text(game.world.centerX, game.world.centerY * 0.5, '点击任意位置开始', {
                fontSize: '20px',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // 添加主角
            var man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            var manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            // 添加点击事件
            game.input.onTap.add(function() {
                game.state.start('play');
            });
            var sprite = game.add.sprite(300, 200, 'uniqueKey');
            // 添加动画
            sprite.animations.add('walk');
            // 开始动画
            sprite.animations.play('walk', 30, true);
        };
    },
    play: function() {
        var title;
        var man;
        var apples;
        var score = 0;
        this.create = function() {
			      // 添加背景
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加主角
            man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            var manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            game.physics.enable(man); // 加入物理运动
            man.body.allowGravity = false; // 清除重力影响
            // 添加分数
            score = 0;
            title = game.add.text(game.world.centerX, game.world.height * 0.25, score, {
                font: 'bold 40px',
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#000'
            });
            title.anchor.setTo(0.5, 0.5);
            // 播放背景音乐
            bgMusic = game.add.audio('bgMusic');
            bgMusic.loopFull();
            scoreMusic = game.add.audio('scoreMusic');
            bombMusic = game.add.audio('bombMusic');
            // 添加苹果
            apples = game.add.group();
            var appleTypes = ['green', 'red', 'yellow', 'bomb'];
            var appleTime = game.time.create(true);
            appleTime.loop(800, function() {
                var x = Math.random() * game.world.width;
                var y = 0;
                var type = appleTypes[Math.floor(Math.random() * appleTypes.length)];
                // console.log(x, y, type);
                var apple = apples.create(x, y, type);
                // 设置苹果加入物理运动
                game.physics.enable(apple);
                // 设置苹果大小
                var appleImg = game.cache.getImage(type);
                apple.width = game.world.width / 8;
                apple.height = apple.width / appleImg.width * appleImg.height;
                // 掉落物设置和边界接触
                apple.body.collideWorldBounds = true;
                apple.body.onWorldBounds = new Phaser.Signal();
                apple.body.onWorldBounds.add(function(apple, up, down, left, right) {
                    if (down) {
                        apple.destroy();
                        if (apple.key === 'bomb') return;
                        game.state.start('over', true, false, score);
                    }
                });
            });
            appleTime.start();
            // 开启物理引擎
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 800;            
            // 监听滑动事件
            var touching = false;
            var dx;
            game.input.onDown.add(function(pointer) {
                if (Math.abs(pointer.x - man.x) < man.width / 2) {
                    touching = true;
                    dx = man.x - pointer.x;
                }
            });
            game.input.onUp.add(function() {
                touching = false;
            });
            game.input.addMoveCallback(function(pointer, x ,y, isTap) {
                // console.log(x, y);
                if (!isTap && touching) man.x = x + dx;
            });
        }
        this.update = function() {
            // 检测主角和掉落物的碰撞
            game.physics.arcade.overlap(man, apples, pickApple, null, this);
        }
        this.render = function() {
          game.debug.spriteInfo(man, 32, 32); 
          game.debug.spriteBounds(apples);
          game.debug.spriteBounds(man);
          game.debug.spriteBounds(title);
          game.debug.spriteInfo(title, 32, 200);                      
        }
        var pickApple = function(man, apple) {
            // 只要有碰撞那就进行销毁
            apple.destroy();
            var point = 1;
            var img = 'one';
            if (apple.key === 'red') {
                point = 3;
                img = 'three';
            } else if (apple.key === 'yellow') {
                point = 5;
                img = 'five';
            } else if (apple.key === 'bomb') {
                bombMusic.play();
                game.state.start('over', true, false, score);
                return;
            }
            // 播放得分音乐
            scoreMusic.play();
            // 添加得分图片
            var goal = game.add.image(apple.x, apple.y, img);
            var goalImg = game.cache.getImage(img);
            goal.width = apple.width;
            goal.height = goal.width / (goalImg.width / goalImg.height);
            goal.alpha = 0;

            // 添加过渡效果
            var showTween = game.add.tween(goal).to({
                alpha: 1,
                y: goal.y - 20
            }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
            showTween.onComplete.add(function() {
                var hideTween = game.add.tween(goal).to({
                    alpha: 0,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
                hideTween.onComplete.add(function() {
                    goal.kill();
                });
            });
            title.text = +score + point;
            score = title.text;
        }
    },
    over: function() {
        this.init = function() {
            score = arguments[0];
        }
        this.create = function() {
            game.stage.backgroundColor = '#000';
            // 添加文本
            var title = game.add.text(game.world.centerX, game.world.centerY * 0.25, '游戏结束',{
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            var scoreStr = '你的得分是：'+ score +'分';
            var scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            scoreText.anchor.setTo(0.5, 0.5);
            var remind = game.add.text(game.world.centerX, game.world.height * 0.6, '点击任意位置再玩一次', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // 添加点击事件
            game.input.onTap.add(startGame);
        }
    },
    render: function() {
      this.create = () => {
        game.debug.text( "This is debug text", 100, 380 );
      }
    }
};

for (var key in states) {
    if (states.hasOwnProperty(key)) {
        game.state.add(key, states[key], true);
    }
}



// 启动游戏
game.state.start('preload');





