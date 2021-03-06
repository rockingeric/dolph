 var total_points = 0;
      // Now set up your game (most games will load a separate .js file)
      var Q = Quintus({ development: true })                          // Create a new engine instance
              .include("Sprites, Scenes, Anim, Input, 2D, Touch, UI, Audio") // Load any needed modules
              .setup({width: 900})               // Add a canvas element onto the page
              .controls()                        // Add in default controls (keyboard, buttons)
              .touch();                          // Add in touch support (for the UI)

      Q.component("pistol", {
        added: function() {
          // Start the ammo out 1/2 filled
          this.entity.p.ammo = 30;
        },

        refillAmmo: function() {
          // We need to say this.entity because refillAmmo is 
          // added on the component
          this.entity.p.ammo = 60;
        },

        extend: {
          fire: function() {
            // We can use this.p to set properties
            // because fire is called directly on the player
            if(this.p.ammo > 0) {
              this.p.ammo-=1;
              console.log("Fire!");
            }
            return this.p.ammo;
          }      
        }
      });

      // You can create a sub-class by extending the Q.Sprite class to create Q.Player
      Q.Sprite.extend("Player",{

        // the init constructor is called on creation
        init: function(p) {
        
          // You can call the parent's constructor with this._super(..)
          this._super(p, {
            sheet: "player",  // Setting a sprite sheet sets sprite width and height
            hitPoints: 50,
            damage: 5,
            x: 410,           // You can also set additional properties that can
            y: 150            // be overridden on object creation
          });

          
          // Add in pre-made components to get up and running quickly
          this.add('2d, platformerControls, pistol');
          Q.input.on("fire",this,"fireWeapon");
          Q.input.on("refill",this,"reloadWeapon");

          // Write event handlers to respond hook into behaviors.
          // hit.sprite is called everytime the player collides with a sprite
          
          this.on("hit.sprite",function(collision) {
            // Check the collision, if it's the Tower, you win!
            if(collision.obj.isA("Tower")) {
              /*BLOCO ABAIXO FAZ O SPRITE RECARREGAR A ARMA E LOGO APÓS SOME*/
              /*var tower = collision.obj;
              this.pistol.refillAmmo();
              console.log("refillAmmo");
              tower.destroy();*/

              // Stage the endGame scene above the current stage
              Q.stageScene("proxGame",1, { label: "Você engordou! :D" }); 
              // Remove the player to prevent them from moving
              this.destroy();
            }
          });
        },
        fireWeapon: function() {
            var fire = this.fire();
            fire;
            if (fire > 0 ) {
              var x = parseInt(this.p.x)+30;
              var y = parseInt(this.p.y);
              var bullet = new Q.Bullet({ x: x, y: y })
              this.stage.insert(bullet);
            };
        },
        reloadWeapon: function() {
            this.pistol.refillAmmo();
        }
        
      });


      // Sprites can be simple, the Tower sprite just sets a custom sprite sheet
      Q.Sprite.extend("Tower", {
        init: function(p) {
          this._super(p, { sheet: 'tower'});
        }
      });

      // Sprites can be simple, the Tower sprite just sets a custom sprite sheet
      Q.Sprite.extend("Bullet", {
        init: function(p) {
          this._super(p, { sheet: 'bullet', damage: 5, vx: 100 });

          this.add('2d');

          var en = this;

          this.on("bump.left,bump.right,bump.top",function(collision) {
            if(collision.obj.isA("Enemy")) { 
              var enemy = collision.obj;
              var damage = en.p.damage;

              enemy.p.hitPoints -= damage;
              console.log(enemy.p.hitPoints);
              if (enemy.p.hitPoints <= 0) {
                collision.obj.destroy();  
              };
            }
            this.destroy();
          });
        }
      });

      // Create the Enemy class to add in some baddies
      Q.Sprite.extend("Enemy",{
        init: function(p) {
          this._super(p, { sheet: 'enemy',damage: 5, hitPoints: 10, vx: 100 });
          
          // Enemies use the Bounce AI to change direction 
          // whenver they run into something.
          this.add('2d, aiBounce');

          var en = this;
          
          // Listen for a sprite collision, if it's the player,
          // end the game unless the enemy is hit on top
          this.on("bump.left,bump.right,bump.bottom",function(collision) {
            if(collision.obj.isA("Player")) { 
              var player = collision.obj;
              var damage = en.p.damage;

              player.p.hitPoints = player.p.hitPoints - damage;

              console.log(player.p.hitPoints);
              if(player.p.hitPoints <= 0){
                Q.stageScene("endGame",1, { label: "Você emagreceu! :(" }); 
                collision.obj.destroy();
              }
              
            }
          });

          
          // If the enemy gets hit on the top, destroy it
          // and give the user a "hop"
          this.on("bump.top",function(collision) {
            if(collision.obj.isA("Player")) { 
              this.destroy();
              collision.obj.p.vy = -300;
              Q.state.inc("score",10);
            }
          });
        }
      });


      /*Q.scene('fireBullet',function(stage) {
        stage.insert(new Q.Bullet({ x: 450, y: 180 }));
      });*/



      // To display a game over / game won popup box, 
      // create a endGame scene that takes in a `label` option
      // to control the displayed message.
      Q.scene('endGame',function(stage) {
        var container = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,200,0,1)"
        }));
        
        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                        label: "Jogar de novo!" }))         
        var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                         label: stage.options.label }));
        // When the button is clicked, clear all the stages
        // and restart the game.
        button.on("click",function() {
          Q.clearStages();
          Q.stageScene('level1');
        });
        
        // Expand the container to visibily fit it's contents
        container.fit(20);
      });

      Q.scene('proxGame',function(stage) {
        var container = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,200,0,1)"
        }));
        
        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                        label: "Próxima fase!" }))         
        var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                         label: stage.options.label }));
        // When the button is clicked, clear all the stages
        // and restart the game.
        button.on("click",function() {
          Q.clearStages();
          Q.stageScene('level2');
        });
        
        // Expand the container to visibily fit it's contents
        container.fit(20);
      });

      Q.load("sprites.png, sprites.json, level.json, level2.json, tiles.png",
      // The callback will be triggered when everything is loaded
      function() {
        // Sprites sheets can be created manually
        Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
        
        // Or from a .json asset that defines sprite locations
        Q.compileSheets("sprites.png","sprites.json");
        
        // Finally, call stageScene to run the game
        Q.stageScene("level1");
      });