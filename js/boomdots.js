var states = Object.create(null);
states.boot = function() {
  this.preload = function() {
    if(!game.device.desktop){
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.forcePortrait = true;
      this.scale.refresh();
    }
    game.load.image('loading', './img/flappybird/preloader.gif');
  }
  this.create = function() {
    game.state.start('preload');
  }
};
states.preload = function() {
  this.preload = function() {
    var preloadSprite = game.add.sprite(34, game.height / 2, 'loading');
    game.load.setPreloadSprite(preloadSprite);
    game.load.image('debris0', './img/boomdots/debris0.png');
    game.load.image('debris1', './img/boomdots/debris1.png');
    game.load.spritesheet('balls', './img/boomdots/balls.png', 17, 17);
  }
  this.create = function() {
    game.state.start('created');
  }
};
states.created = function() {
  this.create = function() {
    this.lock = false;

    this.startText = game.add.text(game.world.centerX, game.world.centerY, '开始游戏', {fill: '#fff', font: '20px'});
    this.startText.anchor.setTo(0.5);
    this.startText.inputEnabled = true;
    this.startText.events.onInputDown.add(this.startGame, this);

    this.helpText = game.add.text(game.world.centerX, game.world.centerY + 100, '游戏说明', {fill: '#fff', font: '20px'});
    this.helpText.anchor.setTo(0.5);
    this.helpText.inputEnabled = true;
    this.helpText.events.onInputDown.add(this.help, this);
  };
  this.startGame = function() {
    game.state.start('play');
  };
  this.help = function() {
    if (this.lock) return;
    this.lock = true;
    this.descText = game.add.text(game.world.centerX, game.world.centerY - 200, '点击小球射向大球', {fill: '#fff', font: '20px'});
    this.descText.scale.setTo(0);
    this.descText.anchor.setTo(0.5);
    this.tween = game.add.tween(this.descText.scale)
    .to({x: 1, y: 1}, 2000, Phaser.Easing.Elastic.Out, true);
    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
      this.tween = game.add.tween(this.descText.scale)
      .to({x: 0, y: 0}, 2000, Phaser.Easing.Elastic.Out, true);
      game.time.events.add(2000, function() {
        this.lock = false;
      }, this);
    }, this);
  }
};
states.play = function() {
  var bestScore;
  this.init = function() {
    bestScore = arguments[0];
  };
  this.create = function() {
    var _this = this;
    this.speed = 1;

    this.fire = false;
    this.score = 0;
    this.bestScore = bestScore || 0;
    this.toDown = false;
    // 绘制分数
    this.scoreText = game.add.text(0, 0, `当前得分:${this.score},最高得分:${this.bestScore}`, {fill: '#fff', font: '20px'});
    // 绘制小球和大球
    this.smallBallData = game.add.bitmapData(30, 30);
    this.smallBallData.circle(15, 15, 15, 'gray');
    this.smallBall = game.add.sprite(game.world.centerX, game.world.height - 100, this.smallBallData);
    this.smallBall.anchor.setTo(0.5, 0.5);

    this.bigBallData = game.add.bitmapData(60, 60);
    this.bigBallData.circle(30, 30, 30, 'gray');
    this.bigBall = game.add.sprite(60, game.world.centerY - 100, this.bigBallData);
    this.bigBall.anchor.setTo(0.5, 0.5);

    // 大球进行移动
    this.bigBall.update = function() {
      this.x += _this.speed;
      this.y += 0.1;
      if (this.x + this.width / 2 >= game.world.width) _this.speed = -_this.speed;
      if (this.x - this.width / 2 <= 0) _this.speed = -_this.speed;
    }
    
    this.smallBall.update = function() {
      if (_this.fire) {
        this.y -= 10;
        if (this.y + this.height <= 0) {
          game.state.start('end', true, false, _this.score, _this.bestScore);
        }
      }
    }
    // 加上物理属性
    game.physics.enable(this.smallBall, Phaser.Physics.ARCADE);
    game.physics.enable(this.bigBall, Phaser.Physics.ARCADE);

    // 添加小球发射事件
    game.input.onTap.add(this.emitBall, this);

    // 粒子
    this.emitter = game.add.emitter(0, 0, 100);
    console.log(this.emitter);
    this.emitter.makeParticles('balls');
    this.emitter.gravity = 0;
  }
  this.emitBall = function() {
    this.fire = true;
  }
  this.update = function() {
    game.physics.arcade.collide(this.smallBall, this.bigBall, this.hitBall, null, this);
  }
  this.restartGame = function() {
    game.state.start('play');
  }
  this.hitBall = function() {
    // 击中大球
    this.emitter.x = this.smallBall.x;
    this.emitter.y = this.smallBall.y;
    this.fire = false;
    this.toDown = true;
    this.moveBall();
    this.score += 1;
    if (this.bestScore < this.score) this.bestScore = this.score;
    this.scoreText.text = `当前得分:${this.score},最高得分:${this.bestScore}`;
    this.emitter.start(true, 1000, null, 30);
  }
  this.moveBall = function() {
    this.toDown = false;
    var y = Math.min(game.world.height - 200, game.world.randomY);
    this.bigBall.y = -200;
    game.add.tween(this.bigBall)
    .to({y: y}, 1000, null, true);
    if (this.speed > 0) {
      this.speed += 0.3;
    } else {
      this.speed -= 0.3;
    }
    game.add.tween(this.smallBall)
    .to({y: game.world.height - 100}, 300, null, true);
  }
};
states.end = function() {
  var score = 0;
  var bestScore = 0;
  this.init = function() {
    score = arguments[0];
    bestScore = arguments[1];
  };
  this.create = function() {
    var style = {fill: '#fff', font: '20px', 'align': 'center'};
    this.gameOverText = game.add.text(game.world.centerX, game.world.centerY, `GAME OVER\n分数:${score}, 最高分:${bestScore}`, style);
    this.gameOverText.anchor.setTo(0.5);

    this.playAgain = game.add.text(game.world.centerX, game.world.centerY + 100, `再玩一次`, style);
    this.playAgain.anchor.setTo(0.5);
    this.playAgain.inputEnabled = true;
    this.playAgain.events.onInputDown.add(this.startGame, this);
  };
  this.startGame = function() {
    game.state.start('play', true, false, bestScore);
  };
};
var game = new Phaser.Game(288, 505, Phaser.CANVAS);

for (var key in states) {
  game.state.add(key, states[key], true);
}
// 启动游戏
game.state.start('boot');
