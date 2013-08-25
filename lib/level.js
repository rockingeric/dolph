      // Create a new scene called level 1
      Q.scene("level1",function(stage) {

        // Add in a tile layer, and make it the collision layer
        stage.collisionLayer(new Q.TileLayer({
                                   dataAsset: 'level.json',
                                   sheet:     'tiles' }));
                                   
        // Create the player and add him to the stage
        var player = stage.insert(new Q.Player());
        //var hitPoints = player.hitPoints;

        Q.state.reset({ score: 0, lives: 2 });

        Q.UI.Text.extend("Pontos",{ 
          init: function(p) {
            this._super({
              label: "Pontos: 0",
              x: 100,
              y: 100
            });

            Q.state.on("change.score",this,"score");
          },

          score: function(score) {
            this.p.label = "Pontos: " + score;
          }
        });

        
        // Give the stage a moveable viewport and tell it
        // to follow the player.
        stage.add("viewport").follow(player);

        
        // Add in a couple of enemies
        stage.insert(new Q.Enemy({ x: 700, y: 0 }));
        stage.insert(new Q.Enemy({ x: 800, y: 0 }));
        
        // Finally add in the tower goal
        stage.insert(new Q.Tower({ x: 180, y: 50 }));
      });

       // Create a new scene called level 2
      Q.scene("level2",function(stage) {

        // Add in a tile layer, and make it the collision layer
        stage.collisionLayer(new Q.TileLayer({
                                   dataAsset: 'level2.json',
                                   sheet:     'tiles' }));
                                   
        // Create the player and add him to the stage
        var player = stage.insert(new Q.Player());
        
        // Give the stage a moveable viewport and tell it
        // to follow the player.
        stage.add("viewport").follow(player);
        
        // Add in a couple of enemies
        stage.insert(new Q.Enemy({ x: 700, y: 0 }));
        stage.insert(new Q.Enemy({ x: 800, y: 0 }));
        stage.insert(new Q.Enemy({ x: 600, y: 0 }));
        stage.insert(new Q.Enemy({ x: 1500, y: 336 }));
        stage.insert(new Q.Enemy({ x: 1520, y: 336 }));
        stage.insert(new Q.Enemy({ x: 1540, y: 336 }));
        
        // Finally add in the tower goal
        stage.insert(new Q.Tower({ x: 1550, y: 336 }));
      });