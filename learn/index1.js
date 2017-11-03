
var main = function() {
  this.init = function() {
    console.log('init')
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
  };
  this.preload = function() {
    console.log('preload');
    game.load.image('bg', '../img/bg.png');
    game.load.spritesheet('bird', '../img/flappybird/bird34*24*3.png', 34, 24, 3);
    game.load.image('gameover', '../img/flappybird/gameover.png');
  }
  this.create = function() {
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // this.pointer = game.input.activePointer;
    // var bg = game.add.image(0, 0, 'bg');
    // bg.width = game.world.width;
    // bg.height = game.world.height;
    // bg.inputEnabled = true;
    // bg.input.enableDrag();
    // this.x = game.add.text(100, 100, 'x:0');
    // this.y = game.add.text(100, 140, 'y:0');
    // this.isDown = game.add.text(100, 180, 'isDown:false');
    // this.isUp = game.add.text(100, 220, 'isUp:true');

    // game.onPause.add(() => {
    //   console.log('onPause');
    // });
    // game.onResume.add(() => {
    //   console.log('onResume');
    // });
    // game.scale.onOrientationChange.add((scale, prevOrientation, wasIncorrect) => {
    //   console.log(scale, prevOrientation, wasIncorrect);
    // });

    // this.bird = game.add.sprite(0, 0, 'bird');
    // this.bird.animations.add('fly');
    // this.bird.animations.play('fly', 30, true);
    // game.physics.arcade.enable(this.bird);
    // this.bird.body.bounce.y = 0.2;
    // this.bird.body.gravity.y = 10;
    // this.bird.inputEnabled = true;
    // this.bird.input.enableDrag();

    // var bmd = game.add.bitmapData(100, 100);
    // bmd.ctx.beginPath();
    // bmd.ctx.rect(0, 0, 100, 100);
    // bmd.ctx.strokeStyle = 'black';
    // bmd.ctx.fillStyle = '#fff';
    // bmd.ctx.fill();
    // bmd.ctx.stroke();
    // this.block = game.add.sprite(0, 0, bmd);
    // this.block.inputEnabled = true;
    // this.block.input.enableDrag();
    
    // this.block.tint = 0xffffff;
    // console.log(this.block.events);
    // this.block.events.onInputDown.add(function() {
    //   console.log('hold');
    // }, this);

    // var data = [ ' 333 ', ' 777 ', 'E333E', ' 333 ', ' 3 3 ' ];
    // game.create.texture('bob', data);
    // this.data = game.add.sprite(100, 100, 'bob');
    // this.data.width = 100;
    // this.data.height = 100;
    // console.log(this.data);

    // this.text = game.add.text(0, 0, 'ahdj ashdake riwp   wpeirpwoe');
    // this.text.fontSize = 60;
    // this.text.fill = '#fff';
    // this.text.wordWrap = true;
    // this.text.wordWrapWidth = 150;


    // this.group1 = game.add.group();
    // this.group1.create(0, 10, 'gameover');

    // this.group1.setAll('inputEnabled', true);
    // this.group1.callAll('events.onInputDown.add', 'events.onInputDown', removeCoin);
    
    game.world.setBounds(0, 0, 2000, 400);

    this.bird = game.add.sprite(0, 0, 'bird');
    this.bird.animations.add('fly', null, 20, true);
    this.bird.animations.play('fly');
    game.add.tween(this.bird)
    .to({x: game.world.width - this.bird.width}, 5000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

    this.bird1 = game.make.sprite(100, 100, 'bird');
    game.world.add(this.bird1);
    var tween = game.add.tween(this.bird1);
    tween.to({alpha: 0}, 1000, 'Linear', true, 0, -1);
    tween.yoyo(true, 0);
    
    this.bird2 = game.add.sprite(game.world.centerX, game.world.centerY, 'bird');
    this.bird2.anchor.setTo(0.5);
    game.add.tween(this.bird2)
    .to({y: 30}, 2000, null, true, 0, -1, true);

    game.input.onDown.add(function() {
      game.camera.focusOn(this.bird);
    }, this);

    this.bird3 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bird');
    // this.bird3.autoScroll(100, 100);

  }
  
  this.update = function() {
    // var x = this.pointer.clientX;
    // var y = this.pointer.clientY;
    // this.x.text = `x:${x}`;
    // this.y.text = `y:${y}`;
    // this.isDown.text = `isDown:${this.pointer.isDown}`;
    // this.isUp.text = `isUp:${this.pointer.isUp}`;
    // game.camera.follow(this.bird);
    game.camera.x++;
    game.camera.y++;
    if (game.camera.x % 9 === 0) {
      game.camera.y = game.camera.x = 0;
    }
  }
  this.render = function() {
    // game.debug.spriteBounds(this.data);
  }
}
var game = new Phaser.Game(320, 480, Phaser.CANVAS, '', main);


// game.state.start('main');