import _Object$keys from 'babel-runtime/core-js/object/keys';

let pro = 0;
const width = window.innerWidth;
const height = window.innerHeight;
let bgMusic;

var game = new Phaser.Game(width, height, Phaser.CANVAS, '#game');

const progressFn = game => {
    let progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
        fontSize: '60px',
        fill: '#fff'
    });
    let deadLine = false;
    setTimeout(() => {
        deadLine = true;
    }, 3000);
    progressText.anchor.setTo(0.5, 0.5);
    const loadComplete = function () {
        if (deadLine) {
            game.state.start('created');
        } else {
            setTimeout(loadComplete, 1000);
        }
    };

    const loading = progress => {
        pro = progressText.text = progress + '%';
    };

    game.load.onFileComplete.add(loading);
    game.load.onLoadComplete.add(loadComplete);
};

const states = {
    preload: function () {
        this.preload = function () {
            game.stage.backgroundColor = '#000';
            game.load.crossOrigin = 'anonymous'; // 设置跨域
            game.load.image('bg', './img/bg.png');
            game.load.image('dude', './img/dude.png');
            game.load.image('green', './img/green.png');
            game.load.image('red', './img/red.png');
            game.load.image('yellow', './img/yellow.png');
            game.load.image('bomb', './img/bomb.png');
            game.load.image('five', './img/five.png');
            game.load.image('three', './img/three.png');
            game.load.image('one', './img/one.png');
            game.load.audio('bgMusic', './audio/bgm.mp3');
            progressFn(game);
        };
    },
    created: function () {
        this.create = function () {
            // 添加背景
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加标题
            const title = game.add.text(game.world.centerX, game.world.centerY * 0.25, '小恐龙接苹果', {
                fontSize: '40px',
                fontWeight: 'blod',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            // 添加提示
            const remind = game.add.text(game.world.centerX, game.world.centerY * 0.5, '点击任意位置开始', {
                fontSize: '20px',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // 添加主角
            const man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            const manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            // 添加点击事件
            game.input.onTap.add(() => {
                game.state.start('play');
            });
        };
    },
    play: function () {
        let title;
        let man;
        let apples;
        let score = 0;
        this.create = function () {
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
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            // 播放背景音乐
            bgMusic = game.add.audio('bgMusic');
            bgMusic.loopFull();
            const scoreMusic = game.add.audio('scoreMusic');
            const bombMusic = game.add.audio('bombMusic');
            // 添加苹果
            apples = game.add.group();
            const appleTypes = ['green', 'red', 'yellow', 'bomb'];
            const appleTime = game.time.create(true);
            appleTime.loop(500, () => {
                const x = Math.random() * game.world.width;
                const y = 0;
                const type = appleTypes[Math.floor(Math.random() * appleTypes.length)];
                // console.log(x, y, type);
                const apple = apples.create(x, y, type);
                // 设置苹果加入物理运动
                game.physics.enable(apple);
                // 设置苹果大小
                const appleImg = game.cache.getImage(type);
                apple.width = game.world.width / 8;
                apple.height = apple.width / appleImg.width * appleImg.height;
                // 掉落物设置和边界接触
                apple.body.collideWorldBounds = true;
                apple.body.onWorldBounds = new Phaser.Signal();
                apple.body.onWorldBounds.add(function (apple, up, down, left, right) {
                    if (down) {
                        apple.kill();
                        if (apple.key === 'bomb') return;
                        game.state.start('over', true, false, score);
                    }
                });
            });
            appleTime.start();
            // 开启物理引擎
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 300;
            // 监听滑动事件
            let touching = false;
            let dx;
            game.input.onDown.add(pointer => {
                if (Math.abs(pointer.x - man.x) < man.width / 2) {
                    touching = true;
                    dx = man.x - pointer.x;
                }
            });
            game.input.onUp.add(() => {
                touching = false;
            });
            game.input.addMoveCallback((pointer, x, y, isTap) => {
                // console.log(x, y);
                if (!isTap && touching) man.x = x + dx;
            });
        };
        this.update = function () {
            // 检测主角和掉落物的碰撞
            game.physics.arcade.overlap(man, apples, pickApple, null, this);
        };
        const pickApple = function (man, apple) {
            var point = 1;
            var img = 'one';
            if (apple.key === 'red') {
                point = 3;
                img = 'three';
            } else if (apple.key === 'yellow') {
                point = 5;
                img = 'five';
            } else if (apple.key === 'bomb') {
                game.state.start('over', true, false, score);
                return;
            }
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
            showTween.onComplete.add(function () {
                var hideTween = game.add.tween(goal).to({
                    alpha: 0,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
                hideTween.onComplete.add(function () {
                    goal.kill();
                });
            });

            title.text = +score + point;
            score = title.text;
            apple.kill();
        };
    },
    over: function () {
        this.init = function () {
            score = arguments[0];
        };
        this.create = function () {
            game.stage.backgroundColor = '#000';
            // 添加文本
            const title = game.add.text(game.world.centerX, game.world.centerY * 0.25, '游戏结束', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            const scoreStr = '你的得分是：' + score + '分 我姐好厉害么么哒';
            const scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            scoreText.anchor.setTo(0.5, 0.5);
            const remind = game.add.text(game.world.centerX, game.world.height * 0.6, '点击任意位置再玩一次', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // 添加点击事件
            game.input.onTap.add(function () {
                console.log(bgMusic);
                bgMusic.stop();
                game.state.start('play');
            });
        };
    }
};

_Object$keys(states).map(function (key) {
    game.state.add(key, states[key]);
});

// 启动游戏
game.state.start('preload');

//# sourceMappingURL=game.es5.js.map